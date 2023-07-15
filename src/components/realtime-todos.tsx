"use client"

import * as React from "react"
import { Todo } from "@/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

import { UpdateTodoForm } from "./forms/update-todo-form"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { ScrollArea } from "./ui/scroll-area"

interface RealtimeTodosProps {
  data: Todo[]
}

export function RealtimeTodos({ data }: RealtimeTodosProps) {
  const supabase = createClientComponentClient<Database>()
  const [todos, setTodos] = React.useState<Todo[]>(data)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

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

  // Scroll to bottom when new todo is added
  React.useEffect(() => {
    console.log("scrolling")
    if (!scrollAreaRef.current) return

    scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
  }, [todos])

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="h-[620px] rounded-md border px-4 py-2"
    >
      <ul>{todos?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}</ul>
    </ScrollArea>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <li className={cn(isEditing && "space-y-3")}>
      <div
        className={cn(
          "flex min-h-[40px] cursor-pointer",
          isEditing ? "flex-col" : "flex-row items-center justify-between gap-2"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? (
          <UpdateTodoForm
            todo={todo}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="todoStatus"
              checked={todo.is_complete}
              onCheckedChange={async (checked) => {
                await supabase
                  .from("todos")
                  .update({ is_complete: !!checked })
                  .eq("id", todo.id)
              }}
            />

            <Label
              htmlFor="todoStatus"
              className={cn(
                "line-clamp-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                todo.is_complete && "text-muted-foreground line-through"
              )}
            >
              {todo.title}
            </Label>
          </div>
        )}
      </div>
    </li>
  )
}
