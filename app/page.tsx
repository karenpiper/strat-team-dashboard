"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AirtableUserProvider, useAirtableUser } from "@/use-airtable-user"
import TeamDashboard from "@/components/team-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"

function LoginForm() {
  const { login, isLoading, error } = useAirtableUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    login(demoEmail, demoPassword)
  }

  /* this is the airtable test */ 
import AirtableTest from "@/components/AirtableTest"

export default function Page() {
  return <AirtableTest />
}
/* this is the airtable test */

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="bg-red-500 text-white p-4">Tailwind is working!</div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Sign in to access your Strategy Team Dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or try demo accounts</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleDemoLogin("karen@example.com", "password123")}
                disabled={isLoading}
              >
                Demo: Karen Johnson (Project Manager)
              </Button>
              <Button
                variant="outline"
                className="w-full bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleDemoLogin("john.doe@example.com", "password123")}
                disabled={isLoading}
              >
                Demo: John Doe (Lead Strategist)
              </Button>
              <Button
                variant="outline"
                className="w-full bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleDemoLogin("jane.smith@example.com", "password123")}
                disabled={isLoading}
              >
                Demo: Jane Smith (Senior Analyst)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AppContent() {
  const { user } = useAirtableUser()

  if (!user) {
    return <LoginForm />
  }

  return <TeamDashboard />
}

export default function Page() {
  return (
    <AirtableUserProvider>
      <AppContent />
    </AirtableUserProvider>
  )
}
