/* PART 1 */

"use client"

import React from "react"
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
import { UpdateIndicator } from "@/components/update-indicator"
import { useLiveData } from "@/hooks/use-live-data"
import { cn } from "@/lib/utils"
import {
  Plus,
  Play,
  Calendar,
  Users,
  BookOpen,
  Music,
  Award,
  Clock,
  Figma,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Star,
  Sparkles,
  Camera,
  Headphones,
  ExternalLink,
  Briefcase,
  TrendingUp,
  Palette,
  Target,
  Lightbulb,
  Coffee,
  Heart,
} from "lucide-react"
import { useAirtableUser } from "@/use-airtable-user"
import { toast } from "sonner"
import { TeamResources } from "@/components/team-resources"
import { TeamAvatarGallery } from "@/components/team-avatar-gallery"
import { fetchUserSnaps } from "@/lib/airtable";

// Types for our data


interface PipelineItem {
  id: string | number
  name: string
  type: string
  description: string
  dueDate: string
  lead: string
  owner: string[]
  status: string
  statusColor: string
  progress: number
  notes: string
  url: string
}

interface TeamMember {
  id: string
  fields: {
    Name: string
    Role: string
    Discipline: string
    Email: string
    Manager: string[]
    "Photo URL": string
    Birthday: string
    Featured: boolean
    "Code-a-scope": string
    "Snaps Count": number
    "Featured Count": number
  }
}

/* END PART 1 */
/* PART 2 */
export default function TeamDashboard() {
  const { user, logout } = useAirtableUser()
  const [snapDialogOpen, setSnapDialogOpen] = useState(false)
  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)

  // State for real data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/api/team")
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error("Error fetching team members:", error)
      }
    }
    fetchTeamMembers()
  }, [])

  // Find current user in team data
  const currentUser = teamMembers.find(
    (member) => member.fields.Email === user?.email || member.fields.Name === user?.name
  ) || teamMembers.find((member) => member.fields.Name === "Karen Piper") // Fallback to Karen

  // Select Beast Babe of the Week - prioritize Featured members, then random
  const featuredMembers = teamMembers.filter((member) => member.fields.Featured)
  const currentBeastBabe = featuredMembers.length > 0 
    ? featuredMembers[0] 
    : teamMembers.find((member) => member.fields["Photo URL"]) // Pick someone with a photo
    || teamMembers[0] // Final fallback

  const beastBabe = currentBeastBabe ? {
    name: currentBeastBabe.fields.Name,
    role: currentBeastBabe.fields.Role,
    discipline: currentBeastBabe.fields.Discipline,
    photoUrl: currentBeastBabe.fields["Photo URL"],
    achievement: "Outstanding performance and dedication to excellence this week",
    tag: "Team MVP",
  } : null

  // Get Code-a-scope for current user
  const codeAscope = {
    message: currentUser?.fields["Code-a-scope"] || 
      "Today's energy is perfect for tackling complex problems. Your analytical skills are particularly sharp - use them to break down that challenging project into manageable pieces. A collaborative approach will yield unexpected insights.",
    color: "bg-purple-50 border-purple-200",
  }

  // Fetch snaps with live updates - filter by current user
  const fetchSnaps = async () => {
    const userName = currentUser?.fields.Name || user?.name
    const url = userName ? `/api/snaps?mentioned=${encodeURIComponent(userName)}` : '/api/snaps'
    
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch snaps")
    const data = await response.json()

    return Array.isArray(data) ? data : []
  }

  // Fetch pipeline data with live updates
  const fetchPipeline = async () => {
    const response = await fetch("/api/pipeline")
    if (!response.ok) throw new Error("Failed to fetch pipeline data")
    const data = await response.json()

    return Array.isArray(data) ? data : []
  }
/* END PART 2 */
/* PART 3 */
// Initial mock data for snaps (fallback)
  const initialSnaps: Snap[] = [
    {
      id: 1,
      quote: "Great work on the client presentation! Your insights were spot on.",
      author: "Team Member",
      mentioned: currentUser?.fields.Name || "You",
      timestamp: "2 hours ago",
      category: "Leadership",
    },
  ]

  // Initial mock data for pipeline (fallback)
  const initialPipeline: PipelineItem[] = [
    {
      id: 1,
      name: "Strategy Project",
      type: "Strategy",
      description: "Sample project description",
      dueDate: "Mar 25",
      lead: "Team Lead",
      owner: ["Team Member"],
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      progress: 65,
      notes: "",
      url: "",
    },
  ]

  // Use our custom hook for live data
  const {
    data: allSnaps,
    isLoading: isLoadingAllSnaps,
    lastUpdated: allSnapsLastUpdated,
    hasNewData: hasNewAllSnaps,
    refresh: refreshAllSnaps,
  } = useLiveData<Snap[]>(fetchSnaps, initialSnaps, { interval: 15000 }) // All snaps for marquee

  const {
    data: userSnaps,
    isLoading: isLoadingSnaps,
    lastUpdated: snapsLastUpdated,
    hasNewData: hasNewSnaps,
    refresh: refreshSnaps,
  } = useLiveData<Snap[]>(fetchUserSnaps, initialSnaps, { interval: 15000 }) // User-specific snaps

  const {
    data: businessPipeline,
    isLoading: isLoadingPipeline,
    lastUpdated: pipelineLastUpdated,
    hasNewData: hasNewPipeline,
    refresh: refreshPipeline,
  } = useLiveData<PipelineItem[]>(fetchPipeline, initialPipeline, { interval: 20000 })

  // Ensure businessPipeline is always an array
  const safeBusinessPipeline = Array.isArray(businessPipeline) ? businessPipeline : initialPipeline

  // Get the latest 20 snaps for marquee
  const marqueeSnaps = Array.isArray(allSnaps) ? allSnaps.slice(0, 20) : initialSnaps.slice(0, 2)

  // Get the latest 2 user-specific snaps for display in the card
  const latestSnaps = Array.isArray(userSnaps) ? userSnaps.slice(0, 2) : initialSnaps.slice(0, 2)

  // Animation for progress bars when they update
  const [animatingItems, setAnimatingItems] = useState<Record<string | number, boolean>>({})

  // Track previous pipeline progress values to animate changes
  const prevPipelineRef = useRef<PipelineItem[]>(initialPipeline)

  useEffect(() => {
    // Check if any pipeline items have changed progress
    const changedItems: Record<string | number, boolean> = {}

    safeBusinessPipeline.forEach((item) => {
      const prevItem = prevPipelineRef.current.find((p) => p.id === item.id)
      if (prevItem && prevItem.progress !== item.progress) {
        changedItems[item.id] = true
      }
    })

    if (Object.keys(changedItems).length > 0) {
      setAnimatingItems(changedItems)
      setTimeout(() => setAnimatingItems({}), 2000)
    }

    prevPipelineRef.current = safeBusinessPipeline
  }, [safeBusinessPipeline])
/* END PART 3 */
/* PART 4 */
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
      date: new Date(2024, 2, 20),
      time: "10:00 AM",
      attendees: ["Karen J.", "John D.", "Jane S."],
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Client Presentation Deadline",
      type: "Due Date",
      date: new Date(2024, 2, 22),
      time: "5:00 PM",
      attendees: ["Mike C.", "Sarah M."],
      color: "bg-orange-500",
    },
    {
      id: 3,
      title: "Alex - Vacation",
      type: "PTO",
      date: new Date(2024, 2, 25),
      endDate: new Date(2024, 2, 29),
      time: "All Day",
      attendees: ["Alex R."],
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Good Friday",
      type: "Holiday",
      date: new Date(2024, 2, 29),
      time: "All Day",
      attendees: [],
      color: "bg-red-500",
    },
    {
      id: 5,
      title: "Team Happy Hour",
      type: "Office Event",
      date: new Date(2024, 3, 2),
      time: "5:30 PM",
      attendees: ["All Team"],
      color: "bg-green-500",
    },
  ]

  const handleAddSnap = (snapData: any) => {
    toast.success("Snap added successfully! 🎉")
    setSnapDialogOpen(false)
    setTimeout(refreshSnaps, 500)
  }

  const handleNominate = (nominationData: any) => {
    toast.success("Nomination submitted! 🌟")
    setNominateDialogOpen(false)
  }

  if (!user) {
    return <div>Loading...</div>
  }
/* END PART 4 */
/* PART 5 */
return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"></div>
      </div>

      {/* Header - Clean and minimal */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Strategy Team Dashboard</h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Welcome back, {currentUser?.fields.Name || user?.name || 'Team Member'}!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Scrolling Marquee with Latest 20 Snaps */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-2 overflow-hidden">
        <div className="marquee" ref={marqueeRef}>
          <div className="marquee-content" style={{ animation: "marquee 60s linear infinite" }}>
            {marqueeSnaps.map((snap, index) => (
              <span key={index} className="mx-8">
                <span className="font-bold">{snap.author}:</span> {snap.quote}
                {snap.mentioned && <span className="text-yellow-200"> → {snap.mentioned}</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8"> 
  {/* END PART 5 */}
  {/* PART 6 */}
  {/* SECTION 1: FOR YOU */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-bold text-gray-100">For You</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Code-ascope */}
            <Card className="bg-gradient-to-br from-purple-950/50 to-indigo-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <CardHeader className="pb-3 relative">
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="h-5 w-5" />
                  Code-ascope
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
                  <Badge variant="secondary" className="bg-purple-900 text-purple-200">
                    This Week: Creative Alignment
                  </Badge>
                  <p className="text-sm text-purple-300 leading-relaxed">{codeAscope.message}</p>
                  <div className="flex items-center gap-1 text-xs text-purple-400">
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
            <Card className="bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Camera className="h-5 w-5 text-blue-400" />
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
                        <Button size="sm" className="bg-blue-700 hover:bg-blue-600">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Snap
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900">
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
                                  <SelectItem key={member.id} value={member.fields.Name}>
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
                    <>
                      <div className="bg-slate-800 rounded-xl p-3 border-l-4 border-blue-700 animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-3 bg-slate-700 rounded w-20"></div>
                          <div className="h-3 bg-slate-700 rounded w-16"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    latestSnaps.map((snap, index) => (
                      <div
                        key={index}
                        className={cn(
                          "bg-slate-800 rounded-xl p-3 border-l-4 border-blue-700 transition-all",
                          hasNewSnaps && "animate-pulse-once",
                        )}
                      >
                        <p className="text-sm text-gray-200 mb-2 leading-relaxed">"{snap.quote}"</p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
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

        {/* END PART 6 */}
  {/* PART 7 */}
{/* SECTION 2: VIBES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-pink-400" />
            <h2 className="text-xl font-bold text-gray-100">Vibes</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Spotify Playlist */}
            <Card className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-green-500/10 rounded-full translate-y-10 -translate-x-10"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-green-300">
                  <Music className="h-5 w-5" />
                  This Week's Focus Playlist
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-200">{spotifyPlaylist.title}</h3>
                      <p className="text-sm text-green-300">Curated by {spotifyPlaylist.curator}</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-300 mb-3">{spotifyPlaylist.description}</p>
                </div>
                <Button className="w-full bg-green-700 hover:bg-green-600 text-white">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Spotify
                </Button>
              </CardContent>
            </Card>

            {/* Question of the Week */}
            <Card className="bg-gradient-to-br from-yellow-950/50 to-orange-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-500/10 rounded-full -translate-y-8 -translate-x-8"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-orange-300">
                  <Lightbulb className="h-5 w-5" />
                  Question of the Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg font-medium text-orange-200">"{questionOfWeek.question}"</p>
                  <div className="space-y-3">
                    {questionOfWeek.responses.map((response, index) => (
                      <div key={index} className="bg-white/10 rounded-xl p-3 border-l-4 border-orange-700">
                        <p className="text-sm text-orange-300">
                          "{response.answer}" — {response.author}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Input placeholder="Share your answer..." className="bg-white/5 border-orange-800" />
                  <Button
                    variant="outline"
                    className="w-full border-orange-700 text-orange-300 hover:bg-orange-950/50 bg-transparent"
                  >
                    Share Your Answer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Beast Babe */}
            {beastBabe && (
              <Card className="bg-gradient-to-br from-pink-950/50 to-rose-950/50 shadow-md rounded-2xl border-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-pink-500/10 rounded-full -translate-y-14 translate-x-14"></div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-pink-300">
                      <Award className="h-5 w-5" />
                      Beast Babe
                    </CardTitle>
                    <Dialog open={nominateDialogOpen} onOpenChange={setNominateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-pink-700 hover:bg-pink-600">
                          <Star className="h-4 w-4 mr-1" />
                          Nominate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900">
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
                                  <SelectItem key={member.id} value={member.fields.Name}>
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
                    <Avatar className="h-16 w-16 ring-4 ring-pink-800">
                      <AvatarImage src={beastBabe.photoUrl || "/placeholder.svg"} alt={beastBabe.name} />
                      <AvatarFallback className="bg-pink-800 text-pink-200 font-bold">
                        {beastBabe.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-pink-200 text-lg">{beastBabe.name}</h3>
                      <p className="text-sm text-pink-300 mb-1">{beastBabe.role}</p>
                      {beastBabe.discipline && (
                        <p className="text-xs text-pink-400 mb-3">{beastBabe.discipline}</p>
                      )}
                      <p className="text-sm text-pink-300 leading-relaxed">"{beastBabe.achievement}"</p>
                      <div className="flex items-center gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
  {/* END PART 7 */}
  {/* PART 8 */}
{/* SECTION 3: WHAT'S KEEPING US BUSY */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Coffee className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-bold text-gray-100">What's Keeping Us Busy</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Latest Meeting Recording */}
            <Card className="bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-red-500/10 rounded-full translate-y-10 translate-x-10"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Play className="h-5 w-5 text-red-500" />
                  Latest Meeting Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-100">{latestMeeting.title}</h3>
                      <p className="text-sm text-gray-400">
                        {latestMeeting.date} • {latestMeeting.duration}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
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
            <Card className="bg-slate-900 shadow-md rounded-2xl border-0 lg:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 rounded-full -translate-y-16 -translate-x-16"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Briefcase className="h-5 w-5 text-blue-400" />
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
                  {isLoadingPipeline && safeBusinessPipeline.length === 0 ? (
                    <>
                      <div className="bg-slate-800 rounded-xl p-4 border-l-4 border-blue-700 animate-pulse">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-5 bg-slate-700 rounded w-1/3"></div>
                          <div className="h-5 bg-slate-700 rounded w-20"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-slate-700 rounded w-full"></div>
                          <div className="h-2 bg-slate-700 rounded w-full"></div>
                          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    safeBusinessPipeline.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "bg-slate-800 rounded-xl p-4 border-l-4 border-blue-700 transition-all",
                          animatingItems[item.id] && "animate-highlight",
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-100">{item.name}</h3>
                            {item.type && (
                              <p className="text-xs text-gray-500 mb-1">{item.type}</p>
                            )}
                            {item.description && (
                              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <Badge variant="secondary" className={item.statusColor}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span
                              className={cn(
                                "font-medium text-gray-100 transition-all",
                                animatingItems[item.id] && "text-green-400",
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
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Due: {item.dueDate}</span>
                            {item.lead && (
                              <span className="text-gray-400">Lead: {item.lead}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Team:</span>
                            {item.owner.map((member, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs border-gray-600 text-gray-300 bg-slate-700/50"
                              >
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* END PART 8 */}
  {/* PART 9 */}
{/* Latest Work Showcase */}
          <Card className="bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/10 rounded-full -translate-y-20 translate-x-20"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Palette className="h-5 w-5 text-purple-400" />
                Latest Work Showcase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {latestWork.map((work, index) => (
                  <div key={index} className="bg-slate-800 rounded-xl overflow-hidden border border-gray-800">
                    <div className="aspect-video w-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center relative">
                      <work.icon className="h-12 w-12 text-gray-500" />
                      <div className="absolute top-2 right-2">
                        <Badge className={work.typeColor}>{work.type}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">{work.date}</span>
                      </div>
                      <h3 className="font-bold text-gray-100 mb-2">{work.title}</h3>
                      <p className="text-sm text-gray-400 mb-3 leading-relaxed">{work.description}</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-400">{work.team.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Moments */}
          <Card className="bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Calendar className="h-5 w-5 text-green-400" />
                Team Moments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {teamMoments.slice(0, 8).map((moment, index) => {
                  let bgColor = "bg-slate-800"
                  let textColor = "text-gray-200"
                  let borderColor = "border-gray-700"

                  switch (moment.type) {
                    case "Meeting":
                      bgColor = "bg-blue-950/50"
                      textColor = "text-blue-300"
                      borderColor = "border-blue-700"
                      break
                    case "Due Date":
                      bgColor = "bg-orange-950/50"
                      textColor = "text-orange-300"
                      borderColor = "border-orange-700"
                      break
                    case "PTO":
                      bgColor = "bg-purple-950/50"
                      textColor = "text-purple-300"
                      borderColor = "border-purple-700"
                      break
                    case "Holiday":
                      bgColor = "bg-red-950/50"
                      textColor = "text-red-300"
                      borderColor = "border-red-700"
                      break
                    case "Office Event":
                      bgColor = "bg-green-950/50"
                      textColor = "text-green-300"
                      borderColor = "border-green-700"
                      break
                  }

                  return (
                    <div key={index} className={`${bgColor} rounded-xl p-3 border-l-4 ${borderColor} relative`}>
                      <div className="flex flex-col h-full">
                        <div className="mb-1">
                          <Badge variant="secondary" className={`text-xs ${textColor} bg-slate-900/50`}>
                            {moment.type}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-100 text-sm mb-1">{moment.title}</h3>
                        <p className="text-xs text-gray-400 mb-auto">
                          {moment.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {moment.time}
                        </p>
                        {moment.attendees.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-400 truncate">
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
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-gray-100">Resources</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-800 to-transparent"></div>
          </div>

          {/* Must Reads */}
          <Card className="bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-blue-500/10 rounded-full -translate-y-18 -translate-x-18"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <BookOpen className="h-5 w-5 text-blue-400" />
                Must Reads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Staples */}
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Team Staples
                  </h3>
                  <div className="space-y-3">
                    {teamStaples.map((item, index) => (
                      <div
                        key={index}
                        className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-colors border-l-4 border-yellow-700"
                      >
                        <h4 className="font-medium text-gray-100 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">
                          Essential {item.category.toLowerCase()} for team reference.
                        </p>
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-400 hover:text-blue-300">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Read More
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* This Week's Must Reads */}
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    This Week's Must Reads
                  </h3>
                  <div className="space-y-3">
                    {weeklyReads.map((item, index) => {
                      const colors = [
                        {
                          bg: "bg-orange-950/50",
                          border: "border-orange-700",
                          hover: "hover:bg-orange-900/50",
                        },
                        {
                          bg: "bg-blue-950/50",
                          border: "border-blue-700",
                          hover: "hover:bg-blue-900/50",
                        },
                        {
                          bg: "bg-green-950/50",
                          border: "border-green-700",
                          hover: "hover:bg-green-900/50",
                        },
                      ]
                      const color = colors[index % colors.length]
                      return (
                        <div
                          key={index}
                          className={`${color.bg} rounded-xl p-4 ${color.hover} transition-colors border-l-4 ${color.border}`}
                        >
                          <h4 className="font-medium text-gray-100 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-400 mb-2">{item.author}</p>
                          <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-400 hover:text-blue-300">
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

          {/* Team Avatar Gallery */}
        </section>
      </div>

      {/* Subtle footer gradient */}
      <div className="h-32 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
  {/* END PART 9 */}
  
