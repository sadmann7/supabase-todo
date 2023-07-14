import { supabase } from "@/lib/supabase"
import { RealtimeTodos } from "@/components/realtime-todos"
import { Shell } from "@/components/shell"

export const revalidate = 0

export default async function TodosPage() {
  const { data: todos } = await supabase.from("todos").select()

  return (
    <Shell>
      <RealtimeTodos data={todos ?? []} />
    </Shell>
  )
}
