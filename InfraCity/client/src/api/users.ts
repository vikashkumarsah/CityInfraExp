import api from './api';

// Description: Get current user profile
// Endpoint: GET /api/users/me
// Request: {}
// Response: { success: boolean, data: { _id: string, email: string, firstName: string, lastName: string, role: string, department: string, phone: string, createdAt: string, lastLoginAt: string, isActive: boolean } }
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update current user profile
// Endpoint: PUT /api/users/me
// Request: { firstName: string, lastName: string, department?: string, phone?: string }
// Response: { success: boolean, data: { _id: string, email: string, firstName: string, lastName: string, role: string, department: string, phone: string }, message: string }
export const updateUserProfile = async (profileData: {
  firstName: string;
  lastName: string;
  department?: string;
  phone?: string;
}) => {
  try {
    const response = await api.put('/api/users/me', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};