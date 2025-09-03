import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Calendar,
  Route
} from "lucide-react"
import { getTasks, createTask, updateTaskStatus, getOptimizedRoute } from "@/api/tasks"
import { useToast } from "@/hooks/useToast"
import { useForm } from "react-hook-form"

export function TaskManagement() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null)
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      console.log('TaskManagement: Fetching tasks')
      const data = await getTasks()
      setTasks((data as any).tasks)
      console.log('TaskManagement: Tasks loaded successfully')
    } catch (error: any) {
      console.error('TaskManagement: Error fetching tasks:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load tasks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (data: any) => {
    try {
      console.log('TaskManagement: Creating task:', data)
      await createTask(data)
      toast({
        title: "Success",
        description: "Task created successfully",
      })
      reset()
      fetchTasks()
    } catch (error: any) {
      console.error('TaskManagement: Error creating task:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      console.log('TaskManagement: Updating task status:', taskId, newStatus)
      await updateTaskStatus(taskId, newStatus)
      toast({
        title: "Success",
        description: "Task status updated successfully",
      })
      fetchTasks()
    } catch (error: any) {
      console.error('TaskManagement: Error updating task status:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleOptimizeRoute = async () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "Warning",
        description: "Please select tasks to optimize route",
        variant: "destructive",
      })
      return
    }

    try {
      console.log('TaskManagement: Optimizing route for tasks:', selectedTasks)
      const route = await getOptimizedRoute(selectedTasks)
      setOptimizedRoute(route)
      toast({
        title: "Success",
        description: "Route optimized successfully",
      })
    } catch (error: any) {
      console.error('TaskManagement: Error optimizing route:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to optimize route",
        variant: "destructive",
      })
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === 'pending'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in-progress': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Task Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage infrastructure maintenance tasks and crew assignments</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleOptimizeRoute}
            variant="outline"
            disabled={selectedTasks.length === 0}
          >
            <Route className="w-4 h-4 mr-2" />
            Optimize Route ({selectedTasks.length})
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a new maintenance task for your team
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter task title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    placeholder="Enter task description"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select {...register("priority", { required: "Priority is required" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="issueType">Issue Type</Label>
                    <Select {...register("issueType", { required: "Issue type is required" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pothole">Pothole</SelectItem>
                        <SelectItem value="Garbage">Garbage</SelectItem>
                        <SelectItem value="Road Marker">Road Marker</SelectItem>
                        <SelectItem value="Traffic Flow">Traffic Flow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      {...register("assignedTo", { required: "Assignee is required" })}
                      placeholder="Enter assignee name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      {...register("dueDate", { required: "Due date is required" })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register("location", { required: "Location is required" })}
                    placeholder="Enter location"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Task
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search tasks, locations, or assignees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {optimizedRoute && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800 dark:text-green-400">
              <Route className="w-5 h-5 mr-2" />
              Optimized Route
            </CardTitle>
            <CardDescription>
              Total Distance: {optimizedRoute.totalDistance} km | Estimated Time: {optimizedRoute.totalTime} minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {optimizedRoute.route.map((item: any, index: number) => {
                const task = tasks.find(t => t.id === item.taskId)
                return (
                  <div key={item.taskId} className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.order}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{task?.title}</p>
                      <p className="text-sm text-slate-500">{item.estimatedTime} min</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg capitalize flex items-center">
                    {getStatusIcon(status)}
                    <span className="ml-2">{status.replace('-', ' ')}</span>
                  </h3>
                  <Badge variant="outline">{statusTasks.length}</Badge>
                </div>
                <div className="space-y-3">
                  {statusTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                        selectedTasks.includes(task.id) ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedTasks(prev => 
                          prev.includes(task.id) 
                            ? prev.filter(id => id !== task.id)
                            : [...prev, task.id]
                        )
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          <Badge variant={getPriorityColor(task.priority) as any}>
                            {task.priority}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {task.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            {task.location}
                          </div>
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <User className="w-4 h-4 mr-2" />
                            {task.assignedTo}
                          </div>
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          {status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                const nextStatus = status === 'pending' ? 'in-progress' : 'completed'
                                handleStatusUpdate(task.id, nextStatus)
                              }}
                            >
                              {status === 'pending' ? 'Start' : 'Complete'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>Complete list of all maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={(e) => {
                          setSelectedTasks(prev => 
                            e.target.checked 
                              ? [...prev, task.id]
                              : prev.filter(id => id !== task.id)
                          )
                        }}
                        className="rounded"
                      />
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-slate-500">{task.location} • {task.assignedTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityColor(task.priority) as any}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
              <CardDescription>View tasks by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Calendar view would be implemented here</p>
                <p className="text-sm">Integration with a calendar library like react-big-calendar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}