"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { type Database } from "@/types/supabase"
import { catchError } from "@/lib/utils"
import { todoSchema } from "@/lib/validations/todo"
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

type Inputs = z.infer<typeof todoSchema>

export function AddTodoForm() {
  const supabase = createClientComponentClient<Database>()
  const [isPending, startTransition] = React.useTransition()
  const [showForm, setShowForm] = React.useState(false)

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
    },
  })

  function onSubmit(data: Inputs) {
    console.log(data)

    startTransition(async () => {
      try {
        const { error } = await supabase.from("todos").insert(data)

        if (error) {
          toast.error(error.message)
          return
        }

        form.reset()
        toast.success("Todo added successfully.")
      } catch (err) {
        catchError(err)
      }
    })
  }

  // Set focus to the input when the form is opened
  React.useEffect(() => {
    if (showForm) {
      form.setFocus("title")
    }
  }, [showForm, form])

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        {showForm ? (
          <div className="flex flex-col space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Todo</FormLabel>
                  <FormControl>
                    <Input placeholder="rodneymullen180@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                aria-label="Cancel"
                variant="destructive"
                size="sm"
                className="h-8 w-full"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                aria-label="Add todo"
                size="sm"
                className="h-8 w-full"
                disabled={isPending}
              >
                {isPending && (
                  <ReloadIcon
                    className="mr-2 h-3 w-3 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Add todo
              </Button>
            </div>
          </div>
        ) : (
          <Button
            aria-label="Open add todo input"
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            <PlusIcon
              className="mr-2 h-5 w-5 text-red-500"
              aria-hidden="true"
            />
            <p className="text-slate-400">Add todo</p>
          </Button>
        )}
      </form>
    </Form>
  )
}
