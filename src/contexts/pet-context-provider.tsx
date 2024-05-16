"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import { ReactNode, createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>;
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
  data: pets,
}: PetContextProviderProps) {
  // state
  // Se quita porque con el revalidatePath no funcionaba, porque no volvia
  // a inicializar el use state con data, se quedaba con el data del principio
  // 1. const [pets, setPets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // 2. Se utiliza useOptimistic, parecido a useState, que afecta a client y server
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    pets,
    (prev, { action, payload }) => {
      switch (action) {
        case "add":
          return [...prev, { ...payload, id: Math.random().toString() }];
        case "edit":
          return prev.map((pet) => {
            if (pet.id === payload.id) {
              // payload.newPetData sobreescribes el ...pet
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return prev.filter((pet) => pet.id !== payload);
        default:
          return prev;
      }
    }
  );

  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  const handleChangeSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };

  // Cuando se llama a esta funcion desde el form, no vamos a hacer que el
  // usuario ponga el id en el input
  // Entonces hacemos que no haga falta pasarle el id con el Omit
  const handleAddPet = async (newPet: PetEssentials) => {
    /* 1. Para crear un id aleatorio único, se puede utilizar la fecha
    setPets((prev) => [...prev, { id: Date.now().toString(), ...newPet }]);

    Esto es llamando al endpoint directamente para que se cree en la bd
    await addPet(newPet);*/

    // si devuelve algo, será un error, sino habrá ido todo bien
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);

    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
    /*Pillas todos los prets previos, los recorres con el .map y
    miras cual es el pet con el id que quieres.
    Aquí retornas un objeto con el id del petId que quieres editar
    y haces spread de los atributos del newPetData

    1. setPets((prev) =>
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

    await editPet(petId, newPetData);*/

    setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });

    const error = await editPet(petId, newPetData);

    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: Pet["id"]) => {
    /*Vamos recorriendo la lista de pets y comprobamos si el pet.id !== id
    si es true (no es el id que estamos buscando), se queda en el array de pets
    si es false (hemos encontrado el pet con el id que buscamos), hacemos filter out
    (a tomar por culo el perro)
  
    1. setPets((prev) => prev.filter((pet) => pet.id !== id));*/

    setOptimisticPets({ action: "delete", payload: petId });

    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }

    setSelectedPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
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
