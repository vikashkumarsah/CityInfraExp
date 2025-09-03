import api from './api';

// Description: Seed admin user account
// Endpoint: POST /api/seed/admin
// Request: {}
// Response: { success: boolean, message: string, data: { email: string, role: string } }
export const seedAdminUser = async () => {
  try {
    const response = await api.post('/api/seed/admin');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Seed regular user accounts
// Endpoint: POST /api/seed/users
// Request: {}
// Response: { success: boolean, message: string, data: Array<{ email: string, role: string }> }
export const seedRegularUsers = async () => {
  try {
    const response = await api.post('/api/seed/users');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Seed infrastructure data
// Endpoint: POST /api/seed/infrastructure
// Request: {}
// Response: { success: boolean, message: string, data: { roads: number, intersections: number, issues: number } }
export const seedInfrastructureData = async () => {
  try {
    const response = await api.post('/api/seed/infrastructure');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};