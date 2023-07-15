import { type Metadata } from "next"

import { LogOutButtons } from "@/components/auth/logout-buttons"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Sign Out",
  description: "Sign out of your account",
}

export default function SignOutPage() {
  return (
    <Shell className="flex min-h-screen max-w-sm flex-col items-center justify-center">
      <Header
        title="Sign out"
        description="Are you sure you want to sign out?"
        size="sm"
        className="text-center"
      />
      <LogOutButtons />
    </Shell>
  )
}
