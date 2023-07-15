"use client"

import * as React from "react"
import Link from "next/link"
import { Todo } from "@/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { ManageTodoForm } from "@/components/forms/manage-todo-form"

interface RealtimeTodosProps {
  data: Todo[]
}

export function RealtimeTodos({ data }: RealtimeTodosProps) {
  const supabase = createClientComponentClient<Database>()
  const [todos, setTodos] = React.useState<Todo[]>(data)

  React.useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        (payload) => {
          console.log(payload)
          setTodos((prev) => [...prev, payload.new as Todo])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [todos, setTodos, data, supabase])

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>
          <Link aria-label={`View ${todo.title}`} href={`/todo/${todo.id}`}>
            {todo.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
