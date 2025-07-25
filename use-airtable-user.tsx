"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AirtableUserContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AirtableUserContext = createContext<AirtableUserContextType | undefined>(undefined)

export function AirtableUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo users data
  const demoUsers = useMemo(
    () => [
      {
        id: "1",
        name: "Karen Johnson",
        email: "karen@example.com",
        role: "Project Manager",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Lead Strategist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Senior Analyst",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    [],
  )

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("airtable-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("airtable-user")
      }
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Find demo user
        const demoUser = demoUsers.find((u) => u.email === email)

        if (demoUser && password === "password123") {
          setUser(demoUser)
          localStorage.setItem("airtable-user", JSON.stringify(demoUser))
          toast({
            title: "Login successful",
            description: `Welcome back, ${demoUser.name}!`,
          })
        } else {
          throw new Error("Invalid email or password")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Login failed"
        setError(errorMessage)
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [demoUsers],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("airtable-user")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoading,
      error,
    }),
    [user, login, logout, isLoading, error],
  )

  return <AirtableUserContext.Provider value={value}>{children}</AirtableUserContext.Provider>
}

export function useAirtableUser() {
  const context = useContext(AirtableUserContext)
  if (context === undefined) {
    throw new Error("useAirtableUser must be used within an AirtableUserProvider")
  }
  return context
}
