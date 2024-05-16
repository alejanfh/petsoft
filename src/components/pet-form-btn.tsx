// import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  // Hace un poco de magia, porque pilla que tu has hecho submit en pet-form
  // y te pilla si ya ha acabado o no
  // 1. Al utilizar useOptimistic ya no hace falta el loading, porque será instantáneo
  // const { pending } = useFormStatus();

  return (
    <Button type="submit" className=" mt-5 self-end">
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
}
