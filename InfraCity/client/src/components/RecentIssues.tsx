import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, AlertTriangle } from "lucide-react"

interface RecentIssuesProps {
  issues: any[]
}

export function RecentIssues({ issues }: RecentIssuesProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pothole': return '🕳️'
      case 'garbage': return '🗑️'
      case 'road marker': return '🚧'
      case 'traffic flow': return '🚦'
      default: return '⚠️'
    }
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-orange-600" />
          Recent Issues
        </CardTitle>
        <CardDescription>
          Latest infrastructure issues detected
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.map((issue) => (
          <div key={issue.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="text-lg">{getIssueIcon(issue.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {issue.type}
                </p>
                <Badge variant={getSeverityColor(issue.severity) as any} className="ml-2">
                  {issue.severity}
                </Badge>
              </div>
              <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate">{issue.location}</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {new Date(issue.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          View All Issues
        </Button>
      </CardContent>
    </Card>
  )
}