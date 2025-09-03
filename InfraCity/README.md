```markdown
# InfraCity

InfraCity is a comprehensive web application designed to help city planners, traffic engineers, and maintenance teams manage urban road infrastructure through real-time IoT data analysis. The system processes data from vehicle-mounted sensors to detect road conditions, traffic patterns, and infrastructure needs, presenting this information through an intuitive web interface.

## Overview

InfraCity utilizes a modern web application architecture with distinct frontend and backend components. The key technologies and tools used in this project include:

### Frontend
- **ReactJS**: Primary framework for building the interactive user interface.
- **Vite**: Development server for fast builds and hot module replacement.
- **shadcn-ui with Tailwind CSS**: Component library for consistent design and styling.
- **React Router**: Client-side routing for navigation.
- **Mapbox GL JS, D3.js, Chart.js**: Libraries for mapping and data visualization.
  
### Backend
- **Express.js**: Framework for building the REST API.
- **MongoDB with Mongoose**: Database for storing infrastructure data, user information, and more.
- **Socket.io**: Real-time communication between client and server.
- **Auth0**: User authentication and role-based access control.
  
### Project Structure
- **client/**: Contains the ReactJS frontend.
  - **src/**: Source code for the frontend, including components, pages, and API request configurations.
  - **api/**: Mock API requests during development.
  - **components/**: Reusable UI components.
  - **pages/**: Page-level components for different views in the application.
- **server/**: Contains the Express.js backend.
  - **api/**: All REST API endpoints.
  - **models/**: Mongoose models for MongoDB collections.
  - **routes/**: Definition of API routes.
  - **services/**: Business logic for handling API requests.
  - **utils/**: Utility functions and middleware.

## Features

### 1. Interactive Dashboard
- Full-screen map with real-time issue density heatmap.
- Filter toggles for issue types, time ranges, and severity levels.
- Live statistics panel with clickable metrics.

### 2. Road Segment Analysis
- Detailed analysis panel for any road segment with condition scores and event timelines.
- Visual evidence display with full-size image views and before/after comparisons.
- Road width analysis tool with interactive simulation of lane arrangements.

### 3. Traffic Management Interface
- Real-time traffic analysis for major intersections.
- Decongestion planning tool for interactive simulation of virtual improvements.

### 4. Task Management System
- Issue-to-task conversion for maintenance tasks.
- Kanban-style task dashboard with drag-and-drop functionality.
- Route optimization for maintenance crews.

### 5. Analytics and Reporting
- Comparative analysis tool for time period comparisons.
- Neighborhood comparison dashboard with condition scores.
- Predictive analytics panel for maintenance scheduling and budget recommendations.

### 6. Planning and Collaboration Features
- Virtual planning mode for proposing infrastructure changes.
- Real-time collaborative planning sessions with annotation capabilities.
- Exportable planning session reports.

### 7. Public Reporting Interface
- Public reports generator with customizable styles and metrics.
- Citizen-friendly public dashboard view.

## Getting Started

### Requirements
- **Node.js** (version 14 or later)
- **npm** (version 6 or later)
- **MongoDB** (local or cloud instance)

### Quickstart

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/infracity.git
   cd infracity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the `server/` directory with the following content:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_uri
     ACCESS_TOKEN_SECRET=your_access_token_secret
     REFRESH_TOKEN_SECRET=your_refresh_token_secret
     ```

4. **Start the development server**
   ```bash
   npm run start
   ```

   This command will start both the frontend and backend servers concurrently.

### License

```
(c) 2024 InfraCity. All rights reserved.
```