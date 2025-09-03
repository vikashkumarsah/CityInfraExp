import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  MapPin,
  AlertTriangle
} from "lucide-react"
import { getAnalyticsData } from "@/api/infrastructure"
import { useToast } from "@/hooks/useToast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts'

const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6']

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState('week')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      console.log('Analytics: Fetching analytics data for time range:', timeRange)
      const data = await getAnalyticsData(timeRange)
      setAnalyticsData(data)
      console.log('Analytics: Data loaded successfully')
    } catch (error: any) {
      console.error('Analytics: Error fetching analytics:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics & Reporting</h1>
          <p className="text-slate-600 dark:text-slate-400">Comprehensive infrastructure data analysis and insights</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.severityDistribution?.reduce((sum: number, item: any) => sum + item.count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {analyticsData?.severityDistribution?.find((item: any) => item.severity === 'High')?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">78%</div>
            <p className="text-xs text-muted-foreground">
              +5% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.4h</div>
            <p className="text-xs text-muted-foreground">
              -15 min from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <TabsTrigger value="trends">Issue Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Issues Over Time</CardTitle>
              <CardDescription>
                Track infrastructure issues reported over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData?.issuesTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Issues by Severity</CardTitle>
                <CardDescription>Distribution of issues by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip />
                      <RechartsPieChart data={analyticsData?.severityDistribution || []}>
                        {analyticsData?.severityDistribution?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  {analyticsData?.severityDistribution?.map((item: any, index: number) => (
                    <div key={item.severity} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm">{item.severity}: {item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Issues by Type</CardTitle>
                <CardDescription>Breakdown of different issue types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.typeDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Task completion rates by team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Smith', completed: 24, total: 28, rate: 86 },
                    { name: 'Jane Doe', completed: 19, total: 22, rate: 86 },
                    { name: 'Mike Johnson', completed: 31, total: 35, rate: 89 },
                    { name: 'Sarah Wilson', completed: 16, total: 20, rate: 80 }
                  ].map((member) => (
                    <div key={member.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-slate-500">{member.completed}/{member.total} tasks</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                          style={{ width: `${member.rate}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm text-slate-500">{member.rate}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
                <CardDescription>Average response times by issue type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Potholes', time: '1.2h', color: 'bg-red-500' },
                    { type: 'Traffic Flow', time: '2.8h', color: 'bg-orange-500' },
                    { type: 'Road Markers', time: '4.1h', color: 'bg-yellow-500' },
                    { type: 'Garbage', time: '6.3h', color: 'bg-green-500' }
                  ].map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <Badge variant="outline">{item.time}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Predictive Insights</CardTitle>
              <CardDescription>AI-powered predictions for infrastructure maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">High Risk Areas</h4>
                  <div className="space-y-3">
                    {[
                      { location: 'Main St & 5th Ave', risk: 'High', probability: 85 },
                      { location: 'Park Avenue', risk: 'Medium', probability: 67 },
                      { location: 'Broadway', risk: 'Medium', probability: 54 }
                    ].map((area) => (
                      <div key={area.location} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{area.location}</span>
                          <Badge variant={area.risk === 'High' ? 'destructive' : 'secondary'}>
                            {area.risk}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-500">
                          {area.probability}% probability of issues in next 30 days
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Maintenance Recommendations</h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Pothole Prevention', priority: 'High', savings: '$12,500' },
                      { action: 'Road Marking Refresh', priority: 'Medium', savings: '$8,200' },
                      { action: 'Drainage Maintenance', priority: 'Low', savings: '$5,100' }
                    ].map((rec) => (
                      <div key={rec.action} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{rec.action}</span>
                          <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'secondary' : 'default'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-green-600">
                          Potential savings: {rec.savings}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Budget Optimization</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">$45,200</div>
                      <div className="text-sm text-blue-800 dark:text-blue-400">Recommended monthly budget</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">18%</div>
                      <div className="text-sm text-green-800 dark:text-green-400">Potential cost reduction</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">92%</div>
                      <div className="text-sm text-purple-800 dark:text-purple-400">Efficiency improvement</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}