"use client"

import * as React from "react"
import { Todo } from "@/types"

import { supabase } from "@/lib/supabase"

interface RealtimeTodoProps {
  data: Todo
}

export function RealtimeTodo({ data }: RealtimeTodoProps) {
  const [todo, setTodo] = React.useState<Todo>(data)

  React.useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "todos",
          filter: `id=eq.${data.id}`,
        },
        (payload) => {
          console.log(payload)
          setTodo(payload.new as Todo)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [data.id])

  return (
    <pre>
      <code>{JSON.stringify(todo, null, 2)}</code>
    </pre>
  )
}
