import { supabase } from "@/lib/supabase"
import { Shell } from "@/components/shell"

export default async function TodosPage() {
  const { data: todos } = await supabase.from("todos").select()

  console.log(todos)

  return <Shell></Shell>
}
