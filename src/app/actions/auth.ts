"use server"

import { signIn } from "next-auth/react"
import {
  signInFormWithPasswordSchema,
  signUpFormWithPasswordSchema,
  type SignUpWithPasswordFormInput,
  type SignInWithPasswordFormInput,
  SignInWithPasswordMessage,
  SignUpWithPasswordMessage,
} from "@/validations/auth"
import { prisma } from "@/lib/prisma"
import { getUserByEmail } from "./user"
import { generateHash } from "@/lib/utils"
import { PrismaClientInitializationError } from "@prisma/client/runtime/library"

export async function signUpWithPassword(
  rawInput: SignUpWithPasswordFormInput
): Promise<SignUpWithPasswordMessage> {
  const validatedInput = signUpFormWithPasswordSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  try {
    const res = await getUserByEmail(validatedInput.data.email)
    if (res.success) return "exists"

    const passwordHash = generateHash(validatedInput.data.password)

    prisma.$connect()

    const newUser = await prisma.user.create({
      data: {
        email: validatedInput.data.email,
        password: passwordHash,
        address: validatedInput.data.address,
      },
    })
    if (!newUser) return "fail"
    return "success"
  } catch (error) {
    if (error instanceof PrismaClientInitializationError){
      return "database-error"
    }
    console.error(error)
    return "fail"
  }
}

// error while signIn method in server side : todo
export async function signInWithPassword(
  rawInput: SignInWithPasswordFormInput
): Promise<SignInWithPasswordMessage> {
  const validatedInput = signInFormWithPasswordSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"
  
  try {
    const user = await signIn("credentials", {
      email: validatedInput.data.email,
      password: validatedInput.data.password,
      redirect: false
    })
    if (user?.ok) return "success"
    return "fail"

  } catch (error) {
    console.error("Signin Error", error);
    return "fail"
  }
}
