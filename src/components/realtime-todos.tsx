"use client"

import * as React from "react"
import Link from "next/link"
import { Todo } from "@/types"

import { supabase } from "@/lib/supabase"

interface RealtimeTodosProps {
  data: Todo[]
}

export function RealtimeTodos({ data }: RealtimeTodosProps) {
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
  }, [todos, setTodos, data])

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>
          <Link aria-label={`View ${todo.name}`} href={`/todo/${todo.id}`}>
            {todo.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
