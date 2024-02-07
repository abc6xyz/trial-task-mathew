import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { OAuthButtons } from "./oauth-buttons"
import { SignInWithPasswordForm } from "./signin"
import { SignUpWithPasswordForm } from "./signup"

export default function AuthForm() {
  const [ formType, setFormType ] = useState(false)

  return (
    <Card className="max-sm:flex max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none border-none sm:min-w-[370px] sm:max-w-[368px]">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            {formType? "Sign Up": "Sign In"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-4">
        <OAuthButtons />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
            <span className="bg-background px-2">
              Or continue with password
            </span>
          </div>
        </div>
        { formType?
          <SignUpWithPasswordForm />
          :
          <SignInWithPasswordForm />
        }
      </CardContent>
      <CardFooter className="grid w-full gap-4 text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-4">
        <div>
          <div>
            <span> {formType?"Already have an account?":"You don't have account?"} </span>
            <Button
              onClick={()=>{setFormType(!formType)}}
              variant="link"
              className="font-bold tracking-wide text-primary underline-offset-4 transition-all hover:underline"
            >
              {formType?"Sign in":"Sign up"}
              <span className="sr-only">{formType?"Sign in":"Sign up"}</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
