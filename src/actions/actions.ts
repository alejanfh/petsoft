"use server";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// se pone unknown porque en verdad no sabemos lo que viene,
// si ponemos que sea PetEssentials, eso es lo que nos gustaria que tuviera
// pero no lo puedes asegurar ya que viene del cliente. Ya lo ponemos con el type
// que queremos con zod con el petFormSchema
export async function addPet(petData: unknown) {
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

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  const validatedNewPet = petFormSchema.safeParse(newPetData);
  const validatedNewPetId = petIdSchema.safeParse(petId);

  if (!validatedNewPet.success || !validatedNewPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedNewPetId.data,
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

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validatedNewPetId = petIdSchema.safeParse(petId);

  if (!validatedNewPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedNewPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "There was an error deleting a pet",
    };
  }

  revalidatePath("/app", "layout");
}
