"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget);
  //   // formData.entries te permite leer toda la data del Form
  //   // lo ponemos dentro de un Object de hjavascript tipico
  //   // pet entonces sera un objeto tipico ( lo estructura con el atributo name del input)
  //   // console.log(pet)
  //   // {
  //   //  age: "2"
  //   //  imageUrl: ""
  //   //  name: "Mike"
  //   //  notes: "allergic to peanuts"
  //   //  ownerName: "Sean"
  //   // }

  //   // const newPet = Object.fromEntries(formData.entries());

  //   // Ponemos el required en los inputs para indicar que van a estar llenos siempre
  //   // pero el formData infiere el type como string | null, entonces se pone el as string
  //   // el + es para convertirlo en Number

  //   const newPet = {
  //     name: formData.get("name") as string,
  //     ownerName: formData.get("ownerName") as string,
  //     imageUrl: (formData.get("imageUrl") as string) || DEFAULT_PET_IMAGE,
  //     age: +(formData.get("age") as string),
  //     notes: formData.get("notes") as string,
  //   };

  //   if (actionType === "add") {
  //     handleAddPet(newPet);
  //   } else if (actionType === "edit") {
  //     handleEditPet(selectedPet!.id, newPet);
  //   }

  //   onFormSubmission();
  // };

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
            name="name"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
          />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""}
          />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.age : ""}
          />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            required
            defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
          />
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
