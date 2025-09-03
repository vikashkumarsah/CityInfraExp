const PlanningSession = require('../models/PlanningSession');
const PlanningAnnotation = require('../models/PlanningAnnotation');

class PlanningSessionService {
  // Create a new planning session
  async createSession(sessionData, userId) {
    try {
      console.log('PlanningSessionService: Creating new session for user:', userId);
      
      const session = new PlanningSession({
        ...sessionData,
        createdBy: userId
      });

      const savedSession = await session.save();
      console.log('PlanningSessionService: Session created successfully:', savedSession._id);
      
      return await this.getSessionById(savedSession._id, userId);
    } catch (error) {
      console.error('PlanningSessionService: Error creating session:', error);
      throw error;
    }
  }

  // Get all planning sessions for a user
  async getSessions(userId, filters = {}) {
    try {
      console.log('PlanningSessionService: Fetching sessions for user:', userId);
      
      const query = {
        $or: [
          { createdBy: userId },
          { 'collaborators.userId': userId }
        ]
      };

      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }

      const sessions = await PlanningSession.find(query)
        .populate('createdBy', 'name email')
        .populate('collaborators.userId', 'name email')
        .sort({ 'metadata.lastActivity': -1 })
        .limit(filters.limit || 50)
        .skip(filters.skip || 0);

      console.log('PlanningSessionService: Found', sessions.length, 'sessions');
      return sessions;
    } catch (error) {
      console.error('PlanningSessionService: Error fetching sessions:', error);
      throw error;
    }
  }

  // Get a specific planning session by ID
  async getSessionById(sessionId, userId) {
    try {
      console.log('PlanningSessionService: Fetching session:', sessionId, 'for user:', userId);
      
      const session = await PlanningSession.findById(sessionId)
        .populate('createdBy', 'name email')
        .populate('collaborators.userId', 'name email');

      if (!session) {
        throw new Error('Planning session not found');
      }

      // Check access permissions
      if (!session.hasAccess(userId)) {
        throw new Error('Access denied to this planning session');
      }

      console.log('PlanningSessionService: Session found and access granted');
      return session;
    } catch (error) {
      console.error('PlanningSessionService: Error fetching session by ID:', error);
      throw error;
    }
  }

  // Update a planning session
  async updateSession(sessionId, updateData, userId) {
    try {
      console.log('PlanningSessionService: Updating session:', sessionId);
      
      const session = await this.getSessionById(sessionId, userId);
      
      // Check if user has edit permissions
      const userRole = session.getUserRole(userId);
      if (!userRole || (userRole === 'viewer')) {
        throw new Error('Insufficient permissions to update this session');
      }

      Object.assign(session, updateData);
      const updatedSession = await session.save();
      
      console.log('PlanningSessionService: Session updated successfully');
      return updatedSession;
    } catch (error) {
      console.error('PlanningSessionService: Error updating session:', error);
      throw error;
    }
  }

  // Delete a planning session
  async deleteSession(sessionId, userId) {
    try {
      console.log('PlanningSessionService: Deleting session:', sessionId);
      
      const session = await this.getSessionById(sessionId, userId);
      
      // Only creator can delete the session
      if (session.createdBy._id.toString() !== userId.toString()) {
        throw new Error('Only the session creator can delete this session');
      }

      // Delete all annotations first
      await PlanningAnnotation.deleteMany({ sessionId });
      
      // Delete the session
      await PlanningSession.findByIdAndDelete(sessionId);
      
      console.log('PlanningSessionService: Session and annotations deleted successfully');
      return { message: 'Planning session deleted successfully' };
    } catch (error) {
      console.error('PlanningSessionService: Error deleting session:', error);
      throw error;
    }
  }

  // Create an annotation in a planning session
  async createAnnotation(sessionId, annotationData, userId) {
    try {
      console.log('PlanningSessionService: Creating annotation in session:', sessionId);
      
      // Verify session exists and user has access
      const session = await this.getSessionById(sessionId, userId);
      
      // Check if user has edit permissions
      const userRole = session.getUserRole(userId);
      if (!userRole || (userRole === 'viewer' && !session.settings.allowComments)) {
        throw new Error('Insufficient permissions to create annotations in this session');
      }

      const annotation = new PlanningAnnotation({
        ...annotationData,
        sessionId,
        createdBy: userId
      });

      const savedAnnotation = await annotation.save();
      
      // Update session metadata
      await PlanningSession.findByIdAndUpdate(sessionId, {
        $inc: { 'metadata.totalAnnotations': 1 },
        'metadata.lastActivity': new Date()
      });

      console.log('PlanningSessionService: Annotation created successfully:', savedAnnotation._id);
      
      return await PlanningAnnotation.findById(savedAnnotation._id)
        .populate('createdBy', 'name email');
    } catch (error) {
      console.error('PlanningSessionService: Error creating annotation:', error);
      throw error;
    }
  }

  // Get annotations for a planning session
  async getAnnotations(sessionId, userId) {
    try {
      console.log('PlanningSessionService: Fetching annotations for session:', sessionId);
      
      // Verify session exists and user has access
      await this.getSessionById(sessionId, userId);

      const annotations = await PlanningAnnotation.find({ 
        sessionId,
        'metadata.isVisible': true 
      })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      console.log('PlanningSessionService: Found', annotations.length, 'annotations');
      return annotations;
    } catch (error) {
      console.error('PlanningSessionService: Error fetching annotations:', error);
      throw error;
    }
  }

  // Delete an annotation
  async deleteAnnotation(sessionId, annotationId, userId) {
    try {
      console.log('PlanningSessionService: Deleting annotation:', annotationId, 'from session:', sessionId);
      
      // Verify session exists and user has access
      const session = await this.getSessionById(sessionId, userId);

      const annotation = await PlanningAnnotation.findById(annotationId);
      if (!annotation) {
        throw new Error('Annotation not found');
      }

      if (annotation.sessionId.toString() !== sessionId) {
        throw new Error('Annotation does not belong to this session');
      }

      // Check permissions - user can delete their own annotations or if they have admin/editor role
      const userRole = session.getUserRole(userId);
      const canDelete = annotation.createdBy.toString() === userId.toString() || 
                       userRole === 'admin' || userRole === 'editor';

      if (!canDelete) {
        throw new Error('Insufficient permissions to delete this annotation');
      }

      await PlanningAnnotation.findByIdAndDelete(annotationId);
      
      // Update session metadata
      await PlanningSession.findByIdAndUpdate(sessionId, {
        $inc: { 'metadata.totalAnnotations': -1 },
        'metadata.lastActivity': new Date()
      });

      console.log('PlanningSessionService: Annotation deleted successfully');
      return { message: 'Annotation deleted successfully' };
    } catch (error) {
      console.error('PlanningSessionService: Error deleting annotation:', error);
      throw error;
    }
  }

  // Get session statistics
  async getSessionStatistics(userId) {
    try {
      console.log('PlanningSessionService: Fetching statistics for user:', userId);
      
      const totalSessions = await PlanningSession.countDocuments({
        $or: [
          { createdBy: userId },
          { 'collaborators.userId': userId }
        ]
      });

      const activeSessions = await PlanningSession.countDocuments({
        $or: [
          { createdBy: userId },
          { 'collaborators.userId': userId }
        ],
        status: 'active'
      });

      const totalAnnotations = await PlanningAnnotation.countDocuments({
        createdBy: userId
      });

      console.log('PlanningSessionService: Statistics calculated successfully');
      return {
        totalSessions,
        activeSessions,
        totalAnnotations,
        completedSessions: totalSessions - activeSessions
      };
    } catch (error) {
      console.error('PlanningSessionService: Error fetching statistics:', error);
      throw error;
    }
  }
}

module.exports = new PlanningSessionService();