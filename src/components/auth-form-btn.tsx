"use client";

import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type AuthFormBtnProps = {
  type: "logIn" | "signUp";
};

export default function AuthFormBtn({ type }: AuthFormBtnProps) {
  // Se ghace aqui porque tiene que ser un child del form
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {type === "logIn" ? "Log In" : "Sign Up"}
    </Button>
  );
}
