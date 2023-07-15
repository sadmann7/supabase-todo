"use client"

import * as React from "react"
import { type Todo } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { type Database } from "@/types/supabase"
import { catchError } from "@/lib/utils"
import { addTodoSchema, todoSchema } from "@/lib/validations/todo"
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

type Inputs = z.infer<typeof addTodoSchema>

interface UpdateTodoFormProps {
  todo: Todo
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateTodoForm({
  todo,
  isEditing,
  setIsEditing,
}: UpdateTodoFormProps) {
  const supabase = createClientComponentClient<Database>()
  const [isPending, startTransition] = React.useTransition()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      is_completed: false,
    },
  })

  function onSubmit(data: Inputs) {
    console.log(data)

    startTransition(async () => {
      try {
        const { error } = await supabase
          .from("todos")
          .update(data)
          .eq("id", todo.id)

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

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="z-10 flex flex-col gap-3">
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
          <div className="ml-auto flex items-center gap-2.5">
            <Button
              aria-label="Cancel"
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              aria-label="Save todo"
              size="sm"
              onClick={() => {
                form.handleSubmit(onSubmit)()
                setIsEditing(false)
              }}
              disabled={isPending}
            >
              {isPending && (
                <ReloadIcon
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
