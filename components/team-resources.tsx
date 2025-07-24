"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Key, Globe, Book, Zap, Users, TrendingUp, Palette, Target } from "lucide-react"

const clientResources = [
  {
    title: "Client Onboarding Template",
    category: "Template",
    client: "All Clients",
    date: "Mar 2024",
    description: "Standardized onboarding process and welcome packet template",
    link: "#",
    type: "Template",
    status: "Active",
  },
  {
    title: "Q1 Strategy Presentation Template",
    category: "Presentation",
    client: "TechCorp",
    date: "Feb 2024",
    description: "Master template for quarterly strategy presentations",
    link: "#",
    type: "PowerPoint",
    status: "Active",
  },
  {
    title: "Brand Positioning Workshop Guide",
    category: "Workshop",
    client: "StartupXYZ",
    date: "Jan 2024",
    description: "Complete facilitation guide for brand positioning sessions",
    link: "#",
    type: "Guide",
    status: "Completed",
  },
  {
    title: "Competitive Analysis Framework",
    category: "Framework",
    client: "All Clients",
    date: "Dec 2023",
    description: "Systematic approach to competitive landscape analysis",
    link: "#",
    type: "Framework",
    status: "Active",
  },
]

const researchData = [
  {
    title: "2024 Consumer Behavior Trends",
    source: "McKinsey & Company",
    date: "Mar 2024",
    description: "Comprehensive analysis of post-pandemic consumer behavior shifts",
    link: "#",
    type: "Report",
    industry: "General",
  },
  {
    title: "SaaS Market Landscape 2024",
    source: "Gartner Research",
    date: "Feb 2024",
    description: "Market sizing and competitive analysis for SaaS industry",
    link: "#",
    type: "Market Research",
    industry: "Technology",
  },
  {
    title: "Gen Z Brand Preferences Study",
    source: "Deloitte Insights",
    date: "Jan 2024",
    description: "Deep dive into Gen Z purchasing decisions and brand loyalty",
    link: "#",
    type: "Study",
    industry: "Consumer",
  },
  {
    title: "B2B Decision Making Process 2024",
    source: "Harvard Business Review",
    date: "Dec 2023",
    description: "How B2B buying committees make purchasing decisions",
    link: "#",
    type: "Analysis",
    industry: "B2B",
  },
]

const templatesFrameworks = [
  {
    title: "Strategic Planning Canvas",
    category: "Planning",
    description: "One-page strategic planning template for quarterly reviews",
    lastUpdated: "Mar 2024",
    downloads: 47,
    type: "Canvas",
  },
  {
    title: "Customer Journey Mapping Template",
    category: "UX Strategy",
    description: "Comprehensive template for mapping customer touchpoints",
    lastUpdated: "Feb 2024",
    downloads: 32,
    type: "Template",
  },
  {
    title: "SWOT Analysis Framework",
    category: "Analysis",
    description: "Enhanced SWOT template with scoring methodology",
    lastUpdated: "Jan 2024",
    downloads: 28,
    type: "Framework",
  },
  {
    title: "Brand Architecture Model",
    category: "Branding",
    description: "Visual framework for organizing brand portfolios",
    lastUpdated: "Dec 2023",
    downloads: 19,
    type: "Model",
  },
]

const brandCreative = [
  {
    name: "Brand Guidelines Portal",
    description: "Centralized brand assets and usage guidelines",
    url: "https://brand.company.com",
    category: "Guidelines",
    lastUpdated: "Mar 2024",
  },
  {
    name: "Stock Photo Library",
    description: "Curated collection of brand-approved stock photography",
    url: "https://photos.company.com",
    category: "Assets",
    lastUpdated: "Feb 2024",
  },
  {
    name: "Icon & Illustration Library",
    description: "Custom icons and illustrations for presentations",
    url: "https://icons.company.com",
    category: "Assets",
    lastUpdated: "Jan 2024",
  },
  {
    name: "Presentation Template Library",
    description: "Brand-compliant PowerPoint and Keynote templates",
    url: "https://templates.company.com",
    category: "Templates",
    lastUpdated: "Mar 2024",
  },
]

const toolsPlatforms = [
  {
    name: "Miro Strategy Boards",
    description: "Collaborative whiteboarding for strategy sessions",
    url: "https://miro.com/app/board/strategy",
    category: "Collaboration",
    team: "All Team",
    status: "Active",
  },
  {
    name: "Figma Design System",
    description: "Design collaboration and prototyping platform",
    url: "https://figma.com/team/strategy",
    category: "Design",
    team: "Design Team",
    status: "Active",
  },
  {
    name: "Analytics Dashboard",
    description: "Client performance metrics and KPI tracking",
    url: "https://analytics.company.com",
    category: "Analytics",
    team: "All Team",
    status: "Active",
  },
  {
    name: "Survey Platform",
    description: "Customer research and feedback collection",
    url: "https://surveys.company.com",
    category: "Research",
    team: "Research Team",
    status: "Active",
  },
]

const trainingDevelopment = [
  {
    title: "Strategic Thinking Masterclass",
    provider: "LinkedIn Learning",
    duration: "4 hours",
    category: "Strategy",
    completed: 8,
    total: 12,
    dueDate: "Apr 2024",
  },
  {
    title: "Data-Driven Decision Making",
    provider: "Coursera",
    duration: "6 weeks",
    category: "Analytics",
    completed: 5,
    total: 12,
    dueDate: "May 2024",
  },
  {
    title: "Design Thinking Workshop",
    provider: "IDEO U",
    duration: "2 days",
    category: "Innovation",
    completed: 12,
    total: 12,
    dueDate: "Completed",
  },
  {
    title: "Client Presentation Skills",
    provider: "Internal Training",
    duration: "1 day",
    category: "Communication",
    completed: 3,
    total: 12,
    dueDate: "Jun 2024",
  },
]

const credentials = [
  {
    service: "Adobe Creative Suite",
    username: "strategy@company.com",
    note: "Shared team account - check with Karen for password",
    category: "Design Tools",
    lastUpdated: "Mar 2024",
  },
  {
    service: "Miro Team Account",
    username: "admin@company.com",
    note: "Team workspace admin access",
    category: "Collaboration",
    lastUpdated: "Feb 2024",
  },
  {
    service: "Survey Monkey Pro",
    username: "research@company.com",
    note: "For client research and feedback collection",
    category: "Research",
    lastUpdated: "Jan 2024",
  },
  {
    service: "Analytics Platform",
    username: "analytics@company.com",
    note: "Dashboard access for all team members",
    category: "Analytics",
    lastUpdated: "Mar 2024",
  },
  {
    service: "Brand Asset Portal",
    username: "brand@company.com",
    note: "Access to brand guidelines and assets",
    category: "Brand",
    lastUpdated: "Feb 2024",
  },
]

export function TeamResources() {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md rounded-2xl border-0 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-100/20 to-transparent dark:from-emerald-500/10 rounded-full -translate-y-20 -translate-x-20"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Book className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Team Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-6 text-xs">
            <TabsTrigger value="client" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Client
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Research
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="brand" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              Brand
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-1">
              <Key className="h-3 w-3" />
              Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Resources & Templates</h3>
                <Badge variant="outline" className="text-xs">
                  {clientResources.length} items
                </Badge>
              </div>
              {clientResources.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-l-4 border-blue-200 dark:border-blue-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                        <Badge variant={item.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>{item.client}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Market Research & Industry Data
                </h3>
                <Badge variant="outline" className="text-xs">
                  {researchData.length} reports
                </Badge>
              </div>
              {researchData.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-l-4 border-purple-200 dark:border-purple-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {item.industry}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-auto text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Strategy Templates & Frameworks
                </h3>
                <Badge variant="outline" className="text-xs">
                  {templatesFrameworks.length} templates
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templatesFrameworks.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-l-4 border-green-200 dark:border-green-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <span>Updated {item.lastUpdated}</span>
                            <span>•</span>
                            <span>{item.downloads} downloads</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="brand" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand & Creative Resources</h3>
                <Badge variant="outline" className="text-xs">
                  {brandCreative.length} resources
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brandCreative.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-l-4 border-pink-200 dark:border-pink-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎨</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                            <span>•</span>
                            <span>Updated {item.lastUpdated}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tools & Platforms</h3>
                <Badge variant="outline" className="text-xs">
                  {toolsPlatforms.length} tools
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {toolsPlatforms.map((tool, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-l-4 border-indigo-200 dark:border-indigo-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🛠️</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{tool.name}</h4>
                          <Badge variant={tool.status === "Active" ? "default" : "secondary"} className="text-xs">
                            {tool.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tool.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <Badge variant="secondary" className="text-xs">
                              {tool.category}
                            </Badge>
                            <span>•</span>
                            <span>{tool.team}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Security Notice</span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Never share passwords in public channels. Use the team password manager for sensitive credentials.
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Access & Credentials</h3>
                <Badge variant="outline" className="text-xs">
                  {credentials.length} accounts
                </Badge>
              </div>

              {credentials.map((cred, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-orange-200 dark:border-orange-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{cred.service}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-mono bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded text-xs">
                          {cred.username}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{cred.note}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600">Last updated: {cred.lastUpdated}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-4">
                      {cred.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
