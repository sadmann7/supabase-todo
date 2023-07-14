"use client"

import * as React from "react"
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
          event: "INSERT",
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
  }, [todos, setTodos])

  console.log(todos)

  return (
    <pre>
      <code>{JSON.stringify(todos, null, 2)}</code>
    </pre>
  )
}
