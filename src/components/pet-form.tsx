"use client";

import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";

type PetFormProps = {
  type: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PetForm({ type, onFormSubmission }: PetFormProps) {
  const { handleAddPet } = usePetContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    // formData.entries te permite leer toda la data del Form
    // lo ponemos dentro de un Object de hjavascript tipico
    // pet entonces sera un objeto tipico ( lo estructura con el atributo name del input)
    // console.log(pet)
    // {
    //  age: "2"
    //  imageUrl: ""
    //  name: "Mike"
    //  notes: "allergic to peanuts"
    //  ownerName: "Sean"
    // }

    // const newPet = Object.fromEntries(formData.entries());

    // Ponemos el required en los inputs para indicar que van a estar llenos siempre
    // pero el formData infiere el type como string | null, entonces se pone el as string
    // el + es para convertirlo en Number

    const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl: (formData.get("imageUrl") as string) || DEFAULT_PET_IMAGE,
      age: +(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };

    handleAddPet(newPet);

    onFormSubmission();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className=" space-y-3">
        <div className=" space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" name="ownerName" type="text" required />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" name="imageUrl" type="text" />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="text" required />
        </div>
        <div className=" space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} required />
        </div>
      </div>

      <Button type="submit" className=" mt-5 self-end">
        {type === "add" ? "Add a new pet" : "Edit pet"}
      </Button>
    </form>
  );
}
