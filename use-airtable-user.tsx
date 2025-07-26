// app/use-airtable-user.ts

'use client'

import { createContext, useContext, useState } from 'react'

interface User {
  email: string
}

interface AirtableUserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AirtableUserContext = createContext<AirtableUserContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
})

export function AirtableUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    await new Promise((r) => setTimeout(r, 500)) // simulate network delay

    // Hardcoded demo users
    const demoUsers: Record<string, string> = {
      'demo@example.com': 'demo123',
      'karen.piper@codeandtheory.com': 'demo123',
    }

    if (demoUsers[email] && demoUsers[email] === password) {
      setUser({ email })
    } else {
      setError('Invalid email or password')
    }

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AirtableUserContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AirtableUserContext.Provider>
  )
}

export function useAirtableUser() {
  return useContext(AirtableUserContext)
}
