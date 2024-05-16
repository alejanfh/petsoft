"use server";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPet(petData: PetEssentials) {
  await sleep(1000);

  //validate data
  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "There was an error creating a pet",
    };
  }

  // Haces re render del layout.tsx de la carpeta /app
  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], newPetData: PetEssentials) {
  await sleep(1000);

  const validatedNewPet = petFormSchema.safeParse(newPetData);
  if (!validatedNewPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: validatedNewPet,
    });
  } catch (error) {
    return {
      message: "There was an error editing a pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  await sleep(1000);

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
