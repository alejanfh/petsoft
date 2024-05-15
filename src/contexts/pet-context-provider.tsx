"use client";
import { addPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { ReactNode, createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => void;
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
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    // Para crear un id aleatorio único, se puede utilizar la fecha
    // setPets((prev) => [...prev, { id: Date.now().toString(), ...newPet }]);

    // Esto es llamando al endpoint directamente para que se cree en la bd
    await addPet(newPet);
  };

  const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => {
    // Pillas todos los prets previos, los recorres con el .map y
    // miras cual es el pet con el id que quieres.
    // Aquí retornas un objeto con el id del petId que quieres editar
    // y haces spread de los atributos del newPetData
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return {
            id: petId,
            ...newPetData,
          };
        }
        return pet;
      })
    );
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
        handleEditPet,
        selectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
