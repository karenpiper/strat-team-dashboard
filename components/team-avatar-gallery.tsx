"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Camera } from "lucide-react"

interface TeamMember {
  id: string
  fields: {
    Name: string
    Role: string
    "Photo URL": string
    "Snaps Count": number
    "Featured Count": number
    [key: string]: any
  }
}

export function TeamAvatarGallery() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/api/team")
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data)
        }
      } catch (error) {
        console.error("Error fetching team members:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeamMembers()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Our Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100/20 to-transparent dark:from-indigo-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Our Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="text-center group">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 mx-auto ring-4 ring-indigo-100 dark:ring-indigo-900 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800 transition-all">
                  <AvatarImage src={member.fields["Photo URL"] || "/placeholder.svg"} alt={member.fields.Name} />
                  <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold text-lg">
                    {member.fields.Name.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {member.fields["Snaps Count"] > 0 && (
                  <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {member.fields["Snaps Count"]}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{member.fields.Name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.fields.Role}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Camera className="h-3 w-3 mr-1" />
                  {member.fields["Snaps Count"]} snaps
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
