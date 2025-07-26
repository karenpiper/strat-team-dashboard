"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo } from "react"
import { toast } from "sonner"

interface User {
  id: string
  fields: {
    Name: string
    Email: string
    Role: string
    "Photo URL"?: string
    [key: string]: any
  }
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
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("airtable-user")
      if (savedUser) {
        try {
          return JSON.parse(savedUser)
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("airtable-user")
        }
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on email
      const mockUsers: Record<string, User> = {
        "karen@example.com": {
          id: "1",
          fields: {
            Name: "Karen Johnson",
            Email: "karen@example.com",
            Role: "Project Manager",
            "Photo URL": "/placeholder.svg?height=200&width=200&text=Karen+Johnson&bg=3b82f6&color=fff",
          },
        },
        "john.doe@example.com": {
          id: "2",
          fields: {
            Name: "John Doe",
            Email: "john.doe@example.com",
            Role: "Lead Strategist",
            "Photo URL": "/placeholder.svg?height=200&width=200&text=John+Doe&bg=10b981&color=fff",
          },
        },
        "jane.smith@example.com": {
          id: "3",
          fields: {
            Name: "Jane Smith",
            Email: "jane.smith@example.com",
            Role: "Senior Analyst",
            "Photo URL": "/placeholder.svg?height=200&width=200&text=Jane+Smith&bg=ec4899&color=fff",
          },
        },
      }

      const mockUser = mockUsers[email]
      if (mockUser && password === "password123") {
        setUser(mockUser)
        localStorage.setItem("airtable-user", JSON.stringify(mockUser))
        toast.success(`Welcome back, ${mockUser.fields.Name}!`)
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("airtable-user")
    toast.success("You have been logged out")
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
