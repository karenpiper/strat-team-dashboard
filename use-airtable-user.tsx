"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { toast } from "sonner"

interface AirtableUser {
  id: string
  fields: {
    Name: string
    Email: string
    Role: string
    Password?: string // Password should ideally not be sent to client, but for demo purposes
    Avatar?: string
    Snaps?: number
  }
}

interface AirtableUserContextType {
  user: AirtableUser | null
  setUser: (user: AirtableUser | null) => void
  login: (email: string, password: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const AirtableUserContext = createContext<AirtableUserContextType | undefined>(undefined)

export function AirtableUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AirtableUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Attempt to load user from localStorage on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("airtableUser")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e)
      localStorage.removeItem("airtableUser")
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("airtableUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("airtableUser")
    }
  }, [user])

  const login = useCallback(async (emailInput: string, passwordInput: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/team")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const teamMembers: AirtableUser[] = await response.json()

      const foundUser = teamMembers.find(
        (member) => member.fields.Email === emailInput && member.fields.Password === passwordInput,
      )

      if (foundUser) {
        setUser(foundUser)
        toast.success(`Welcome, ${foundUser.fields.Name}!`)
      } else {
        setError("Invalid email or password.")
        toast.error("Invalid email or password.")
      }
    } catch (e: any) {
      console.error("Login error:", e)
      const errorMessage = e.message || "Login failed. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = React.useMemo(() => ({ user, setUser, login, isLoading, error }), [user, login, isLoading, error])

  return <AirtableUserContext.Provider value={value}>{children}</AirtableUserContext.Provider>
}

export function useAirtableUser() {
  const context = useContext(AirtableUserContext)
  if (context === undefined) {
    throw new Error("useAirtableUser must be used within an AirtableUserProvider")
  }
  return context
}
