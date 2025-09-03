import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MapPin, 
  Plus, 
  Palette, 
  Navigation, 
  Trash2,
  TreePine,
  Construction,
  Share,
  Save,
  Undo,
  Users,
  MessageSquare
} from "lucide-react"
import { useToast } from "@/hooks/useToast"

export function Planning() {
  const [planningMode, setPlanningMode] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [annotations, setAnnotations] = useState<any[]>([])
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'John Smith', role: 'Traffic Engineer', active: true },
    { id: '2', name: 'Jane Doe', role: 'Urban Planner', active: false },
    { id: '3', name: 'Mike Johnson', role: 'Maintenance Supervisor', active: true }
  ])
  const { toast } = useToast()

  const planningTools = [
    { id: 'zebra', name: 'Zebra Crossing', icon: '🚶', color: 'bg-yellow-500' },
    { id: 'separator', name: 'Lane Separator', icon: '🚧', color: 'bg-orange-500' },
    { id: 'beautification', name: 'Beautification', icon: '🌳', color: 'bg-green-500' },
    { id: 'garbage', name: 'Garbage Point', icon: '🗑️', color: 'bg-blue-500' },
    { id: 'signal', name: 'Traffic Signal', icon: '🚦', color: 'bg-red-500' }
  ]

  const handleSavePlan = () => {
    console.log('Planning: Saving current plan')
    toast({
      title: "Success",
      description: "Planning session saved successfully",
    })
  }

  const handleSharePlan = () => {
    console.log('Planning: Sharing plan')
    const shareLink = `${window.location.origin}/planning/shared/${Math.random().toString(36).substr(2, 9)}`
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Success",
      description: "Share link copied to clipboard",
    })
  }

  const addAnnotation = (type: string, content: string) => {
    const newAnnotation = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20
    }
    setAnnotations([...annotations, newAnnotation])
    console.log('Planning: Added annotation:', newAnnotation)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Planning & Collaboration</h1>
          <p className="text-slate-600 dark:text-slate-400">Design and plan infrastructure improvements collaboratively</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={planningMode ? "default" : "outline"}
            onClick={() => setPlanningMode(!planningMode)}
            className={planningMode ? "bg-gradient-to-r from-blue-500 to-indigo-600" : ""}
          >
            <Construction className="w-4 h-4 mr-2" />
            {planningMode ? 'Exit Planning' : 'Enter Planning Mode'}
          </Button>
          <Button variant="outline" onClick={handleSavePlan}>
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>
          <Button variant="outline" onClick={handleSharePlan}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Planning Canvas
                {planningMode && <Badge className="ml-2 bg-green-500">Planning Mode Active</Badge>}
              </CardTitle>
              <CardDescription>
                Interactive planning interface for infrastructure design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="h-96 bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden">
                  {/* Planning Canvas */}
                  <div className="relative w-full h-full">
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%">
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    {/* Annotations */}
                    {annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
                      >
                        {annotation.type === 'note' ? (
                          <div className="bg-yellow-200 dark:bg-yellow-800 p-2 rounded-lg shadow-lg max-w-48">
                            <p className="text-xs font-medium">{annotation.content}</p>
                            <p className="text-xs text-slate-500 mt-1">{annotation.author}</p>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                            {planningTools.find(tool => tool.id === annotation.type)?.icon || '📍'}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Center placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <MapPin className="w-16 h-16 mx-auto text-slate-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                            {planningMode ? 'Planning Mode Active' : 'Interactive Planning Canvas'}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            {planningMode ? 'Click to place elements or add annotations' : 'Enable planning mode to start designing'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Planning Tools */}
                {planningMode && (
                  <div className="absolute top-4 left-4 space-y-2">
                    {planningTools.map((tool) => (
                      <Button
                        key={tool.id}
                        size="sm"
                        variant={selectedTool === tool.id ? "default" : "secondary"}
                        className={`${tool.color} text-white hover:opacity-80`}
                        onClick={() => {
                          setSelectedTool(tool.id)
                          addAnnotation(tool.id, tool.name)
                        }}
                      >
                        <span className="mr-2">{tool.icon}</span>
                        {tool.name}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="absolute bottom-4 right-4 space-x-2">
                  <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    <Undo className="w-4 h-4 mr-2" />
                    Undo
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-900">
                      <DialogHeader>
                        <DialogTitle>Add Annotation</DialogTitle>
                        <DialogDescription>
                          Add a note or comment to the planning canvas
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="note">Note Content</Label>
                          <Textarea
                            id="note"
                            placeholder="Enter your note or comment..."
                            onBlur={(e) => {
                              if (e.target.value.trim()) {
                                addAnnotation('note', e.target.value)
                                e.target.value = ''
                              }
                            }}
                          />
                        </div>
                        <Button className="w-full">Add Note</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Collaboration Panel */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Collaborators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${collaborator.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{collaborator.name}</p>
                      <p className="text-xs text-slate-500">{collaborator.role}</p>
                    </div>
                  </div>
                  <Badge variant={collaborator.active ? "default" : "secondary"}>
                    {collaborator.active ? "Online" : "Offline"}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Invite Collaborator
              </Button>
            </CardContent>
          </Card>

          {/* Planning Tools */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Construction className="w-5 h-5 mr-2 text-orange-600" />
                Planning Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {planningTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!planningMode}
                  onClick={() => {
                    setSelectedTool(tool.id)
                    addAnnotation(tool.id, tool.name)
                  }}
                >
                  <span className="mr-2">{tool.icon}</span>
                  {tool.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Annotations */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {annotations.slice(-5).map((annotation) => (
                <div key={annotation.id} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {annotation.type === 'note' ? 'Note' : planningTools.find(t => t.id === annotation.type)?.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(annotation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {annotation.content}
                  </p>
                </div>
              ))}
              {annotations.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No annotations yet. Start planning to add elements!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <TabsTrigger value="proposals">Project Proposals</TabsTrigger>
          <TabsTrigger value="simulations">Traffic Simulations</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: '1',
                title: 'Downtown Intersection Improvement',
                description: 'Add traffic signals and pedestrian crossings',
                status: 'Under Review',
                budget: '$125,000',
                timeline: '3 months'
              },
              {
                id: '2',
                title: 'Park Avenue Beautification',
                description: 'Tree planting and sidewalk improvements',
                status: 'Approved',
                budget: '$85,000',
                timeline: '2 months'
              },
              {
                id: '3',
                title: 'Main Street Lane Reconfiguration',
                description: 'Optimize traffic flow with new lane markers',
                status: 'Planning',
                budget: '$45,000',
                timeline: '1 month'
              }
            ].map((proposal) => (
              <Card key={proposal.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription>{proposal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                      <Badge variant={
                        proposal.status === 'Approved' ? 'default' :
                        proposal.status === 'Under Review' ? 'secondary' : 'outline'
                      }>
                        {proposal.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Budget</span>
                      <span className="font-medium">{proposal.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Timeline</span>
                      <span className="font-medium">{proposal.timeline}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="simulations">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Traffic Flow Simulations</CardTitle>
              <CardDescription>Simulate traffic impact of proposed changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Navigation className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Traffic simulation engine would be integrated here</p>
                <p className="text-sm">Real-time traffic flow prediction and analysis</p>
                <Button className="mt-4" variant="outline">
                  Run Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <CardDescription>Track changes and revert to previous versions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { version: 'v1.3', date: '2024-01-15 14:30', author: 'John Smith', changes: 'Added traffic signals to Main St intersection' },
                  { version: 'v1.2', date: '2024-01-15 10:15', author: 'Jane Doe', changes: 'Updated beautification plan for Park Avenue' },
                  { version: 'v1.1', date: '2024-01-14 16:45', author: 'Mike Johnson', changes: 'Initial lane separator placement' },
                  { version: 'v1.0', date: '2024-01-14 09:00', author: 'Sarah Wilson', changes: 'Created initial planning session' }
                ].map((version) => (
                  <div key={version.version} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{version.version}</Badge>
                        <span className="font-medium">{version.author}</span>
                        <span className="text-sm text-slate-500">{version.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{version.changes}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}