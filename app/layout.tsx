import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Strategy Team Dashboard",
  description: "Your daily dose of team vibes and productivity",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
