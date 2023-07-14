import { notFound } from "next/navigation"

import { supabase } from "@/lib/supabase"
import { Shell } from "@/components/shell"

interface TodoPageProps {
  params: {
    todoId: string
  }
}

export default async function TodoPage({ params }: TodoPageProps) {
  const { todoId } = params

  const { data: todo } = await supabase
    .from("todos")
    .select()
    .match({ id: todoId })
    .single()

  console.log(todo)

  if (!todo) {
    notFound()
  }

  return <Shell></Shell>
}
