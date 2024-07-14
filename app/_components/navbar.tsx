import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { IconBrandX } from "@tabler/icons-react"
import Link from "next/link"

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full flex items-center justify-between py-4 px-6 sm:py-8 sm:px-12 bg-background/50 backdrop-blur-sm">
      <p className="font-bold sm:text-xl tracking-tighter">Yer</p>
      <div className="flex items-center justify-between gap-2">
        <ThemeToggle />
        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-xs sm:text-base w-auto h-auto px-2 py-1.5 sm:px-3"
          asChild
        >
          <Link href="https://x.com/afifvdin" target="_blank">
            Feedback
            <IconBrandX className="ml-1 sm:ml-2 size-3 sm:size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
