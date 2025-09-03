import { Navigate } from "react-router-dom"

export function Layout() {
  // Redirect to dashboard layout
  return <Navigate to="/" replace />
}