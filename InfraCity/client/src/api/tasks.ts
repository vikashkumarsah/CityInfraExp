import api from './api';

// Description: Get all tasks
// Endpoint: GET /api/tasks
// Request: {}
// Response: { tasks: Array<{ id: string, title: string, description: string, status: string, priority: string, assignedTo: string, dueDate: string, location: string, issueType: string }> }
export const getTasks = () => {
  console.log('Fetching tasks');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        tasks: [
          {
            id: '1',
            title: 'Fix pothole on Main Street',
            description: 'Large pothole causing traffic issues',
            status: 'pending',
            priority: 'high',
            assignedTo: 'John Smith',
            dueDate: '2024-01-20',
            location: 'Main St & 5th Ave',
            issueType: 'Pothole'
          },
          {
            id: '2',
            title: 'Clean garbage accumulation',
            description: 'Garbage pile near park entrance',
            status: 'in-progress',
            priority: 'medium',
            assignedTo: 'Jane Doe',
            dueDate: '2024-01-18',
            location: 'Park Avenue',
            issueType: 'Garbage'
          },
          {
            id: '3',
            title: 'Repaint road markers',
            description: 'Faded zebra crossing needs repainting',
            status: 'completed',
            priority: 'low',
            assignedTo: 'Mike Johnson',
            dueDate: '2024-01-15',
            location: 'Highway 101',
            issueType: 'Road Marker'
          },
          {
            id: '4',
            title: 'Install traffic signal',
            description: 'New traffic light installation required',
            status: 'pending',
            priority: 'high',
            assignedTo: 'Sarah Wilson',
            dueDate: '2024-01-25',
            location: 'Downtown Intersection',
            issueType: 'Traffic Flow'
          }
        ]
      });
    }, 600);
  });
};

// Description: Create a new task
// Endpoint: POST /api/tasks
// Request: { title: string, description: string, priority: string, assignedTo: string, dueDate: string, location: string, issueType: string }
// Response: { success: boolean, message: string, taskId: string }
export const createTask = (taskData: any) => {
  console.log('Creating new task:', taskData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Task created successfully',
        taskId: Math.random().toString(36).substr(2, 9)
      });
    }, 500);
  });
};

// Description: Update task status
// Endpoint: PUT /api/tasks/:id/status
// Request: { status: string }
// Response: { success: boolean, message: string }
export const updateTaskStatus = (taskId: string, status: string) => {
  console.log('Updating task status:', taskId, status);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Task status updated successfully'
      });
    }, 400);
  });
};

// Description: Get optimized route for tasks
// Endpoint: POST /api/tasks/optimize-route
// Request: { taskIds: Array<string> }
// Response: { route: Array<{ taskId: string, order: number, estimatedTime: number }>, totalDistance: number, totalTime: number }
export const getOptimizedRoute = (taskIds: string[]) => {
  console.log('Getting optimized route for tasks:', taskIds);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        route: taskIds.map((id, index) => ({
          taskId: id,
          order: index + 1,
          estimatedTime: Math.floor(Math.random() * 60) + 30
        })),
        totalDistance: 15.7,
        totalTime: 180
      });
    }, 800);
  });
};