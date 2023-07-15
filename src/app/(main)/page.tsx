import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { type Database } from "@/types/supabase"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ManageTodoForm } from "@/components/forms/manage-todo-form"
import { RealtimeTodos } from "@/components/realtime-todos"
import { Shell } from "@/components/shell"

export const revalidate = 0

export default async function IndexPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: userResponseData } = await supabase.auth.getUser()

  const { data: todos } = await supabase.from("todos").select()

  return (
    <Shell className="max-w-md">
      {userResponseData.user ? (
        <div className="space-y-2">
          <RealtimeTodos data={todos ?? []} />
          <ManageTodoForm />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-center">Please sign in to create todos</p>
          <Link
            href="/signin"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              })
            )}
          >
            Sign in
          </Link>
        </div>
      )}
    </Shell>
  )
}
