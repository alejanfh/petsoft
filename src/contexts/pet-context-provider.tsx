"use client";
import { Pet } from "@/lib/types";
import { ReactNode, createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
};

export const PetContext = createContext<TPetContext | null>(null);

type PetContextProviderProps = {
  children: ReactNode;
  data: Pet[];
};

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / actions
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    // Vamos recorriendo la lista de pets y comprobamos si el pet.id !== id
    // si es true (no es el id que estamos buscando), se queda en el array de pets
    // si es false (hemos encontrado el pet con el id que buscamos), hacemos filter out
    // (a tomar por culo el perro)
    setPets((prev) => prev.filter((pet) => pet.id !== id));

    setSelectedPetId(null);
  };

  // Cuando se llama a esta funcion desde el form, no vamos a hacer que el
  // usuario ponga el id en el input
  // Entonces hacemos que no haga falta pasarle el id con el Omit
  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    // Para crear un id aleatorio único, se puede utilizar la fecha
    setPets((prev) => [...prev, { id: Date.now().toString(), ...newPet }]);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        numberOfPets,
        handleChangeSelectedPetId,
        handleCheckoutPet,
        handleAddPet,
        selectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
