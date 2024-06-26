"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TPetForm, petFormSchema } from "@/lib/validations";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
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
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
    // esto es para poner los defaultValues en el form del edit
    defaultValues:
      actionType === "edit"
        ? {
            name: selectedPet?.name,
            ownerName: selectedPet?.ownerName,
            imageUrl: selectedPet?.imageUrl,
            age: selectedPet?.age,
            notes: selectedPet?.notes,
          }
        : undefined,
  });

  return (
    <form
      action={async () => {
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

        /*Para cerrar el popup/dialog
        Error: Si hay dentro de este action={} varios setState..., react los agrupa por performance
        entonces MAL, y los setState empezaran todos a la vez, y queremos que el onFormSubmision sea
        el último, se añade flushSync*/
        onFormSubmission();

        /* Antes
        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl: (formData.get("imageUrl") as string) || DEFAULT_PET_IMAGE,
          age: Number(formData.get("age") as string),
          notes: formData.get("notes") as string,
        };
        */

        // Ya pillamos el contenido del form desde el useForm, con todos los types correctos
        const petData = getValues();
        // Se hace este verificado porque el .transform en el zod solo afecta al onSubmit, aun no a action={}
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;

        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className=" space-y-3">
        <div className=" space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}

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
          <Input id="ownerName" {...register("ownerName")} />
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
