"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { useForm } from "react-hook-form";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

type TPetForm = {
  name: string;
  ownerName: string;
  imageUrl: string;
  age: number;
  notes: string;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  /* const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
    formData.entries te permite leer toda la data del Form
    lo ponemos dentro de un Object de hjavascript tipico
    pet entonces sera un objeto tipico ( lo estructura con el atributo name del input)
    console.log(pet)
    {
     age: "2"
     imageUrl: ""
     name: "Mike"
     notes: "allergic to peanuts"
     ownerName: "Sean"
    }

    const newPet = Object.fromEntries(formData.entries());

    Ponemos el  en los inputs para indicar que van a estar llenos siempre
    pero el formData infiere el type como string | null, entonces se pone el as string
    el + es para convertirlo en Number */

  /* const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl: (formData.get("imageUrl") as string) || DEFAULT_PET_IMAGE,
      age: +(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };

    if (actionType === "add") {
      handleAddPet(newPet);
    } else if (actionType === "edit") {
      handleEditPet(selectedPet!.id, newPet);
    }

    onFormSubmission();
  };*/

  /* 2. React-hook-form -> Típicamente cuando se utiliza un form, se suele utilizar
        useState para trackear el valor y el estado del input. El problema es que cada
        vez que escribes, hará un render y eso es MAL.
        
        Hacemos toda la gestion con el useForm
        */

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<TPetForm>();

  return (
    <form
      action={async (formData) => {
        /* if (actionType === "add") {
          // si devuelve algo, será un error, sino habrá ido todo bien
          const error = await addPet(formData);

          if (error) {
            toast.warning(error.message);
            return;
          }
        } else if (actionType === "edit") {
          // si devuelve algo, será un error, sino habrá ido todo bien
          const error = await editPet(selectedPet!.id, formData);

          if (error) {
            toast.warning(error.message);
            return;
          }
        }*/

        // Esto llama al form y la gestion de errores que hemos hecho con el react-hook-form
        const result = await trigger();

        // si hay un result significa que ha habido errores, entonces no sigue con el submit y
        // pone los errores debajo de los inputs
        if (!result) return;

        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl: (formData.get("imageUrl") as string) || DEFAULT_PET_IMAGE,
          age: Number(formData.get("age") as string),
          notes: formData.get("notes") as string,
        };

        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }

        /*Para cerrar el popup/dialog
        Error: Si hay dentro de este action={} varios setState..., react los agrupa por performance
        entonces MAL, y los setState empezaran todos a la vez, y queremos que el onFormSubmision sea
        el último, se añade flushSync*/
        onFormSubmission();
      }}
      className="flex flex-col"
    >
      <div className=" space-y-3">
        <div className=" space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
            })}

            // name="name"
            // type="text"
            // defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
          {errors.name && (
            <p className=" text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className=" space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register("ownerName", {
              required: "OwnerName is required",
              maxLength: {
                value: 20,
                message: "Owner name must be less than 20 characters long",
              },
            })}
          />
          {errors.ownerName && (
            <p className=" text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className=" space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className=" text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className=" space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} />
          {errors.age && <p className=" text-red-500">{errors.age.message}</p>}
        </div>

        <div className=" space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className=" text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
