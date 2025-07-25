"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
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

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    email: "karen@example.com",
    name: "Karen Johnson",
    role: "Project Manager",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "Lead Strategist",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "Senior Analyst",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AirtableUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("airtable-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse saved user:", e)
        localStorage.removeItem("airtable-user")
      }
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in mock data
      const foundUser = mockUsers.find((u) => u.email === email)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // In a real app, you'd verify the password here
      if (password !== "password123") {
        throw new Error("Invalid email or password")
      }

      setUser(foundUser)
      localStorage.setItem("airtable-user", JSON.stringify(foundUser))
      toast.success(`Welcome back, ${foundUser.name}!`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      toast.error(errorMessage)
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
