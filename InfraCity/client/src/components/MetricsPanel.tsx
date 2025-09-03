import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Car,
  Palette
} from "lucide-react"

interface MetricsPanelProps {
  overview: any
}

export function MetricsPanel({ overview }: MetricsPanelProps) {
  if (!overview) return null

  const getTrafficColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'high': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{overview.totalIssues}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Road Health Index</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{overview.roadHealthIndex}%</div>
          <Progress value={overview.roadHealthIndex} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            +5% improvement this quarter
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Beautification Progress</CardTitle>
          <Palette className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{overview.beautificationProgress}%</div>
          <Progress value={overview.beautificationProgress} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            On track for Q2 goals
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Traffic Congestion</CardTitle>
          <Car className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getTrafficColor(overview.trafficCongestion)}`}></div>
            <span className="text-2xl font-bold">{overview.trafficCongestion}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Peak hours: 8-10 AM, 5-7 PM
          </p>
        </CardContent>
      </Card>
    </div>
  )
}