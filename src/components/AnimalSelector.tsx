
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLivestock } from "@/contexts/LivestockContext";
import { SPECIES, BREEDS, AGE_GROUPS } from "@/data/mockData";
import { useEffect } from "react";

const AnimalSelector = () => {
  const { animalInfo, setAnimalInfo } = useLivestock();
  
  // Set default values for breed and age when species changes
  useEffect(() => {
    if (animalInfo.species && (!animalInfo.breed || !animalInfo.age)) {
      const speciesBreeds = BREEDS[animalInfo.species as keyof typeof BREEDS] || [];
      const speciesAges = AGE_GROUPS[animalInfo.species as keyof typeof AGE_GROUPS] || [];
      
      setAnimalInfo(prev => ({
        ...prev,
        breed: prev.breed || (speciesBreeds.length > 0 ? speciesBreeds[0] : ''),
        age: prev.age || (speciesAges.length > 0 ? speciesAges[0] : '')
      }));
    }
  }, [animalInfo.species, setAnimalInfo]);
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="species">Animal Type</Label>
        <Select
          value={animalInfo.species}
          onValueChange={(value) => setAnimalInfo({ ...animalInfo, species: value, breed: '', age: '' })}
        >
          <SelectTrigger id="species" className="capitalize">
            <SelectValue placeholder="Select animal type" />
          </SelectTrigger>
          <SelectContent>
            {SPECIES.map((species) => (
              <SelectItem key={species} value={species} className="capitalize">
                {species}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="breed">Breed</Label>
        <Select
          value={animalInfo.breed}
          onValueChange={(value) => setAnimalInfo({ ...animalInfo, breed: value })}
          disabled={!animalInfo.species}
        >
          <SelectTrigger id="breed">
            <SelectValue placeholder="Select breed" />
          </SelectTrigger>
          <SelectContent>
            {(animalInfo.species && BREEDS[animalInfo.species as keyof typeof BREEDS] || []).map((breed) => (
              <SelectItem key={breed} value={breed}>
                {breed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age Group</Label>
        <Select
          value={animalInfo.age}
          onValueChange={(value) => setAnimalInfo({ ...animalInfo, age: value })}
          disabled={!animalInfo.species}
        >
          <SelectTrigger id="age">
            <SelectValue placeholder="Select age group" />
          </SelectTrigger>
          <SelectContent>
            {(animalInfo.species && AGE_GROUPS[animalInfo.species as keyof typeof AGE_GROUPS] || []).map((age) => (
              <SelectItem key={age} value={age}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AnimalSelector;
