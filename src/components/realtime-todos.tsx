"use client"

import * as React from "react"
import { Todo } from "@/types"
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { cn } from "@/lib/utils"

import { UpdateTodoForm } from "./forms/update-todo-form"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

interface RealtimeTodosProps {
  data: Todo[]
}

export function RealtimeTodos({ data }: RealtimeTodosProps) {
  const supabase = createClientComponentClient<Database>()
  const [todos, setTodos] = React.useState<Todo[]>(data)
  const todosRef = React.useRef<HTMLUListElement>(null)

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
    if (!todosRef.current) return

    todosRef.current.scrollTop = todosRef.current.scrollHeight
  }, [todos])

  return (
    <>
      {todos.length > 0 ? (
        <ul
          ref={todosRef}
          className="grid max-h-[620px] gap-2.5 overflow-y-auto rounded-md border px-4 py-2"
        >
          {todos?.map((todo) => (
            <TodoItem key={todo.id} setTodos={setTodos} todo={todo} />
          ))}
        </ul>
      ) : null}
    </>
  )
}

interface TodoItemProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  todo: Todo
}

function TodoItem({ setTodos, todo }: TodoItemProps) {
  const supabase = createClientComponentClient<Database>()
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
            setTodos={setTodos}
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
                setTodos((prev) =>
                  prev.map((t) =>
                    t.id === todo.id ? { ...t, is_complete: !!checked } : t
                  )
                )

                await supabase
                  .from("todos")
                  .update({ is_complete: !!checked })
                  .match({ id: todo.id })
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
        {isHovered && !isEditing && (
          <div className="z-10 flex items-center gap-2">
            <Button
              type="button"
              title="Edit todo"
              variant="ghost"
              className="h-auto p-1"
              onClick={() => setIsEditing(true)}
            >
              <Pencil1Icon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Edit todo</span>
            </Button>
            <Button
              type="button"
              title="Delete todo"
              variant="ghost"
              className="h-auto p-1"
              onClick={async () => {
                void setTodos((prev) => prev.filter((t) => t.id !== todo.id))
                await supabase.from("todos").delete().match({ id: todo.id })
              }}
            >
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Delete todo</span>
            </Button>
          </div>
        )}
      </div>
    </li>
  )
}
