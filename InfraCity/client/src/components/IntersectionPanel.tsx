import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Navigation,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  Car
} from "lucide-react"
import { getIntersectionDetails } from "@/api/roadSegments"
import { useToast } from "@/hooks/useToast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface IntersectionPanelProps {
  intersectionId: string | null
  onClose: () => void
}

export function IntersectionPanel({ intersectionId, onClose }: IntersectionPanelProps) {
  const [intersectionData, setIntersectionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (intersectionId) {
      fetchIntersectionDetails()
    }
  }, [intersectionId])

  const fetchIntersectionDetails = async () => {
    if (!intersectionId) return
    
    setLoading(true)
    try {
      const data = await getIntersectionDetails(intersectionId)
      setIntersectionData((data as any).intersection)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load intersection details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!intersectionId) return null

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 shadow-2xl z-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Traffic Analysis</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : intersectionData ? (
          <Tabs defaultValue="volume" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="speed">Speed</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="volume" className="space-y-4">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                    {intersectionData.name}
                  </CardTitle>
                  <CardDescription>
                    Real-time traffic volume monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={intersectionData.trafficVolume}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="volume"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Current Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {intersectionData.trafficVolume[intersectionData.trafficVolume.length - 1]?.volume || 0}
                      </div>
                      <div className="text-sm text-blue-800 dark:text-blue-400">Current Volume</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.max(...intersectionData.trafficVolume.map((d: any) => d.volume))}
                      </div>
                      <div className="text-sm text-green-800 dark:text-green-400">Peak Volume</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speed" className="space-y-4">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="w-5 h-5 mr-2 text-purple-600" />
                    Average Speed by Direction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={intersectionData.avgSpeed}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="direction" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="speed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Speed Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {intersectionData.avgSpeed.map((direction: any) => (
                      <div key={direction.direction} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center">
                          <Navigation className="w-4 h-4 mr-2 text-slate-500" />
                          <span className="font-medium">{direction.direction}</span>
                        </div>
                        <Badge variant={direction.speed > 25 ? 'default' : direction.speed > 20 ? 'secondary' : 'destructive'}>
                          {direction.speed} mph
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Peak Hour Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={intersectionData.peakHours}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="volume" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" />
                    Pedestrian Crossings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={intersectionData.pedestrianData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="crossings"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-indigo-800 dark:text-indigo-400">Peak Crossing Time</span>
                    </div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                      Highest pedestrian activity occurs at 8:00 AM with 180 crossings per hour.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Navigation className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No intersection data available</p>
          </div>
        )}
      </div>
    </div>
  )
}