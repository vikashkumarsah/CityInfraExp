import { useState, useEffect } from 'react'
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
  Trash2,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  getDashboardSummary,
  downloadReport,
  shareReport
} from "@/api/reports"

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>(new Date())
  const [reportType, setReportType] = useState('comprehensive')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['issues', 'performance', 'budget'])
  const [reports, setReports] = useState<any[]>([])
  const [dashboardSummary, setDashboardSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
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

  useEffect(() => {
    fetchReports()
    fetchDashboardSummary()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      console.log('Reports: Fetching reports')
      const response = await getReports()
      setReports(response.data.data.reports)
      console.log('Reports: Loaded', response.data.data.reports.length, 'reports')
    } catch (error: any) {
      console.error('Reports: Error fetching reports:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardSummary = async () => {
    try {
      console.log('Reports: Fetching dashboard summary')
      const response = await getDashboardSummary()
      setDashboardSummary(response.data.data)
      console.log('Reports: Dashboard summary loaded')
    } catch (error: any) {
      console.error('Reports: Error fetching dashboard summary:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleGenerateReport = async () => {
    try {
      setGenerating(true)
      console.log('Reports: Generating report with config:', {
        type: reportType,
        period: selectedPeriod,
        metrics: selectedMetrics
      })

      const reportData = {
        type: reportType,
        metrics: selectedMetrics,
        period: {
          preset: 'custom',
          startDate: selectedPeriod ? new Date(selectedPeriod.getTime() - 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: selectedPeriod || new Date()
        },
        format: 'pdf'
      }

      const response = await createReport(reportData)
      
      toast({
        title: "Success",
        description: "Report generation started. You'll be notified when it's ready.",
      })

      // Refresh reports list
      await fetchReports()
      await fetchDashboardSummary()
      
      console.log('Reports: Report generation started:', response.data.data.reportId)
    } catch (error: any) {
      console.error('Reports: Error generating report:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    try {
      console.log('Reports: Downloading report:', reportId)
      await downloadReport(reportId)
      
      toast({
        title: "Success",
        description: "Report download started",
      })
    } catch (error: any) {
      console.error('Reports: Error downloading report:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleShareReport = async (reportId: string) => {
    try {
      console.log('Reports: Sharing report:', reportId)
      const response = await shareReport(reportId, { isPublic: true })
      
      const shareLink = `${window.location.origin}/reports/shared/${reportId}`
      navigator.clipboard.writeText(shareLink)
      
      toast({
        title: "Success",
        description: "Share link copied to clipboard",
      })
    } catch (error: any) {
      console.error('Reports: Error sharing report:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      console.log('Reports: Deleting report:', reportId)
      await deleteReport(reportId)
      
      toast({
        title: "Success",
        description: "Report deleted successfully",
      })

      // Refresh reports list
      await fetchReports()
      await fetchDashboardSummary()
    } catch (error: any) {
      console.error('Reports: Error deleting report:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      console.log('Reports: Updating report status:', reportId, 'to', status)
      await updateReportStatus(reportId, status)
      
      toast({
        title: "Success",
        description: "Report status updated",
      })

      // Refresh reports list
      await fetchReports()
    } catch (error: any) {
      console.error('Reports: Error updating report status:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
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
          disabled={generating}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          {generating ? 'Generating...' : 'Generate Report'}
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

              {dashboardSummary && (
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Reports</span>
                        <span className="font-medium">{dashboardSummary.totalReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Completed Reports</span>
                        <span className="font-medium text-green-600">{dashboardSummary.completedReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Published Reports</span>
                        <span className="font-medium">{dashboardSummary.publishedReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Downloads</span>
                        <span className="font-medium text-blue-600">{dashboardSummary.totalDownloads}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No reports generated yet</p>
                      <Button className="mt-4" variant="outline" onClick={handleGenerateReport}>
                        Generate Your First Report
                      </Button>
                    </div>
                  ) : (
                    reports.map((report) => (
                      <div key={report._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                              <span className="capitalize">{report.type}</span>
                              <span>•</span>
                              <span>Generated {format(new Date(report.createdAt), 'MMM dd, yyyy')}</span>
                              <span>•</span>
                              <span>By {report.createdBy?.name || 'System'}</span>
                              <span>•</span>
                              <span>{report.metadata?.downloadCount || 0} downloads</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={report.status === 'completed' || report.status === 'published' ? 'default' : 
                                        report.status === 'generating' ? 'secondary' : 'destructive'}>
                            {report.status === 'generating' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                            {report.status}
                          </Badge>
                          {report.status === 'completed' || report.status === 'published' ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadReport(report._id)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleShareReport(report._id)}
                              >
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                            </>
                          ) : null}
                          {report.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(report._id, 'published')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Publish
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReport(report._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
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
                          <div className="text-2xl font-bold text-green-600">
                            {dashboardSummary?.completedReports || 189}
                          </div>
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
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled reports configured</p>
                <Button className="mt-4" variant="outline">
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}