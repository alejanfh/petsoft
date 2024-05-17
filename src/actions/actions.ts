"use server";
import { signIn, signOut } from "@/lib/auth-no-edge";
import prisma from "@/lib/db";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { checkAuth, getPetById } from "@/lib/server-utils";

/* User actions */
export async function logIn(formAuthData: unknown) {
  if (!(formAuthData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn("credentials", formAuthData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials.",
          };
        }
        default: {
          return {
            message: "Error. Could not sign in.",
          };
        }
      }
    }

    throw error; // nextjs redirects throws error, so we need to rethrow it
  }
}

export async function signUp(formAuthData: unknown) {
  // check if formData is a FormData type
  if (!(formAuthData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  // convert formData to a plain object
  const formDataEntries = Object.fromEntries(formAuthData.entries());

  // validation
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }

    return {
      message: "Could not create user.",
    };
  }

  await signIn("credentials", formAuthData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

/* Pet actions */
// se pone unknown porque en verdad no sabemos lo que viene,
// si ponemos que sea PetEssentials, eso es lo que nos gustaria que tuviera
// pero no lo puedes asegurar ya que viene del cliente. Ya lo ponemos con el type
// que queremos con zod con el petFormSchema
export async function addPet(petData: unknown) {
  const session = await checkAuth();

  //validate data
  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
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

export async function editPet(petId: unknown, newPetData: unknown) {
  // authentication check
  const session = await checkAuth();

  // validation
  const validatedNewPet = petFormSchema.safeParse(newPetData);
  const validatedNewPetId = petIdSchema.safeParse(petId);

  if (!validatedNewPet.success || !validatedNewPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  // authorization check
  const pet = await getPetById(validatedNewPetId.data);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedNewPetId.data,
      },
      data: {
        ...validatedNewPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "There was an error editing a pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  // authentication check
  const session = await checkAuth();

  const validatedNewPetId = petIdSchema.safeParse(petId);

  if (!validatedNewPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  // authorization check
  const pet = await getPetById(validatedNewPetId.data);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database mutation
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
