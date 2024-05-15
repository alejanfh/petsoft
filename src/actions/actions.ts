"use server";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addPet(formData) {
  await sleep(2000);

  try {
    await prisma.pet.create({
      data: {
        name: formData.get("name"),
        ownerName: formData.get("ownerName"),
        age: parseInt(formData.get("age")),
        imageUrl: formData.get("imageUrl") || DEFAULT_PET_IMAGE,
        notes: formData.get("notes"),
      },
    });
  } catch (error) {
    return {
      message: "There was an error creating a pet",
    };
  }

  // Haces re render del layout.tsx de la carpeta /app
  revalidatePath("/app", "layout");
}

export async function editPet(petId: string, formData) {
  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: formData.get("name"),
        ownerName: formData.get("ownerName"),
        age: parseInt(formData.get("age")),
        imageUrl: formData.get("imageUrl") || DEFAULT_PET_IMAGE,
        notes: formData.get("notes"),
      },
    });
  } catch (error) {
    return {
      message: "There was an error editing a pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: string) {
  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "There was an error deleting a pet",
    };
  }

  revalidatePath("/app", "layout");
}
