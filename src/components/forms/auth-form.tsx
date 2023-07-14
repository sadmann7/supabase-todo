"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
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

export function AuthForm() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [mode, setMode] = React.useState<"signUp" | "signIn" | "checkEmail">(
    "signIn"
  )
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function signUp(data: Inputs) {
    startTransition(async () => {
      try {
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        })
        setMode("checkEmail")
      } catch (err) {
        catchError(err)
      }
    })
  }

  function singIn(data: Inputs) {
    startTransition(async () => {
      try {
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        router.push(window.location.origin)
        router.refresh()
      } catch (err) {
        catchError(err)
      }
    })
  }

  return (
    <div className="w-full space-y-4">
      {mode === "checkEmail" ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Check your email</h2>
          <p className="mt-2">
            We sent a magic link to <strong>{form.getValues("email")}</strong>{" "}
            to sign in to your account.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={(...args) =>
              void form.handleSubmit(mode === "signIn" ? singIn : signUp)(
                ...args
              )
            }
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
                <CircleIcon
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {mode === "signIn" ? "Sign in" : "Sign up"}
              <span className="sr-only">
                {mode === "signIn" ? "Sign in" : "Sign up"}
              </span>
            </Button>
          </form>
        </Form>
      )}
      {mode === "checkEmail" ? null : mode === "signIn" ? (
        <div className="text-sm text-muted-foreground">
          <span className="mr-1 hidden sm:inline-block">
            Don&apos;t have an account?
          </span>
          <Button
            aria-label="Sign up"
            type="button"
            variant="link"
            className="p-0"
            onClick={() => setMode("signUp")}
          >
            Sign up
          </Button>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <span className="mr-1 hidden sm:inline-block">
            Already have an account?
          </span>
          <Button
            aria-label="Sign in"
            type="button"
            variant="link"
            className="p-0"
            onClick={() => setMode("signIn")}
          >
            Sign in
          </Button>
        </div>
      )}
    </div>
  )
}
