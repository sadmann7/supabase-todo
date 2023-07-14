import { CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ThemeToggle } from "@/components/layouts/theme-toggle";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4">
        <Link
          href="/"
          className="mr-2 flex flex-1 items-center space-x-2 md:mr-6"
        >
          <CheckCircledIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden font-bold md:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
