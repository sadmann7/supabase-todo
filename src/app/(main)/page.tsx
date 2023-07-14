import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { type Database } from "@/types/supabase"
import { RealtimeTodos } from "@/components/realtime-todos"
import { Shell } from "@/components/shell"

export const revalidate = 0

export default async function IndexPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: todos } = await supabase.from("todos").select()

  return (
    <Shell>
      <RealtimeTodos data={todos ?? []} />
    </Shell>
  )
}
