import { useState, useEffect } from 'react'
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
  MessageSquare,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/useToast"
import {
  createPlanningSession,
  getPlanningSessions,
  createAnnotation,
  getAnnotations,
  deleteAnnotation,
  updatePlanningSession
} from "@/api/planningSessions"

interface PlanningSession {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  collaborators: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    role: string;
    joinedAt: string;
  }>;
  metadata: {
    totalAnnotations: number;
    lastActivity: string;
    version: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface PlanningAnnotation {
  _id: string;
  sessionId: string;
  type: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  style: {
    color: string;
    size: string;
    icon: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export function Planning() {
  const [planningMode, setPlanningMode] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [sessions, setSessions] = useState<PlanningSession[]>([])
  const [currentSession, setCurrentSession] = useState<PlanningSession | null>(null)
  const [annotations, setAnnotations] = useState<PlanningAnnotation[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newSessionTitle, setNewSessionTitle] = useState('')
  const [newSessionDescription, setNewSessionDescription] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [pendingAnnotation, setPendingAnnotation] = useState<{ x: number; y: number } | null>(null)
  
  const { toast } = useToast()

  const planningTools = [
    { id: 'zebra', name: 'Zebra Crossing', icon: '🚶', color: 'bg-yellow-500' },
    { id: 'separator', name: 'Lane Separator', icon: '🚧', color: 'bg-orange-500' },
    { id: 'beautification', name: 'Beautification', icon: '🌳', color: 'bg-green-500' },
    { id: 'garbage', name: 'Garbage Point', icon: '🗑️', color: 'bg-blue-500' },
    { id: 'signal', name: 'Traffic Signal', icon: '🚦', color: 'bg-red-500' }
  ]

  // Load planning sessions on component mount
  useEffect(() => {
    loadPlanningSessions()
  }, [])

  // Load annotations when current session changes
  useEffect(() => {
    if (currentSession) {
      loadAnnotations(currentSession._id)
    }
  }, [currentSession])

  const loadPlanningSessions = async () => {
    try {
      setLoading(true)
      const response = await getPlanningSessions()
      setSessions(response.data.sessions)
      
      // Set the first session as current if available
      if (response.data.sessions.length > 0 && !currentSession) {
        setCurrentSession(response.data.sessions[0])
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAnnotations = async (sessionId: string) => {
    try {
      const response = await getAnnotations(sessionId)
      setAnnotations(response.data.annotations)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleCreateSession = async () => {
    if (!newSessionTitle.trim()) {
      toast({
        title: "Error",
        description: "Session title is required",
        variant: "destructive"
      })
      return
    }

    try {
      setCreating(true)
      const response = await createPlanningSession({
        title: newSessionTitle.trim(),
        description: newSessionDescription.trim(),
        settings: {
          allowComments: true,
          gridSize: 20
        }
      })

      setSessions(prev => [response.data, ...prev])
      setCurrentSession(response.data)
      setNewSessionTitle('')
      setNewSessionDescription('')
      setShowCreateDialog(false)

      toast({
        title: "Success",
        description: "Planning session created successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setCreating(false)
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!planningMode || !currentSession) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setPendingAnnotation({ x, y })

    if (selectedTool && selectedTool !== 'note') {
      // Create tool annotation directly
      const toolConfig = planningTools.find(tool => tool.id === selectedTool)
      if (toolConfig) {
        createToolAnnotation(selectedTool, toolConfig.name, x, y, toolConfig.icon)
      }
    } else {
      // Show note dialog for text annotations
      setShowNoteDialog(true)
    }
  }

  const createToolAnnotation = async (type: string, content: string, x: number, y: number, icon: string) => {
    if (!currentSession) return

    try {
      const response = await createAnnotation(currentSession._id, {
        type,
        content,
        position: { x, y },
        style: {
          icon,
          color: '#3B82F6',
          size: 'medium'
        }
      })

      setAnnotations(prev => [response.data, ...prev])
      setPendingAnnotation(null)

      toast({
        title: "Success",
        description: "Annotation added successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleCreateNote = async () => {
    if (!noteContent.trim() || !pendingAnnotation || !currentSession) return

    try {
      const response = await createAnnotation(currentSession._id, {
        type: 'note',
        content: noteContent.trim(),
        position: pendingAnnotation,
        style: {
          icon: '📝',
          color: '#F59E0B',
          size: 'medium'
        }
      })

      setAnnotations(prev => [response.data, ...prev])
      setNoteContent('')
      setShowNoteDialog(false)
      setPendingAnnotation(null)

      toast({
        title: "Success",
        description: "Note added successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDeleteAnnotation = async (annotationId: string) => {
    if (!currentSession) return

    try {
      await deleteAnnotation(currentSession._id, annotationId)
      setAnnotations(prev => prev.filter(ann => ann._id !== annotationId))

      toast({
        title: "Success",
        description: "Annotation deleted successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleSavePlan = async () => {
    if (!currentSession) return

    try {
      await updatePlanningSession(currentSession._id, {
        metadata: {
          ...currentSession.metadata,
          lastActivity: new Date().toISOString()
        }
      })

      toast({
        title: "Success",
        description: "Planning session saved successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleSharePlan = () => {
    if (!currentSession) return

    const shareLink = `${window.location.origin}/planning/${currentSession._id}`
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Success",
      description: "Share link copied to clipboard"
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading planning sessions...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Planning & Collaboration</h1>
          <p className="text-slate-600 dark:text-slate-400">Design and plan infrastructure improvements collaboratively</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle>Create Planning Session</DialogTitle>
                <DialogDescription>
                  Create a new collaborative planning session
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter session title..."
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter session description..."
                    value={newSessionDescription}
                    onChange={(e) => setNewSessionDescription(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreateSession} 
                  disabled={creating || !newSessionTitle.trim()}
                  className="w-full"
                >
                  {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant={planningMode ? "default" : "outline"}
            onClick={() => setPlanningMode(!planningMode)}
            className={planningMode ? "bg-gradient-to-r from-blue-500 to-indigo-600" : ""}
            disabled={!currentSession}
          >
            <Construction className="w-4 h-4 mr-2" />
            {planningMode ? 'Exit Planning' : 'Enter Planning Mode'}
          </Button>
          <Button variant="outline" onClick={handleSavePlan} disabled={!currentSession}>
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>
          <Button variant="outline" onClick={handleSharePlan} disabled={!currentSession}>
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
                {currentSession && (
                  <Badge variant="outline" className="ml-2">
                    {currentSession.title}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {currentSession 
                  ? `Interactive planning interface - ${annotations.length} annotations`
                  : "Select or create a planning session to start designing"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div 
                  className="h-96 bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden cursor-crosshair"
                  onClick={handleCanvasClick}
                >
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
                      key={annotation._id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: `${annotation.position.x}%`, top: `${annotation.position.y}%` }}
                    >
                      {annotation.type === 'note' ? (
                        <div className="bg-yellow-200 dark:bg-yellow-800 p-2 rounded-lg shadow-lg max-w-48 relative">
                          <p className="text-xs font-medium">{annotation.content}</p>
                          <p className="text-xs text-slate-500 mt-1">{annotation.createdBy.name}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAnnotation(annotation._id)
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                            {annotation.style.icon}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAnnotation(annotation._id)
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Center placeholder */}
                  {!currentSession && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <MapPin className="w-16 h-16 mx-auto text-slate-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                            No Planning Session Selected
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            Create or select a planning session to start designing
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSession && annotations.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Construction className="w-16 h-16 mx-auto text-slate-400" />
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
                  )}
                </div>

                {/* Planning Tools */}
                {planningMode && currentSession && (
                  <div className="absolute top-4 left-4 space-y-2">
                    {planningTools.map((tool) => (
                      <Button
                        key={tool.id}
                        size="sm"
                        variant={selectedTool === tool.id ? "default" : "secondary"}
                        className={`${tool.color} text-white hover:opacity-80`}
                        onClick={() => setSelectedTool(tool.id)}
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
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white/90 backdrop-blur-sm"
                    onClick={() => {
                      if (planningMode && currentSession) {
                        setSelectedTool('note')
                      }
                    }}
                    disabled={!planningMode || !currentSession}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Sessions List */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Planning Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No planning sessions yet. Create one to get started!
                </p>
              ) : (
                sessions.map((session) => (
                  <div 
                    key={session._id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentSession?._id === session._id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                    onClick={() => setCurrentSession(session)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{session.title}</p>
                        <p className="text-xs text-slate-500">{session.metadata.totalAnnotations} annotations</p>
                      </div>
                      <Badge variant={session.status === 'active' ? "default" : "secondary"}>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
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
                  disabled={!planningMode || !currentSession}
                  onClick={() => setSelectedTool(tool.id)}
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
              {annotations.slice(0, 5).map((annotation) => (
                <div key={annotation._id} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {annotation.type === 'note' ? 'Note' : planningTools.find(t => t.id === annotation.type)?.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(annotation.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {annotation.content}
                  </p>
                  <p className="text-xs text-slate-500">
                    by {annotation.createdBy.name}
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

      {/* Note Creation Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
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
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateNote} 
                disabled={!noteContent.trim()}
                className="flex-1"
              >
                Add Note
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNoteDialog(false)
                  setNoteContent('')
                  setPendingAnnotation(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                {currentSession && (
                  <div className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">v{currentSession.metadata.version}</Badge>
                          <span className="font-medium">{currentSession.createdBy.name}</span>
                          <span className="text-sm text-slate-500">
                            {new Date(currentSession.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Current version - {currentSession.metadata.totalAnnotations} annotations
                        </p>
                      </div>
                      <Badge variant="default">Current</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}