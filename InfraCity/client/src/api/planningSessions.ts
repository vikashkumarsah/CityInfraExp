import api from './api';

// Description: Create a new planning session
// Endpoint: POST /api/planning-sessions
// Request: { title: string, description?: string, collaborators?: Array<string>, status?: string }
// Response: { success: boolean, data: PlanningSession, message: string }
export const createPlanningSession = async (sessionData: {
  title: string;
  description?: string;
  collaborators?: Array<string>;
  status?: string;
}) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: sessionData.title,
          description: sessionData.description || '',
          collaborators: sessionData.collaborators || [],
          status: sessionData.status || 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        message: 'Planning session created successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/planning-sessions', sessionData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get all planning sessions
// Endpoint: GET /api/planning-sessions
// Request: { status?: string, collaborator?: string, page?: number, limit?: number }
// Response: { success: boolean, data: { sessions: Array<PlanningSession>, pagination: object }, message: string }
export const getPlanningSessions = async (filters?: {
  status?: string;
  collaborator?: string;
  page?: number;
  limit?: number;
}) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          sessions: [
            {
              _id: '507f1f77bcf86cd799439011',
              title: 'Downtown Traffic Improvement',
              description: 'Planning session for improving traffic flow in downtown area',
              collaborators: ['user1@example.com', 'user2@example.com'],
              status: 'active',
              createdAt: '2024-01-15T10:30:00Z',
              updatedAt: '2024-01-15T14:20:00Z'
            },
            {
              _id: '507f1f77bcf86cd799439012',
              title: 'Park Avenue Beautification',
              description: 'Planning session for beautification project on Park Avenue',
              collaborators: ['user3@example.com'],
              status: 'draft',
              createdAt: '2024-01-14T09:15:00Z',
              updatedAt: '2024-01-14T16:45:00Z'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 2,
            hasNext: false,
            hasPrev: false
          }
        },
        message: 'Planning sessions retrieved successfully'
      });
    }, 600);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const params = new URLSearchParams();
  //   if (filters) {
  //     Object.entries(filters).forEach(([key, value]) => {
  //       if (value !== undefined && value !== null) {
  //         params.append(key, value.toString());
  //       }
  //     });
  //   }
  //   return await api.get(`/api/planning-sessions?${params.toString()}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get specific planning session by ID
// Endpoint: GET /api/planning-sessions/:sessionId
// Request: { sessionId: string }
// Response: { success: boolean, data: PlanningSession, message: string }
export const getPlanningSessionById = async (sessionId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          _id: sessionId,
          title: 'Downtown Traffic Improvement',
          description: 'Planning session for improving traffic flow in downtown area',
          collaborators: ['user1@example.com', 'user2@example.com'],
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z'
        },
        message: 'Planning session retrieved successfully'
      });
    }, 400);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/planning-sessions/${sessionId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update planning session
// Endpoint: PUT /api/planning-sessions/:sessionId
// Request: { sessionId: string, updateData: Partial<PlanningSession> }
// Response: { success: boolean, data: PlanningSession, message: string }
export const updatePlanningSession = async (sessionId: string, updateData: any) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          _id: sessionId,
          ...updateData,
          updatedAt: new Date().toISOString()
        },
        message: 'Planning session updated successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/planning-sessions/${sessionId}`, updateData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Delete planning session
// Endpoint: DELETE /api/planning-sessions/:sessionId
// Request: { sessionId: string }
// Response: { success: boolean, message: string }
export const deletePlanningSession = async (sessionId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Planning session deleted successfully'
      });
    }, 400);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/planning-sessions/${sessionId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Create annotation in planning session
// Endpoint: POST /api/planning-sessions/:sessionId/annotations
// Request: { sessionId: string, type: string, content: string, position: object, style?: object }
// Response: { success: boolean, data: Annotation, message: string }
export const createAnnotation = async (sessionId: string, annotationData: {
  type: string;
  content: string;
  position: object;
  style?: object;
}) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439021',
          sessionId: sessionId,
          type: annotationData.type,
          content: annotationData.content,
          position: annotationData.position,
          style: annotationData.style || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        message: 'Annotation created successfully'
      });
    }, 400);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post(`/api/planning-sessions/${sessionId}/annotations`, annotationData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get annotations for planning session
// Endpoint: GET /api/planning-sessions/:sessionId/annotations
// Request: { sessionId: string, type?: string }
// Response: { success: boolean, data: Array<Annotation>, message: string }
export const getAnnotations = async (sessionId: string, filters?: { type?: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            _id: '507f1f77bcf86cd799439021',
            sessionId: sessionId,
            type: 'marker',
            content: 'Proposed zebra crossing',
            position: { lat: 40.7128, lng: -74.0060 },
            style: { color: 'red', icon: 'zebra-crossing' },
            createdAt: '2024-01-15T11:30:00Z',
            updatedAt: '2024-01-15T11:30:00Z'
          },
          {
            _id: '507f1f77bcf86cd799439022',
            sessionId: sessionId,
            type: 'note',
            content: 'High traffic area during rush hour',
            position: { lat: 40.7130, lng: -74.0065 },
            style: { color: 'yellow' },
            createdAt: '2024-01-15T12:00:00Z',
            updatedAt: '2024-01-15T12:00:00Z'
          }
        ],
        message: 'Annotations retrieved successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const params = new URLSearchParams();
  //   if (filters?.type) params.append('type', filters.type);
  //   const queryString = params.toString();
  //   const url = queryString ? `/api/planning-sessions/${sessionId}/annotations?${queryString}` : `/api/planning-sessions/${sessionId}/annotations`;
  //   return await api.get(url);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Delete annotation
// Endpoint: DELETE /api/planning-sessions/:sessionId/annotations/:annotationId
// Request: { sessionId: string, annotationId: string }
// Response: { success: boolean, message: string }
export const deleteAnnotation = async (sessionId: string, annotationId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Annotation deleted successfully'
      });
    }, 400);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/planning-sessions/${sessionId}/annotations/${annotationId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};