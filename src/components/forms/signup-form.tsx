"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { type Database } from "@/types/supabase"
import { catchError } from "@/lib/utils"
import { authSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/password-input"

type Inputs = z.infer<typeof authSchema>

export function SignUpForm() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isCodeSent, setIsCodeSent] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: Inputs) {
    setIsCodeSent(false)

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        })
        if (error) {
          toast.error(error.message)
          return
        }

        setIsCodeSent(true)
        toast.message("Check your email", {
          description: "We have sent you a link to verify your email address.",
        })

        // router.refresh()
        // toast.success("Successfully signed in.")
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <div className="w-full">
      {isCodeSent ? (
        <div className="space-y-4 text-center">
          <p className="text-base">
            We have sent you a link to verify your email address.
          </p>
          <p className="text-sm text-muted-foreground">
            If you did not receive the email, please check your spam folder.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="rodneymullen180@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="**********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending}>
              {isPending && (
                <ReloadIcon
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Continue
              <span className="sr-only">
                Continue to email verification page
              </span>
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
