import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { GeistSans } from "geist/font/sans"

export const metadata: Metadata = {
  title: "Yer",
  description: "Yet another labeler",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full bg-background" suppressHydrationWarning>
      <body className={cn(GeistSans.className, "h-full bg-background")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
