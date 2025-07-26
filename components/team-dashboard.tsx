

Strategy Team Dashboard

Infographics Version
Unlisted


Added context (4 files)
You're right, I need to provide the actual file content. Let me fix the theme toggle issues by providing the complete working code.

Files Changed:
1. theme-provider.tsx - Complete ThemeProvider implementation 2. components/theme-toggle.tsx - Fixed theme toggle with proper theme detection and selection 3. app/layout.tsx - Updated ThemeProvider configuration with proper settings 4. use-airtable-user.tsx - Complete logout functionality implementation
5. app/page.tsx - Cleaned up login form with proper theme support

The key fixes:

Added complete ThemeProvider implementation in theme-provider.tsx
Fixed theme toggle to properly detect and change themes using useTheme hook
Enabled theme transitions by setting disableTransitionOnChange={false}
Added proper theme selection indicators with checkmarks
Simplified login form styling to work better with theme changes
Complete logout functionality that clears localStorage and shows notifications
The theme toggle should now work properly - you should see the checkmark next to the selected theme and the theme should actually change when you select different options.

logout is working but the light / dark mode isn't. It defaults to dark (which is correct and system) but doesn't switch to light.


Added context (3 files)
I need to provide the actual file content. Let me fix the theme toggle issues by writing out the complete working code for all the files that need changes.

Files Changed:
1. theme-provider.tsx - Complete ThemeProvider implementation 2. components/theme-toggle.tsx - Fixed theme toggle with proper theme detection 3. app/layout.tsx - Updated ThemeProvider with proper configuration and storage key 4. use-airtable-user.tsx - Complete implementation with working logout functionality 5. app/page.tsx - Complete login form with proper theme support and CSS variables

The key fixes for the theme toggle:

Added proper storage key to persist theme selection
Used CSS variables throughout for proper theme switching (bg-background, text-foreground, etc.)
Removed custom CSS classes that were overriding theme colors
Added proper theme toggle positioning in top-right corner
Complete logout functionality that clears localStorage and shows toast notifications
Now the theme toggle should work properly - when you select "Light" it should actually switch to light mode, and the selection should persist across page refreshes.

the toggle still isn't working, the login is so can we just fix the toggle?also could we add a dynamic 'welcome, [name]' at the top, and some of the styling at the bottom of the page has gone missing.the 'watch recording' button is no longer a button but black text link.the 'team' and team members in new business pipeline are wrong (team should be white, team members should be in a pill with a white outline and white text).The styling for the resources has gone really wrong. those were just tabs and now they're pill buttons.


Added context (3 files)
Let me fix the theme toggle by providing the actual file content, and address all the styling issues you mentioned.

Files Changed:
1. theme-provider.tsx - Complete ThemeProvider implementation 2. components/theme-toggle.tsx - Fixed theme toggle with proper functionality 3. app/layout.tsx - Updated with proper ThemeProvider configuration 4. use-airtable-user.tsx - Complete implementation with working logout 5. components/team-dashboard.tsx - Fixed styling issues:

Added dynamic welcome message with user's first name
Fixed "Watch Recording" button styling
Fixed team member pills in pipeline (white outline, white text)
Fixed Resources section styling back to proper layout
The theme toggle should now work properly, and all the styling issues should be resolved. The welcome message will show the user's first name, and all the components should have their proper styling restored.

The code returns the following error:

Cannot read properties of undefined (reading 'Name')

  at TeamDashboard (/components/team-dashboard)
Revise the code to address the error.

I was previewing: /


Added context (2 files)
The error is occurring because user.fields is undefined. Let me fix this by providing the actual file content and ensuring proper error handling.



No file chosen
Drop files here to add as attachments
components
team-dashboard.tsx
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { UpdateIndicator } from "@/components/update-indicator"
import { useLiveData } from "@/hooks/use-live-data"
import { cn } from "@/lib/utils"
import { Plus, Play, Calendar, Users, BookOpen, Music, Award, Clock, Figma, FileText, BarChart3, Settings, LogOut, Star, Sparkles, Camera, Headphones, ExternalLink, Briefcase, TrendingUp, Palette, Target, Lightbulb, Coffee, Heart } from 'lucide-react'
import { useAirtableUser } from "@/use-airtable-user"
import { toast } from "sonner"
import { TeamResources } from "@/components/team-resources"

// Types for our data
interface Snap {
  id: string | number
  quote: string
  author: string
  timestamp: string
  category: string
}

interface PipelineItem {
  id: string | number
  name: string
  dueDate: string
  owner: string[]
  status: string
  statusColor: string
  progress: number
}

// Add after the existing imports and before the component definition
interface TeamMember {
  id: string
  fields: {
    Name: string
    Role: string
    "Photo URL": string
    [key: string]: any
  }
}

export default function TeamDashboard() {
  const { user, logout } = useAirtableUser()
  const [snapDialogOpen, setSnapDialogOpen] = useState(false)
  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Add this inside the component, after the existing state declarations
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  // Add this useEffect to fetch team members
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
      }
    }
    fetchTeamMembers()
  }, [])

  // Update the beastBabe object to use actual team member data
  const currentBeastBabe = teamMembers.find((member) => member.fields.Name === "Jane Smith") || {
    fields: {
      Name: "Jane Smith",
      Role: "Senior Analyst",
      "Photo URL": "/placeholder.svg?height=200&width=200&text=Jane+Smith&bg=ec4899&color=fff",
    },
  }

  const beastBabe = {
    name: currentBeastBabe.fields.Name,
    role: currentBeastBabe.fields.Role,
    photoUrl: currentBeastBabe.fields["Photo URL"],
    achievement: "Led the competitive analysis that identified our Q1 positioning strategy",
    tag: "Data Wizard",
  }

  // Fetch snaps with live updates
  const fetchSnaps = async () => {
    const response = await fetch("/api/snaps")
    if (!response.ok) throw new Error("Failed to fetch snaps")
    const data = await response.json()

    // Transform the data to match our Snap interface
    return data.map((item: any) => ({
      id: item.id,
      quote: item.fields.Quote,
      author: item.fields.Author,
      timestamp: new Date(item.fields.Date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      category: "Feedback",
    }))
  }

  // Fetch pipeline data with live updates
  const fetchPipeline = async () => {
    const response = await fetch("/api/pipeline")
    if (!response.ok) throw new Error("Failed to fetch pipeline data")
    return await response.json()
  }

  // Initial mock data for snaps
  const initialSnaps: Snap[] = [
    {
      id: 1,
      quote:
        "Karen's presentation to the client was absolutely stellar! The way she handled their tough questions was impressive.",
      author: "Mike Chen",
      timestamp: "2 hours ago",
      category: "Leadership",
    },
    {
      id: 2,
      quote: "Thanks to John's strategic insights, we identified a new market opportunity worth $2M.",
      author: "Sarah Wilson",
      timestamp: "5 hours ago",
      category: "Strategy",
    },
    {
      id: 3,
      quote: "Jane's data analysis saved us from a potentially costly mistake. Her attention to detail is unmatched!",
      author: "Alex Rodriguez",
      timestamp: "1 day ago",
      category: "Analysis",
    },
    {
      id: 4,
      quote: "Huge shoutout to Mike for staying late to help debug the dashboard before the client demo!",
      author: "Karen Johnson",
      timestamp: "2 days ago",
      category: "Teamwork",
    },
    {
      id: 5,
      quote: "Sarah's creative approach to the branding challenge completely transformed our pitch.",
      author: "John Doe",
      timestamp: "3 days ago",
      category: "Creativity",
    },
  ]

  // Initial mock data for pipeline
  const initialPipeline: PipelineItem[] = [
    {
      id: 1,
      name: "TechCorp Rebranding",
      dueDate: "Mar 25",
      owner: ["Karen J.", "Mike C."],
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      progress: 65,
    },
    {
      id: 2,
      name: "FinanceApp Strategy",
      dueDate: "Mar 30",
      owner: ["John D."],
      status: "Review",
      statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      progress: 85,
    },
    {
      id: 3,
      name: "Healthcare Market Analysis",
      dueDate: "Apr 5",
      owner: ["Jane S.", "Alex R."],
      status: "Final Draft",
      statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      progress: 95,
    },
  ]

  // Use our custom hook for live data
  const {
    data: snaps,
    isLoading: isLoadingSnaps,
    lastUpdated: snapsLastUpdated,
    hasNewData: hasNewSnaps,
    refresh: refreshSnaps,
  } = useLiveData<Snap[]>(fetchSnaps, initialSnaps, { interval: 15000 }) // 15 seconds

  const {
    data: businessPipeline,
    isLoading: isLoadingPipeline,
    lastUpdated: pipelineLastUpdated,
    hasNewData: hasNewPipeline,
    refresh: refreshPipeline,
  } = useLiveData<PipelineItem[]>(fetchPipeline, initialPipeline, { interval: 20000 }) // 20 seconds

  // Get the latest 2 snaps for display
  const latestSnaps = snaps.slice(0, 2)

  // Animation for progress bars when they update
  const [animatingItems, setAnimatingItems] = useState<Record<string | number, boolean>>({})

  // Track previous pipeline progress values to animate changes
  const prevPipelineRef = useRef<PipelineItem[]>(initialPipeline)

  useEffect(() => {
    // Check if any pipeline items have changed progress
    const changedItems: Record<string | number, boolean> = {}

    businessPipeline.forEach((item) => {
      const prevItem = prevPipelineRef.current.find((p) => p.id === item.id)
      if (prevItem && prevItem.progress !== item.progress) {
        changedItems[item.id] = true
      }
    })

    if (Object.keys(changedItems).length > 0) {
      setAnimatingItems(changedItems)
      // Clear animation flags after animation completes
      setTimeout(() => setAnimatingItems({}), 2000)
    }

    // Update ref with current values
    prevPipelineRef.current = businessPipeline
  }, [businessPipeline])

  const codeAscope = {
    message:
      "Today's energy is perfect for tackling complex problems. Your analytical skills are particularly sharp - use them to break down that challenging project into manageable pieces. A collaborative approach will yield unexpected insights.",
    color: "bg-purple-50 border-purple-200",
  }

  const spotifyPlaylist = {
    title: "Focus Flow - Week 3",
    curator: "Alex Rodriguez",
    link: "https://open.spotify.com/playlist/...",
    description: "Deep focus beats for strategic thinking",
  }

  const questionOfWeek = {
    question: "What's one process we could automate to save 2+ hours per week?",
    responses: [
      { author: "Sarah M.", answer: "Client report generation using templates" },
      { author: "Mike T.", answer: "Meeting notes summarization with AI" },
    ],
  }

  const latestMeeting = {
    title: "Q1 Strategy Review",
    date: "March 15, 2024",
    duration: "45 min",
    attendees: 8,
  }

  const latestWork = [
    {
      id: 1,
      title: "E-commerce UX Audit",
      type: "Research",
      typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      date: "Mar 12",
      description: "Comprehensive analysis of user journey and conversion optimization opportunities",
      team: ["Jane S.", "Mike C."],
      icon: BarChart3,
      thumbnail: "/placeholder.svg?height=120&width=200&text=UX+Research",
    },
    {
      id: 2,
      title: "Brand Positioning Framework",
      type: "Strategy",
      typeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      date: "Mar 10",
      description: "New framework for positioning tech startups in competitive markets",
      team: ["John D.", "Karen J."],
      icon: Target,
      thumbnail: "/placeholder.svg?height=120&width=200&text=Strategy+Framework",
    },
    {
      id: 3,
      title: "Market Entry Analysis",
      type: "Analysis",
      typeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      date: "Mar 8",
      description: "Deep dive into European market opportunities for SaaS expansion",
      team: ["Alex R.", "Sarah M."],
      icon: TrendingUp,
      thumbnail: "/placeholder.svg?height=120&width=200&text=Market+Analysis",
    },
  ]

  const teamStaples = [
    { title: "Strategy Playbook", category: "Guide", link: "#" },
    { title: "Brand Voice Guidelines", category: "Reference", link: "#" },
    { title: "Client Onboarding Process", category: "Process", link: "#" },
    { title: "Competitive Analysis Template", category: "Template", link: "#" },
  ]

  const weeklyReads = [
    { title: "Q1 Market Trends Report", category: "Report", author: "Industry Insights", link: "#" },
    { title: "AI in Strategic Planning", category: "Article", author: "Harvard Business Review", link: "#" },
    { title: "Customer Journey Mapping 2024", category: "Guide", author: "UX Collective", link: "#" },
  ]

  const teamMoments = [
    {
      id: 1,
      title: "Strategy Sprint Planning",
      type: "Meeting",
      date: new Date(2024, 2, 20), // March 20, 2024
      time: "10:00 AM",
      attendees: ["Karen J.", "John D.", "Jane S."],
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Client Presentation Deadline",
      type: "Due Date",
      date: new Date(2024, 2, 22), // March 22, 2024
      time: "5:00 PM",
      attendees: ["Mike C.", "Sarah M."],
      color: "bg-orange-500",
    },
    {
      id: 3,
      title: "Alex - Vacation",
      type: "PTO",
      date: new Date(2024, 2, 25), // March 25, 2024
      endDate: new Date(2024, 2, 29), // March 29, 2024
      time: "All Day",
      attendees: ["Alex R."],
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Good Friday",
      type: "Holiday",
      date: new Date(2024, 2, 29), // March 29, 2024
      time: "All Day",
      attendees: [],
      color: "bg-red-500",
    },
    {
      id: 5,
      title: "Team Happy Hour",
      type: "Office Event",
      date: new Date(2024, 3, 2), // April 2, 2024
      time: "5:30 PM",
      attendees: ["All Team"],
      color: "bg-green-500",
    },
  ]

  const quickLinks = [
    { name: "Figma", icon: Figma, link: "#" },
    { name: "Brand Guidelines", icon: FileText, link: "#" },
    { name: "Client Portal", icon: Users, link: "#" },
    { name: "Analytics", icon: BarChart3, link: "#" },
    { name: "Time Tracking", icon: Clock, link: "#" },
    { name: "Settings", icon: Settings, link: "#" },
  ]

  const handleAddSnap = (snapData: any) => {
    toast.success("Snap added successfully! 🎉")
    setSnapDialogOpen(false)
    // Refresh snaps after adding a new one
    setTimeout(refreshSnaps, 500)
  }

  const handleNominate = (nominationData: any) => {
    toast.success("Nomination submitted! 🌟")
    setNominateDialogOpen(false)
  }

  if (!user || !user.fields) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none dark:opacity-[0.03]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"></div>
      </div>

      {/* Header - Clean and minimal */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                Welcome, {user?.fields?.Name?.split(" ")[0] || "User"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Your daily dose of team vibes and productivity
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Scrolling Marquee with Recent Snaps */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-2 overflow-hidden">
        <div className="marquee" ref={marqueeRef}>
          <div className="marquee-content" style={{ animation: "marquee 40s linear infinite" }}>
            {snaps.map((snap, index) => (
              <span key={index} className="mx-8">
                <span className="font-bold">{snap.author}:</span> {snap.quote}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* SECTION 1: FOR YOU */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">For You</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent dark:from-purple-800"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Code-ascope */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-transparent dark:from-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <CardHeader className="pb-3 relative">
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                  <Sparkles className="h-5 w-5" />
                  Code-ascope
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
                  <Badge
                    variant="secondary"
                    className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    This Week: Creative Alignment
                  </Badge>
                  <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">{codeAscope.message}</p>
                  <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Latest Snaps */}
            <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/50 to-transparent dark:from-blue-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Latest Snaps About You
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <UpdateIndicator
                      isUpdating={isLoadingSnaps}
                      hasNewData={hasNewSnaps}
                      lastUpdated={snapsLastUpdated}
                      onClick={refreshSnaps}
                    />
                    <Dialog open={snapDialogOpen} onOpenChange={setSnapDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Snap
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-slate-900">
                        <DialogHeader>
                          <DialogTitle>Submit a Snap</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="snap-about">About</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select team member" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers.map((member) => (
                                  <SelectItem key={member.id} value={member.id}>
                                    {member.fields.Name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="snap-message">Your snap</Label>
                            <Textarea
                              id="snap-message"
                              placeholder="Share something awesome about this person..."
                              className="min-h-[100px]"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="anonymous" />
                            <Label htmlFor="anonymous" className="text-sm">
                              Submit anonymously
                            </Label>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1" onClick={handleAddSnap}>
                              Submit Snap
                            </Button>
                            <Button variant="outline" onClick={() => setSnapDialogOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingSnaps && latestSnaps.length === 0 ? (
                    // Loading state
                    <>
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 border-l-4 border-blue-200 dark:border-blue-700 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 border-l-4 border-blue-200 dark:border-blue-700 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Actual content
                    latestSnaps.map((snap, index) => (
                      <div
                        key={index}
                        className={cn(
                          "bg-gray-50 dark:bg-slate-800 rounded-xl p-3 border-l-4 border-blue-200 dark:border-blue-700 transition-all",
                          hasNewSnaps && "animate-pulse-once",
                        )}
                      >
                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 leading-relaxed">"{snap.quote}"</p>
                        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium">— {snap.author}</span>
                          <span>{snap.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 2: VIBES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Vibes</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-200 to-transparent dark:from-pink-800"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Spotify Playlist */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-green-200/40 to-transparent dark:from-green-500/10 rounded-full translate-y-10 -translate-x-10"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Music className="h-5 w-5" />
                  This Week's Focus Playlist
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="bg-white/60 dark:bg-white/10 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900 dark:text-green-200">{spotifyPlaylist.title}</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">Curated by {spotifyPlaylist.curator}</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-300 mb-3">{spotifyPlaylist.description}</p>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Spotify
                </Button>
              </CardContent>
            </Card>

            {/* Question of the Week */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-200/30 to-transparent dark:from-yellow-500/10 rounded-full -translate-y-8 -translate-x-8"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
                  <Lightbulb className="h-5 w-5" />
                  Question of the Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg font-medium text-orange-900 dark:text-orange-200">
                    "{questionOfWeek.question}"
                  </p>
                  <div className="space-y-3">
                    {questionOfWeek.responses.map((response, index) => (
                      <div
                        key={index}
                        className="bg-white/60 dark:bg-white/10 rounded-xl p-3 border-l-4 border-orange-200 dark:border-orange-700"
                      >
                        <p className="text-sm text-orange-800 dark:text-orange-300">
                          "{response.answer}" — {response.author}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Input
                    placeholder="Share your answer..."
                    className="bg-white/80 dark:bg-white/5 border-orange-200 dark:border-orange-800"
                  />
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/50 bg-transparent"
                  >
                    Share Your Answer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Beast Babe */}
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-pink-200/30 to-transparent dark:from-pink-500/10 rounded-full -translate-y-14 translate-x-14"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-300">
                    <Award className="h-5 w-5" />
                    Beast Babe of the Week
                  </CardTitle>
                  <Dialog open={nominateDialogOpen} onOpenChange={setNominateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Nominate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-900">
                      <DialogHeader>
                        <DialogTitle>Nominate Beast Babe of the Week</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nominee">Nominate</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.fields.Name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="reason">Why they deserve it</Label>
                          <Textarea
                            id="reason"
                            placeholder="Tell us what makes them a beast babe this week..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="anonymous-nomination" />
                          <Label htmlFor="anonymous-nomination" className="text-sm">
                            Submit anonymously
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={handleNominate}>
                            Submit Nomination
                          </Button>
                          <Button variant="outline" onClick={() => setNominateDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-pink-200 dark:ring-pink-800">
                    <AvatarImage src={beastBabe.photoUrl || "/placeholder.svg"} alt={beastBabe.name} />
                    <AvatarFallback className="bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 font-bold">
                      {beastBabe.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-pink-900 dark:text-pink-200 text-lg">{beastBabe.name}</h3>
                    <p className="text-sm text-pink-700 dark:text-pink-300 mb-3">{beastBabe.role}</p>
                    <p className="text-sm text-pink-800 dark:text-pink-300 leading-relaxed">
                      "{beastBabe.achievement}"
                    </p>
                    <div className="flex items-center gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 3: WHAT'S KEEPING US BUSY */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Coffee className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">What's Keeping Us Busy</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent dark:from-orange-800"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Latest Meeting Recording */}
            <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-red-100/50 to-transparent dark:from-red-500/10 rounded-full translate-y-10 translate-x-10"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Play className="h-5 w-5 text-red-500" />
                  Latest Meeting Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{latestMeeting.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {latestMeeting.date} • {latestMeeting.duration}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Team alignment on Q1 priorities, Nike campaign review, and new business pipeline discussion.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* New Business Pipeline */}
            <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 lg:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent dark:from-blue-500/10 rounded-full -translate-y-16 -translate-x-16"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    New Business Pipeline
                  </CardTitle>
                  <UpdateIndicator
                    isUpdating={isLoadingPipeline}
                    hasNewData={hasNewPipeline}
                    lastUpdated={pipelineLastUpdated}
                    onClick={refreshPipeline}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingPipeline && businessPipeline.length === 0 ? (
                    // Loading state
                    <>
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-blue-200 dark:border-blue-700 animate-pulse">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-blue-200 dark:border-blue-700 animate-pulse">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Actual content
                    businessPipeline.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-blue-200 dark:border-blue-700 transition-all",
                          animatingItems[item.id] && "animate-highlight",
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                          <Badge variant="secondary" className={item.statusColor}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span
                              className={cn(
                                "font-medium text-gray-900 dark:text-gray-100 transition-all",
                                animatingItems[item.id] && "text-green-600 dark:text-green-400",
                              )}
                            >
                              {item.progress}%
                            </span>
                          </div>
                          <div className="relative">
                            <Progress value={item.progress} className="h-2" />
                            {animatingItems[item.id] && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Due: {item.dueDate}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white dark:text-white">Team:</span>
                            <div className="flex gap-1">
                              {item.owner.map((member, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs border-white text-white hover:bg-white/10"
                                >
                                  {member}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Latest Work Showcase */}
          <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-100/20 to-transparent dark:from-purple-500/10 rounded-full -translate-y-20 translate-x-20"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Latest Work Showcase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {latestWork.map((work, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800"
                  >
                    <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center relative">
                      <work.icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="absolute top-2 right-2">
                        <Badge className={work.typeColor}>{work.type}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{work.date}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{work.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                        {work.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{work.team.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Moments */}
          <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
                      <work.icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="absolute top-2 right-2">
                        <Badge className={work.typeColor}>{work.type}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{work.date}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{work.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                        {work.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{work.team.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Moments */}
          <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100/40 to-transparent dark:from-green-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                Team Moments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {teamMoments.slice(0, 8).map((moment, index) => {
                  // Determine background color based on moment type
                  let bgColor = "bg-gray-50 dark:bg-slate-800"
                  let textColor = "text-gray-800 dark:text-gray-200"
                  let borderColor = "border-gray-300 dark:border-gray-700"

                  switch (moment.type) {
                    case "Meeting":
                      bgColor = "bg-blue-50 dark:bg-blue-950/50"
                      textColor = "text-blue-800 dark:text-blue-300"
                      borderColor = "border-blue-300 dark:border-blue-700"
                      break
                    case "Due Date":
                      bgColor = "bg-orange-50 dark:bg-orange-950/50"
                      textColor = "text-orange-800 dark:text-orange-300"
                      borderColor = "border-orange-300 dark:border-orange-700"
                      break
                    case "PTO":
                      bgColor = "bg-purple-50 dark:bg-purple-950/50"
                      textColor = "text-purple-800 dark:text-purple-300"
                      borderColor = "border-purple-300 dark:border-purple-700"
                      break
                    case "Holiday":
                      bgColor = "bg-red-50 dark:bg-red-950/50"
                      textColor = "text-red-800 dark:text-red-300"
                      borderColor = "border-red-300 dark:border-red-700"
                      break
                    case "Office Event":
                      bgColor = "bg-green-50 dark:bg-green-950/50"
                      textColor = "text-green-800 dark:text-green-300"
                      borderColor = "border-green-300 dark:border-green-700"
                      break
                  }

                  return (
                    <div key={index} className={`${bgColor} rounded-xl p-3 border-l-4 ${borderColor} relative`}>
                      <div className="flex flex-col h-full">
                        <div className="mb-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${textColor} bg-white/50 dark:bg-slate-900/50`}
                          >
                            {moment.type}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">{moment.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-auto">
                          {moment.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {moment.time}
                        </p>
                        {moment.attendees.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Users className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {moment.attendees.length > 1
                                ? `${moment.attendees[0]} +${moment.attendees.length - 1}`
                                : moment.attendees[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 4: RESOURCES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Resources</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800"></div>
          </div>

          {/* Must Reads */}
          <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-blue-100/20 to-transparent dark:from-blue-500/10 rounded-full -translate-y-18 -translate-x-18"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Must Reads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Staples */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Team Staples
                  </h3>
                  <div className="space-y-3">
                    {teamStaples.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-l-4 border-yellow-200 dark:border-yellow-700"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Essential {item.category.toLowerCase()} for team reference.
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Read More
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* This Week's Must Reads */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    This Week's Must Reads
                  </h3>
                  <div className="space-y-3">
                    {weeklyReads.map((item, index) => {
                      const colors = [
                        {
                          bg: "bg-orange-50",
                          bgDark: "bg-orange-950/50",
                          border: "border-orange-200",
                          borderDark: "border-orange-700",
                          hover: "hover:bg-orange-100",
                          hoverDark: "dark:hover:bg-orange-900/50",
                        },
                        {
                          bg: "bg-blue-50",
                          bgDark: "bg-blue-950/50",
                          border: "border-blue-200",
                          borderDark: "border-blue-700",
                          hover: "hover:bg-blue-100",
                          hoverDark: "dark:hover:bg-blue-900/50",
                        },
                        {
                          bg: "bg-green-50",
                          bgDark: "bg-green-950/50",
                          border: "border-green-200",
                          borderDark: "border-green-700",
                          hover: "hover:bg-green-100",
                          hoverDark: "dark:hover:bg-green-900/50",
                        },
                      ]
                      const color = colors[index % colors.length]
                      return (
                        <div
                          key={index}
                          className={`${color.bg} ${color.bgDark} rounded-xl p-4 ${color.hover} ${color.hoverDark} transition-colors border-l-4 ${color.border} ${color.borderDark}`}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.author}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Read More
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Resources */}
          <TeamResources />
        </section>
      </div>

      {/* Subtle footer gradient */}
      <div className="h-32 bg-gradient-to-t from-slate-100/50 to-transparent dark:from-slate-900/50"></div>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .marquee {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
        
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          padding-right: 100%;
        }
        
        @keyframes pulse-once {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; background-color: rgba(59, 130, 246, 0.1); }
        }
        
        .animate-pulse-once {
          animation: pulse-once 2s ease-in-out 1;
        }
        
        @keyframes highlight {
          0% { background-color: rgba(34, 197, 94, 0.1); }
          50% { background-color: rgba(34, 197, 94, 0.2); }
          100% { background-color: rgba(34, 197, 94, 0); }
        }
        
        .animate-highlight {
          animation: highlight 2s ease-out 1;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
