import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import {
  X,
  MapPin,
  Calendar,
  Camera,
  Ruler,
  TrendingUp,
  Clock,
  Navigation,
  Maximize2,
  Info
} from "lucide-react"
import { getRoadSegmentDetails } from "@/api/roadSegments"
import { useToast } from "@/hooks/useToast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface RoadSegmentPanelProps {
  segmentId: string | null
  onClose: () => void
}

export function RoadSegmentPanel({ segmentId, onClose }: RoadSegmentPanelProps) {
  const [segmentData, setSegmentData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [laneWidth, setLaneWidth] = useState([12.5])
  const { toast } = useToast()

  useEffect(() => {
    if (segmentId) {
      fetchSegmentDetails()
    }
  }, [segmentId])

  const fetchSegmentDetails = async () => {
    if (!segmentId) return
    
    setLoading(true)
    try {
      const data = await getRoadSegmentDetails(segmentId)
      setSegmentData((data as any).segment)
      setLaneWidth([data.segment.lidarData.currentWidth])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load road segment details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pothole repair': return '🔧'
      case 'road marking': return '🎨'
      case 'inspection': return '🔍'
      case 'cleaning': return '🧹'
      default: return '📋'
    }
  }

  const getIssueTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pothole': return 'destructive'
      case 'road marking': return 'secondary'
      case 'surface crack': return 'default'
      default: return 'outline'
    }
  }

  const simulateTrafficImpact = (width: number) => {
    const baseFlow = 100
    const widthFactor = width / 12.5
    return Math.round(baseFlow * widthFactor * (0.8 + Math.random() * 0.4))
  }

  if (!segmentId) return null

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 shadow-2xl z-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Road Segment Analysis</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : segmentData ? (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    {segmentData.name}
                  </CardTitle>
                  <CardDescription>{segmentData.classification}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Condition Score</span>
                      <span className="text-lg font-bold text-green-600">{segmentData.conditionScore}%</span>
                    </div>
                    <Progress value={segmentData.conditionScore} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{segmentData.images.length}</div>
                      <div className="text-sm text-blue-800 dark:text-blue-400">IoT Images</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{segmentData.events.length}</div>
                      <div className="text-sm text-green-800 dark:text-green-400">Recent Events</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    Recent Events (30 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {segmentData.events.map((event: any) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="text-lg">{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.type}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{event.description}</p>
                          <div className="flex items-center mt-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                    IoT Camera Evidence
                  </CardTitle>
                  <CardDescription>Images captured by vehicle-mounted sensors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {segmentData.images.map((image: any) => (
                      <div
                        key={image.id}
                        className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.url}
                          alt={`IoT capture ${image.id}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <Badge variant={getIssueTypeColor(image.issueType) as any} className="text-xs">
                            {image.issueType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Ruler className="w-5 h-5 mr-2 text-orange-600" />
                    Road Width Analysis
                  </CardTitle>
                  <CardDescription>LiDAR-measured road configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">{segmentData.lidarData.currentWidth}m</div>
                      <div className="text-sm text-orange-800 dark:text-orange-400">Current Width</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{segmentData.lidarData.recommendedWidth}m</div>
                      <div className="text-sm text-green-800 dark:text-green-400">Recommended</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Simulate Width: {laneWidth[0]}m</span>
                      <Badge variant="outline">
                        Traffic Flow: {simulateTrafficImpact(laneWidth[0])}%
                      </Badge>
                    </div>
                    <Slider
                      value={laneWidth}
                      onValueChange={setLaneWidth}
                      max={20}
                      min={8}
                      step={0.5}
                      className="mb-4"
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Current Configuration</h4>
                    {segmentData.lidarData.laneConfig.map((lane: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                        <span className="text-sm">{lane.type}</span>
                        <span className="text-sm font-medium">{lane.width}m</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Recommended Configuration</h4>
                    {segmentData.lidarData.recommendedConfig.map((lane: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <span className="text-sm">{lane.type}</span>
                        <span className="text-sm font-medium">{lane.width}m</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Impact Prediction</span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Implementing recommended configuration could improve traffic flow by 15% and reduce congestion during peak hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No segment data available</p>
          </div>
        )}
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>IoT Camera Evidence</DialogTitle>
            <DialogDescription>
              Detailed view of captured infrastructure image
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={`IoT capture ${selectedImage.id}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={getIssueTypeColor(selectedImage.issueType) as any}>
                    {selectedImage.issueType} ({Math.round(selectedImage.confidence * 100)}% confidence)
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-sm">
                          {new Date(selectedImage.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Navigation className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-sm">Vehicle {selectedImage.vehicleId}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-sm">
                          {selectedImage.gpsCoords.lat.toFixed(4)}, {selectedImage.gpsCoords.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Info className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-sm font-medium">Detection Details</span>
                      </div>
                      <div className="text-sm">
                        <p>Issue Type: {selectedImage.issueType}</p>
                        <p>Confidence: {Math.round(selectedImage.confidence * 100)}%</p>
                        <p>Status: Detected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}