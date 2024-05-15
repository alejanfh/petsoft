import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: string;
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  // Hace un poco de magia, porque pilla que tu has hecho submit en pet-form
  // y te pilla si ya ha acabado o no
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className=" mt-5 self-end">
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
}
