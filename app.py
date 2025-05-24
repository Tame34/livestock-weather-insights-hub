# Updated app.py
from flask_cors import CORS
CORS(app)

from flask import Flask, render_template, request, jsonify
import json
import pandas as pd
import numpy as np
import joblib
import csv
import os
import requests
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

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
    for name in ["Body_Temperature_C", "Respiration_Rate_bpm", "Cooling_Effect"]
}

SPECIES = ['cattle', 'goat', 'sheep']
BREEDS = {
    sp: list(LABEL_ENCODERS.get(f"{sp.capitalize()}_Breed", LabelEncoder()).classes_)
    for sp in SPECIES
}
AGES = {
    sp: list(LABEL_ENCODERS.get(f"{sp}_age_group", LabelEncoder()).classes_)
    for sp in SPECIES
}

SEVERITY_LABELS = ["Normal", "Mild", "Moderate", "Severe"]
ADVICE = {
    0: "No immediate action needed. Ensure animals have shade and water.",
    1: "Monitor animals closely and provide extra water access.",
    2: "Reduce handling. Cool housing and ensure airflow.",
    3: "Take immediate action: misting, fans, or relocate animals to cooler areas."
}

WEATHERSTACK_API_KEY = 'e33ddff998a18c784c2dcc891fa73561'  # Replace with your real key
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


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", species=SPECIES, breeds=BREEDS, ages=AGES)


@app.route('/predict', methods=['POST'])
def predict():
    species = request.form.get('species')
    breed = request.form.get('breed')
    age = request.form.get('age')
    temperature = float(request.form.get('temperature'))
    humidity = float(request.form.get('humidity'))
    wind_speed = float(request.form.get('wind_speed'))
    solar_radiation = float(request.form.get('solar_radiation'))

    # 🔽 Your ML logic here (replace this with real model)
    stress_level = 2
    severity = ["Normal", "Mild", "Moderate", "Severe"][stress_level]
    advice = "Provide shade and water, limit handling."

    predictions = {
        "Body_Temperature_C": 39.5,
        "Respiration_Rate_bpm": 60,
        "Cooling_Effect": 70
    }

    return jsonify({
        "predictions": predictions,
        "stress_level": stress_level,
        "severity": severity,
        "advice": advice
    })

    # Prepare input for model
    full_input = {f: 0.0 for f in FEATURES}
    full_input.update(env)
    full_input[f"{species.capitalize()}_Breed"] = LABEL_ENCODERS[f"{species.capitalize()}_Breed"].transform([breed])[0]
    full_input[f"{species}_age_group"] = LABEL_ENCODERS[f"{species}_age_group"].transform([age])[0]
    X = pd.DataFrame([full_input])[FEATURES]

    predictions = {
        name: float(MODELS[name].predict(X)[0])
        for name in MODELS
    }

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
    "stress_level": stress_level,
    "severity": severity,
    "advice": advice
})



@app.route("/get_weather", methods=["POST"])
def get_weather():
    data = request.get_json()
    lat = data.get("lat")
    lon = data.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Missing coordinates."}), 400

    try:
        url = f"http://api.weatherstack.com/current?access_key={WEATHERSTACK_API_KEY}&query={lat},{lon}"
        res = requests.get(url)
        weather = res.json()

        if 'current' not in weather:
            return jsonify({"error": "Weather data not available."}), 500

        return jsonify({
            "temperature": weather['current']['temperature'],
            "humidity": weather['current']['humidity'],
            "wind_speed": weather['current'].get('wind_speed', 0),
            "solar_radiation": 800,  # Estimated
            "location": f"{weather['location']['name']}, {weather['location']['country']}"
        })
    except Exception as e:
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
