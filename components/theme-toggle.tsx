"use client"

import * as React from "react"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          {theme === "light" && "✓ "}Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          {theme === "dark" && "✓ "}Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          {theme === "system" && "✓ "}System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
