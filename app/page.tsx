"use client"

import React, { useState } from "react"
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
            {/* form inputs */}
          </form>

          {/* demo buttons */}
        </CardContent>
      </Card>
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