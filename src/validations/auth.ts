import { z } from "zod"

export const signInFormWithPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email address."
  }),
  password: z.string().min(8, {
    message: "Password must be longer than 8 characters."
  })
})

export type SignInWithPasswordFormInput = z.infer<typeof signInFormWithPasswordSchema>

export const signUpFormWithPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email address."
  }),
  password: z.string().min(8, {
    message: "Password must be longer than 8 characters."
  }),
  address: z.string(),
})

export type SignUpWithPasswordFormInput = z.infer<typeof signUpFormWithPasswordSchema>


export type SignUpWithPasswordMessage =
| "invalid-input"
| "exists"
| "success"
| "fail"
| "database-error"