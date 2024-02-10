"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import AuthForm from "@/components/forms/auth/index"

export const AuthDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <AuthForm />
      </DialogContent>
    </Dialog>
  )
}
