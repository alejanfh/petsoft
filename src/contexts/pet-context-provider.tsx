"use client";
import { Pet } from "@/lib/types";
import { ReactNode, createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
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
  const [pets, setPets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{ pets, selectedPetId, handleChangeSelectedPetId, selectedPet }}
    >
      {children}
    </PetContext.Provider>
  );
}
