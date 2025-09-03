import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  AlertTriangle
} from "lucide-react"

interface DataVisualizationProps {
  data?: any
}

export function DataVisualization({ data }: DataVisualizationProps) {
  // Mock data for visualizations
  const issuesTrendData = [
    { date: 'Jan 1', issues: 45, resolved: 38 },
    { date: 'Jan 2', issues: 52, resolved: 41 },
    { date: 'Jan 3', issues: 38, resolved: 45 },
    { date: 'Jan 4', issues: 61, resolved: 52 },
    { date: 'Jan 5', issues: 49, resolved: 58 },
    { date: 'Jan 6', issues: 55, resolved: 49 },
    { date: 'Jan 7', issues: 43, resolved: 51 }
  ]

  const issueTypeData = [
    { name: 'Potholes', value: 98, color: '#ef4444' },
    { name: 'Garbage', value: 67, color: '#f59e0b' },
    { name: 'Road Markers', value: 45, color: '#10b981' },
    { name: 'Traffic Flow', value: 37, color: '#3b82f6' }
  ]

  const performanceData = [
    { team: 'Team A', completed: 24, pending: 6, efficiency: 80 },
    { team: 'Team B', completed: 19, pending: 8, efficiency: 70 },
    { team: 'Team C', completed: 31, pending: 4, efficiency: 89 },
    { team: 'Team D', completed: 16, pending: 12, efficiency: 57 }
  ]

  const responseTimeData = [
    { hour: '00:00', avgTime: 45 },
    { hour: '04:00', avgTime: 32 },
    { hour: '08:00', avgTime: 78 },
    { hour: '12:00', avgTime: 65 },
    { hour: '16:00', avgTime: 89 },
    { hour: '20:00', avgTime: 54 }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Total Issues</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">247</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+12% from last week</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-400">Resolution Rate</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">78%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+5% improvement</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-400">High Priority</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">42</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-xs text-red-600">-8% from yesterday</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Avg Response</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">2.4h</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">-15min faster</span>
                </div>
              </div>
              <PieChartIcon className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Issues vs Resolutions</CardTitle>
                <CardDescription>Daily comparison of reported issues and resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={issuesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="issues" fill="#ef4444" name="Issues" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Response Time Trend</CardTitle>
                <CardDescription>Average response time throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="avgTime" 
                        stroke="#3b82f6" 
                        fill="url(#colorGradient)" 
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Issue Type Distribution</CardTitle>
                <CardDescription>Breakdown of different issue types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={issueTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {issueTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Issue Statistics</CardTitle>
                <CardDescription>Detailed breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {issueTypeData.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline">{item.value}</Badge>
                    </div>
                    <Progress 
                      value={(item.value / Math.max(...issueTypeData.map(d => d.value))) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Task completion and efficiency metrics by team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-400">12</div>
                <div className="text-sm text-green-600 dark:text-green-500">Active Teams</div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">8</div>
                <div className="text-sm text-blue-600 dark:text-blue-500">Issues Resolved (Today)</div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">3</div>
                <div className="text-sm text-orange-600 dark:text-orange-500">Emergency Alerts</div>
                <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2 mt-2">
                  <div className="bg-orange-600 h-2 rounded-full animate-pulse" style={{ width: '25%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
              <CardDescription>Real-time updates from the field</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[
                  { time: '2 min ago', action: 'Pothole reported', location: 'Main St & 5th Ave', status: 'new' },
                  { time: '5 min ago', action: 'Task completed', location: 'Park Avenue', status: 'completed' },
                  { time: '8 min ago', action: 'Team dispatched', location: 'Downtown', status: 'in-progress' },
                  { time: '12 min ago', action: 'Issue resolved', location: 'Highway 101', status: 'completed' },
                  { time: '15 min ago', action: 'New task created', location: 'Oak Street', status: 'new' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-500' :
                        activity.status === 'in-progress' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-slate-500">{activity.location}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{activity.time}</span>
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