import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { IconBrandX } from "@tabler/icons-react"

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full flex items-center justify-between py-8 px-12 bg-background/50 backdrop-blur-sm">
      <p className="font-bold text-xl tracking-tighter">Yer</p>
      <div className="flex items-center justify-between gap-2">
        <ThemeToggle />
        <Button size="sm" variant="outline" className="rounded-full">
          Feedback
          <IconBrandX className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}
