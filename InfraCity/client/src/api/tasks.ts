import api from './api';

// Description: Get all tasks
// Endpoint: GET /api/tasks
// Request: {}
// Response: { success: boolean, data: { tasks: Array<{ _id: string, title: string, description: string, status: string, priority: string, assignedTo: string, dueDate: string, location: string, issueType: string, createdAt: string, updatedAt: string }> }, message: string }
export const getTasks = async () => {
  try {
    const response = await api.get('/api/tasks');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new task
// Endpoint: POST /api/tasks
// Request: { title: string, description: string, priority: string, assignedTo: string, dueDate: string, location: string, issueType: string, estimatedDuration?: number }
// Response: { success: boolean, data: { task: object }, message: string }
export const createTask = async (taskData: { 
  title: string; 
  description: string; 
  priority: string; 
  assignedTo: string; 
  dueDate: string; 
  location: string; 
  issueType: string;
  estimatedDuration?: number;
}) => {
  try {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update task status
// Endpoint: PUT /api/tasks/:id/status
// Request: { status: string }
// Response: { success: boolean, data: { task: object }, message: string }
export const updateTaskStatus = async (taskId: string, status: string) => {
  try {
    const response = await api.put(`/api/tasks/${taskId}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get optimized route for tasks
// Endpoint: POST /api/tasks/optimize-route
// Request: { taskIds: Array<string> }
// Response: { success: boolean, data: { route: Array<{ taskId: string, order: number, estimatedTime: number, title: string, location: string, priority: string }>, totalDistance: number, totalTime: number, optimizedAt: string }, message: string }
export const getOptimizedRoute = async (taskIds: string[]) => {
  try {
    const response = await api.post('/api/tasks/optimize-route', { taskIds });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Convert issue to task
// Endpoint: POST /api/issues/:issueId/convert-to-task
// Request: { title?: string, description?: string, priority?: string, assignedTo: string, dueDate: string, estimatedDuration?: number }
// Response: { success: boolean, data: { task: object }, message: string }
export const convertIssueToTask = async (issueId: string, taskData: {
  title?: string;
  description?: string;
  priority?: string;
  assignedTo: string;
  dueDate: string;
  estimatedDuration?: number;
}) => {
  try {
    const response = await api.post(`/api/issues/${issueId}/convert-to-task`, taskData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};