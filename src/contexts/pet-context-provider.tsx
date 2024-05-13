"use client";
import { Pet } from "@/lib/types";
import { ReactNode, createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
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

  return (
    <PetContext.Provider value={{ pets, selectedPetId }}>
      {children}
    </PetContext.Provider>
  );
}
