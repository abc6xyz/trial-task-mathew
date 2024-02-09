"use server"

import {
  signUpFormWithPasswordSchema,
  type SignUpWithPasswordFormInput,
  SignUpWithPasswordMessage,
} from "@/validations/auth"
import { prisma } from "@/lib/prisma"
import { generateHash } from "@/lib/utils"
import { getUserByEmail } from "./user"

export async function signUpWithPassword(
  rawInput: SignUpWithPasswordFormInput
): Promise<SignUpWithPasswordMessage> {
  const validatedInput = signUpFormWithPasswordSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  try {
    const user = await getUserByEmail(validatedInput.data.email)

    if (!user) return "exists"

    const passwordHash = generateHash(validatedInput.data.password)

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
    return "fail"
  }
}
