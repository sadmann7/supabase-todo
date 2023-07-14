"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ReloadIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

import { Database } from "@/types/supabase"
import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function LogOutButtons() {
  const router = useRouter()
  const supabse = createClientComponentClient<Database>()
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="flex w-full items-center space-x-2">
      <Button
        aria-label="Log out"
        size="sm"
        className="w-full"
        onClick={() => {
          startTransition(async () => {
            try {
              const { error } = await supabse.auth.signOut()
              if (error) {
                toast.error(error.message)
                return
              }
              router.push(window.location.origin)
              router.refresh()
            } catch (err) {
              catchError(err)
            }
          })
        }}
        disabled={isPending}
      >
        {isPending && (
          <ReloadIcon
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Log out
      </Button>

      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Go back
      </Button>
    </div>
  )
}
