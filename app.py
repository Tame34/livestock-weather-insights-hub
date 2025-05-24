
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import pandas as pd
import numpy as np
import joblib
import csv
import os
import requests
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

# Load config and models
with open("model_features.json") as f:
    FEATURES = json.load(f)

with open("label_encoders.json") as f:
    label_data = json.load(f)
    LABEL_ENCODERS = {
        col: LabelEncoder().fit(classes) for col, classes in
        {k: np.array(v) for k, v in label_data.items()}.items()
    }

MODELS = {
    name: joblib.load(f"{name}_model.pkl")
    for name in ["Body_Temperature_C", "Respiration_Rate_bpm"]
}

SPECIES = ['cattle', 'goat', 'sheep']
BREEDS = {
    'cattle': [
        'Muturu',
        'Red Bororo', 
        'Sokoto Gudali',
        'White Fulani'
    ],
    'goat': [
        'Sahel',
        'Sokoto Red',
        'West African Dwarf'
    ],
    'sheep': [
        'Balami',
        'Uda',
        'Yankasa'
    ]
}

AGES = {
    'cattle': ['adult', 'calf', 'yearling'],
    'goat': ['adult', 'kid', 'yearling'],
    'sheep': ['adult', 'lamb', 'yearling']
}

SEVERITY_LABELS = ["Normal", "Mild", "Moderate", "Severe"]
ADVICE = {
    0: "No immediate action needed. Ensure animals have shade and water.",
    1: "Monitor animals closely and provide extra water access.",
    2: "Reduce handling. Cool housing and ensure airflow.",
    3: "Take immediate action: misting, fans, or relocate animals to cooler areas."
}

# Add your WeatherStack API key here
WEATHERSTACK_API_KEY = 'e33ddff998a18c784c2dcc891fa73561'  # Replace with your actual key
REPORT_LOG = "stress_report.csv"


def calculate_stress_level(env):
    stress_index = env['temperature'] * 0.5 + env['humidity'] * 0.3 + env['solar_radiation'] * 0.15 - env['wind_speed'] * 2
    if stress_index < 50:
        return 0
    elif stress_index < 65:
        return 1
    elif stress_index < 80:
        return 2
    return 3


def estimate_solar_radiation(uv_index, cloud_cover):
    """Estimate solar radiation based on UV index and cloud cover"""
    max_radiation = 1200
    cloud_factor = 1 - (cloud_cover / 100) * 0.8
    uv_factor = uv_index / 10
    
    hour = pd.Timestamp.now().hour
    time_of_day_factor = 1 - abs(hour - 12) / 12
    
    return round(max_radiation * cloud_factor * uv_factor * time_of_day_factor)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", species=SPECIES, breeds=BREEDS, ages=AGES)


@app.route('/get_weather', methods=['POST'])
def get_weather():
    """Fetch weather data using backend API key"""
    data = request.get_json()
    location = data.get("location")
    
    if not location:
        return jsonify({"error": "Location is required"}), 400

    try:
        url = f"http://api.weatherstack.com/current?access_key={WEATHERSTACK_API_KEY}&query={location}"
        response = requests.get(url)
        weather_data = response.json()

        if 'error' in weather_data:
            return jsonify({"error": weather_data['error']['info']}), 400

        if 'current' not in weather_data or 'location' not in weather_data:
            return jsonify({"error": "Invalid weather data received"}), 500

        current = weather_data['current']
        location_data = weather_data['location']
        
        # Calculate solar radiation
        solar_radiation = estimate_solar_radiation(
            current.get('uv_index', 0), 
            current.get('cloudcover', 0)
        )

        return jsonify({
            "temperature": current['temperature'],
            "humidity": current['humidity'],
            "wind_speed": current.get('wind_speed', 0),
            "solar_radiation": solar_radiation,
            "uv_index": current.get('uv_index', 0),
            "cloudcover": current.get('cloudcover', 0),
            "weather_descriptions": current.get('weather_descriptions', ['Unknown']),
            "weather_icons": current.get('weather_icons', []),
            "location": {
                "name": location_data['name'],
                "region": location_data['region'],
                "country": location_data['country']
            }
        })
    except Exception as e:
        print(f"Weather API error: {str(e)}")
        return jsonify({"error": "Failed to fetch weather data"}), 500


@app.route('/predict', methods=['POST'])
def predict():
    try:
        species = request.form.get('species')
        breed = request.form.get('breed')
        age = request.form.get('age')
        temperature = float(request.form.get('temperature'))
        humidity = float(request.form.get('humidity'))
        wind_speed = float(request.form.get('wind_speed'))
        solar_radiation = float(request.form.get('solar_radiation'))

        env = {
            "temperature": temperature,
            "humidity": humidity,
            "wind_speed": wind_speed,
            "solar_radiation": solar_radiation
        }

        print(f"Processing prediction for: {species} - {breed} - {age}")
        print(f"Environmental conditions: {env}")
        print(f"Available features in model: {FEATURES}")

        # Prepare input for model - Initialize with zeros
        full_input = {feature: 0.0 for feature in FEATURES}
        
        # Add environmental conditions
        for key, value in env.items():
            if key in full_input:
                full_input[key] = value
                print(f"Set {key} = {value}")

        # Handle breed encoding
        breed_key = f"{species.capitalize()}_Breed"
        if breed_key in LABEL_ENCODERS:
            try:
                breed_encoded = LABEL_ENCODERS[breed_key].transform([breed])[0]
                full_input[breed_key] = breed_encoded
                print(f"Encoded breed '{breed}' as {breed_encoded} for key '{breed_key}'")
            except ValueError as e:
                print(f"Breed encoding error: {e}")
                return jsonify({"error": f"Unknown breed: {breed}"}), 400
        
        # Handle age encoding
        age_key = f"{species}_age_group"
        if age_key in LABEL_ENCODERS:
            try:
                age_encoded = LABEL_ENCODERS[age_key].transform([age])[0]
                full_input[age_key] = age_encoded
                print(f"Encoded age '{age}' as {age_encoded} for key '{age_key}'")
            except ValueError as e:
                print(f"Age encoding error: {e}")
                return jsonify({"error": f"Unknown age group: {age}"}), 400

        # Create DataFrame with correct feature order
        X = pd.DataFrame([full_input])[FEATURES]
        print(f"Model input shape: {X.shape}")
        print(f"Model input values: {X.iloc[0].to_dict()}")

        # Make predictions
        predictions = {}
        for name, model in MODELS.items():
            try:
                pred_value = float(model.predict(X)[0])
                predictions[name] = pred_value
                print(f"Predicted {name}: {pred_value}")
            except Exception as e:
                print(f"Error predicting {name}: {e}")
                predictions[name] = 0.0

        stress_level = calculate_stress_level(env)
        severity = SEVERITY_LABELS[stress_level]
        advice = ADVICE[stress_level]

        # Log the report
        log_data = {
            "species": species,
            "breed": breed,
            "age": age,
            **env,
            **predictions,
            "stress_level": severity,
            "advice": advice
        }
        write_report(log_data)

        return jsonify({
            "predictions": predictions,
            "Body_Temperature_C": predictions["Body_Temperature_C"],
            "Respiration_Rate_bpm": predictions["Respiration_Rate_bpm"],
            "stress_level": stress_level,
            "severity": severity,
            "advice": advice
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def write_report(data):
    file_exists = os.path.isfile(REPORT_LOG)
    with open(REPORT_LOG, mode='a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data.keys())
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)


if __name__ == "__main__":
    app.run(debug=True)
