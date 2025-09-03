import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Users,
  Car,
  Construction,
  Trash2,
  Navigation
} from "lucide-react"
import { getInfrastructureOverview, getRoadSegments, getTrafficData } from "@/api/infrastructure"
import { useToast } from "@/hooks/useToast"
import { MapView } from "@/components/MapView"
import { MetricsPanel } from "@/components/MetricsPanel"
import { RecentIssues } from "@/components/RecentIssues"

export function Dashboard() {
  const [overview, setOverview] = useState<any>(null)
  const [roads, setRoads] = useState<any>(null)
  const [traffic, setTraffic] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Dashboard: Fetching overview data')
        const [overviewData, roadsData, trafficData] = await Promise.all([
          getInfrastructureOverview(),
          getRoadSegments(),
          getTrafficData()
        ])
        
        setOverview(overviewData)
        setRoads(roadsData)
        setTraffic(trafficData)
        console.log('Dashboard: Data loaded successfully')
      } catch (error: any) {
        console.error('Dashboard: Error fetching data:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Infrastructure Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Real-time city infrastructure monitoring and management</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
          <MapPin className="w-4 h-4 mr-2" />
          View Full Map
        </Button>
      </div>

      <MetricsPanel overview={overview} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Interactive City Map
              </CardTitle>
              <CardDescription>
                Real-time infrastructure status and issue locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapView roads={roads} traffic={traffic} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <RecentIssues issues={overview?.recentIssues || []} />
          
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Construction className="w-4 h-4 mr-2" />
                Create Maintenance Task
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Navigation className="w-4 h-4 mr-2" />
                Optimize Routes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Assign Crew
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="roads" className="space-y-4">
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <TabsTrigger value="roads">Road Segments</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roads" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roads?.roads?.map((road: any) => (
              <Card key={road.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{road.name}</CardTitle>
                  <CardDescription>Last inspection: {road.lastInspection}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Condition</span>
                        <span>{road.condition}%</span>
                      </div>
                      <Progress value={road.condition} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Issues</span>
                      <Badge variant={road.issues > 5 ? "destructive" : road.issues > 2 ? "secondary" : "default"}>
                        {road.issues}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {traffic?.intersections?.map((intersection: any) => (
              <Card key={intersection.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    {intersection.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Volume</span>
                      <span className="font-medium">{intersection.volume} vehicles/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Speed</span>
                      <span className="font-medium">{intersection.avgSpeed} mph</span>
                    </div>
                    <Badge 
                      variant={
                        intersection.congestionLevel === 'Very High' ? 'destructive' :
                        intersection.congestionLevel === 'High' ? 'secondary' : 'default'
                      }
                      className="w-full justify-center"
                    >
                      {intersection.congestionLevel} Congestion
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>Scheduled maintenance activities for the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Construction className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled maintenance activities</p>
                <Button className="mt-4" variant="outline">
                  Schedule Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}