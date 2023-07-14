import { supabase } from "@/lib/supabase"
import { Shell } from "@/components/shell"

export const revalidate = 0

export default async function TodosPage() {
  const { data: todos } = await supabase.from("todos").select()

  return (
    <Shell>
      <ul>{todos?.map((todo) => <li key={todo.id}>{todo.name}</li>)}</ul>
    </Shell>
  )
}
