const Task = require('../models/Task');
const Issue = require('../models/Issue');

class TaskService {
  
  // Get all tasks with optional filtering
  async getAllTasks(filters = {}) {
    try {
      console.log('TaskService: Fetching all tasks with filters:', filters);
      
      const query = {};
      
      // Add filters if provided
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.priority) {
        query.priority = filters.priority;
      }
      if (filters.assignedTo) {
        query.assignedTo = { $regex: filters.assignedTo, $options: 'i' };
      }
      if (filters.issueType) {
        query.issueType = filters.issueType;
      }

      const tasks = await Task.find(query)
        .populate('createdBy', 'firstName lastName email')
        .populate('issueId', 'type severity location')
        .sort({ createdAt: -1 })
        .lean();

      console.log(`TaskService: Found ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      console.error('TaskService: Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  // Create a new task
  async createTask(taskData, createdBy) {
    try {
      console.log('TaskService: Creating new task:', taskData);
      
      const task = new Task({
        ...taskData,
        createdBy: createdBy,
      });

      const savedTask = await task.save();
      console.log('TaskService: Task created successfully with ID:', savedTask._id);
      
      return savedTask;
    } catch (error) {
      console.error('TaskService: Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  // Update task status
  async updateTaskStatus(taskId, status, userId) {
    try {
      console.log('TaskService: Updating task status:', taskId, status);
      
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }

      const updatedTask = await task.save();
      console.log('TaskService: Task status updated successfully');
      
      return updatedTask;
    } catch (error) {
      console.error('TaskService: Error updating task status:', error);
      throw new Error('Failed to update task status');
    }
  }

  // Convert issue to task
  async convertIssueToTask(issueId, taskData, createdBy) {
    try {
      console.log('TaskService: Converting issue to task:', issueId);
      
      const issue = await Issue.findById(issueId);
      if (!issue) {
        throw new Error('Issue not found');
      }

      // Create task from issue data
      const task = new Task({
        title: taskData.title || `Fix ${issue.type} at ${issue.location}`,
        description: taskData.description || issue.description || `Address ${issue.type} issue`,
        priority: taskData.priority || this.mapSeverityToPriority(issue.severity),
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        location: issue.location,
        coordinates: issue.coordinates,
        issueType: issue.type,
        issueId: issueId,
        createdBy: createdBy,
        estimatedDuration: taskData.estimatedDuration || this.getEstimatedDuration(issue.type),
      });

      const savedTask = await task.save();

      // Update issue status to indicate it has been converted
      issue.status = 'In Progress';
      issue.assignedTo = createdBy;
      await issue.save();

      console.log('TaskService: Issue converted to task successfully');
      return savedTask;
    } catch (error) {
      console.error('TaskService: Error converting issue to task:', error);
      throw new Error('Failed to convert issue to task');
    }
  }

  // Optimize route for tasks
  async optimizeRoute(taskIds) {
    try {
      console.log('TaskService: Optimizing route for tasks:', taskIds);
      
      const tasks = await Task.find({ _id: { $in: taskIds } })
        .select('_id title location coordinates priority estimatedDuration')
        .lean();

      if (tasks.length === 0) {
        throw new Error('No tasks found for route optimization');
      }

      // Simple route optimization algorithm
      // In production, you might want to use a more sophisticated algorithm
      const optimizedRoute = this.calculateOptimalRoute(tasks);

      console.log('TaskService: Route optimized successfully');
      return optimizedRoute;
    } catch (error) {
      console.error('TaskService: Error optimizing route:', error);
      throw new Error('Failed to optimize route');
    }
  }

  // Helper method to map severity to priority
  mapSeverityToPriority(severity) {
    const mapping = {
      'Low': 'low',
      'Medium': 'medium',
      'High': 'high',
      'Emergency': 'emergency'
    };
    return mapping[severity] || 'medium';
  }

  // Helper method to get estimated duration based on issue type
  getEstimatedDuration(issueType) {
    const durations = {
      'Pothole': 120, // 2 hours
      'Garbage': 30,  // 30 minutes
      'Road Marker': 90, // 1.5 hours
      'Traffic Flow': 180, // 3 hours
      'Beautification': 240 // 4 hours
    };
    return durations[issueType] || 60;
  }

  // Simple route optimization algorithm
  calculateOptimalRoute(tasks) {
    // Sort by priority first, then by estimated duration
    const priorityWeights = { 'emergency': 4, 'high': 3, 'medium': 2, 'low': 1 };
    
    const sortedTasks = tasks.sort((a, b) => {
      const priorityDiff = priorityWeights[b.priority] - priorityWeights[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.estimatedDuration - b.estimatedDuration;
    });

    let totalTime = 0;
    const route = sortedTasks.map((task, index) => {
      const estimatedTime = task.estimatedDuration + (index > 0 ? 15 : 0); // Add 15 min travel time between tasks
      totalTime += estimatedTime;
      
      return {
        taskId: task._id.toString(),
        order: index + 1,
        estimatedTime: estimatedTime,
        title: task.title,
        location: task.location,
        priority: task.priority
      };
    });

    // Calculate total distance (simplified - in production use a real routing service)
    const totalDistance = Math.round((tasks.length * 2.5 + Math.random() * 5) * 100) / 100;

    return {
      route,
      totalDistance,
      totalTime,
      optimizedAt: new Date().toISOString()
    };
  }
}

module.exports = new TaskService();