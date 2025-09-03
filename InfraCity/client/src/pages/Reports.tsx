import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Download,
  Share,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  Plus,
  Edit,
  Trash2
} from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>(new Date())
  const [reportType, setReportType] = useState('comprehensive')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['issues', 'performance', 'budget'])
  const { toast } = useToast()

  const reportTemplates = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Infrastructure Report',
      description: 'Complete overview of all infrastructure metrics and activities',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'performance',
      name: 'Performance Analysis Report',
      description: 'Team performance and task completion analysis',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      id: 'budget',
      name: 'Budget & Cost Analysis',
      description: 'Financial overview and cost optimization insights',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      id: 'public',
      name: 'Public Progress Report',
      description: 'Citizen-friendly report on infrastructure improvements',
      icon: Users,
      color: 'bg-orange-500'
    }
  ]

  const availableMetrics = [
    { id: 'issues', label: 'Issue Statistics', description: 'Total issues, resolution rates, severity breakdown' },
    { id: 'performance', label: 'Team Performance', description: 'Task completion rates, response times, efficiency metrics' },
    { id: 'budget', label: 'Budget Analysis', description: 'Spending patterns, cost per issue, budget utilization' },
    { id: 'traffic', label: 'Traffic Analysis', description: 'Congestion levels, flow patterns, intersection performance' },
    { id: 'maintenance', label: 'Maintenance Schedule', description: 'Completed tasks, upcoming maintenance, equipment status' },
    { id: 'citizen', label: 'Citizen Feedback', description: 'Public reports, satisfaction scores, complaint resolution' }
  ]

  const recentReports = [
    {
      id: '1',
      title: 'Q4 2023 Infrastructure Summary',
      type: 'Comprehensive',
      generated: '2024-01-15',
      author: 'System',
      downloads: 45,
      status: 'Published'
    },
    {
      id: '2',
      title: 'December Performance Review',
      type: 'Performance',
      generated: '2024-01-01',
      author: 'John Smith',
      downloads: 23,
      status: 'Draft'
    },
    {
      id: '3',
      title: 'Year-End Budget Analysis',
      type: 'Budget',
      generated: '2023-12-31',
      author: 'Jane Doe',
      downloads: 67,
      status: 'Published'
    },
    {
      id: '4',
      title: 'Public Progress Update - December',
      type: 'Public',
      generated: '2023-12-30',
      author: 'Mike Johnson',
      downloads: 156,
      status: 'Published'
    }
  ]

  const scheduledReports = [
    {
      id: '1',
      name: 'Weekly Performance Summary',
      frequency: 'Weekly',
      nextRun: '2024-01-22',
      recipients: ['admin@city.gov', 'manager@city.gov'],
      enabled: true
    },
    {
      id: '2',
      name: 'Monthly Infrastructure Report',
      frequency: 'Monthly',
      nextRun: '2024-02-01',
      recipients: ['mayor@city.gov', 'council@city.gov'],
      enabled: true
    },
    {
      id: '3',
      name: 'Quarterly Budget Analysis',
      frequency: 'Quarterly',
      nextRun: '2024-04-01',
      recipients: ['finance@city.gov'],
      enabled: false
    }
  ]

  const handleGenerateReport = () => {
    console.log('Reports: Generating report with config:', {
      type: reportType,
      period: selectedPeriod,
      metrics: selectedMetrics
    })

    toast({
      title: "Success",
      description: "Report generation started. You'll be notified when it's ready.",
    })
  }

  const handleDownloadReport = (reportId: string) => {
    console.log('Reports: Downloading report:', reportId)
    toast({
      title: "Success",
      description: "Report download started",
    })
  }

  const handleShareReport = (reportId: string) => {
    console.log('Reports: Sharing report:', reportId)
    const shareLink = `${window.location.origin}/reports/shared/${reportId}`
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Success",
      description: "Share link copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Generate comprehensive reports and share insights with stakeholders</p>
        </div>
        <Button
          onClick={handleGenerateReport}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="generator" className="space-y-4">
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="library">Report Library</TabsTrigger>
          <TabsTrigger value="public">Public Dashboard</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                  <CardDescription>Customize your report settings and content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Report Template</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {reportTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            reportType === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                          onClick={() => setReportType(template.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center`}>
                              <template.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Reporting Period</Label>
                    <div className="flex space-x-4 mt-3">
                      <Select defaultValue="custom">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Last 7 Days</SelectItem>
                          <SelectItem value="month">Last 30 Days</SelectItem>
                          <SelectItem value="quarter">Last Quarter</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-48">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedPeriod ? format(selectedPeriod, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedPeriod}
                            onSelect={setSelectedPeriod}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Include Metrics</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {availableMetrics.map((metric) => (
                        <div key={metric.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={metric.id}
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedMetrics([...selectedMetrics, metric.id])
                              } else {
                                setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id))
                              }
                            }}
                          />
                          <div className="flex-1">
                            <Label htmlFor={metric.id} className="font-medium cursor-pointer">
                              {metric.label}
                            </Label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {metric.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Export Options</Label>
                    <div className="flex space-x-4 mt-3">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        PDF Report
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Excel Data
                      </Button>
                      <Button variant="outline">
                        <Share className="w-4 h-4 mr-2" />
                        Share Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>Preview of selected report configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <h4 className="font-medium">
                        {reportTemplates.find(t => t.id === reportType)?.name}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        Period: {selectedPeriod ? format(selectedPeriod, "PPP") : "Not selected"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Metrics: {selectedMetrics.length} selected
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Included Sections:</h5>
                      {selectedMetrics.map((metricId) => {
                        const metric = availableMetrics.find(m => m.id === metricId)
                        return (
                          <div key={metricId} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {metric?.label}
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-slate-500">
                        Estimated generation time: 2-3 minutes
                      </p>
                      <p className="text-sm text-slate-500">
                        Report will be available for 30 days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Issues</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Resolved This Month</span>
                      <span className="font-medium text-green-600">189</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Tasks</span>
                      <span className="font-medium">58</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Team Efficiency</span>
                      <span className="font-medium text-blue-600">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Report Library</CardTitle>
              <CardDescription>Access and manage previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>Generated {report.generated}</span>
                          <span>•</span>
                          <span>By {report.author}</span>
                          <span>•</span>
                          <span>{report.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.status === 'Published' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareReport(report.id)}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Public Dashboard Configuration</CardTitle>
              <CardDescription>Configure what information is visible to the public</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Visible Metrics</h4>
                  {[
                    { id: 'total-issues', label: 'Total Issues Resolved', enabled: true },
                    { id: 'response-time', label: 'Average Response Time', enabled: true },
                    { id: 'budget-spent', label: 'Budget Utilization', enabled: false },
                    { id: 'projects-completed', label: 'Projects Completed', enabled: true },
                    { id: 'citizen-satisfaction', label: 'Citizen Satisfaction Score', enabled: true },
                    { id: 'upcoming-projects', label: 'Upcoming Projects', enabled: true }
                  ].map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor={metric.id} className="cursor-pointer">
                        {metric.label}
                      </Label>
                      <Checkbox id={metric.id} defaultChecked={metric.enabled} />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Public Dashboard Preview</h4>
                  <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">City Infrastructure Progress</h3>
                        <p className="text-sm text-slate-500">Last updated: {format(new Date(), "PPP")}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">189</div>
                          <div className="text-sm">Issues Resolved</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">2.4h</div>
                          <div className="text-sm">Avg Response</div>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Automate report generation and distribution</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${schedule.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h4 className="font-medium">{schedule.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>{schedule.frequency}</span>
                          <span>•</span>
                          <span>Next run: {schedule.nextRun}</span>
                          <span>•</span>
                          <span>{schedule.recipients.length} recipients</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
                        {schedule.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
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