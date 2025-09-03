import { Bell, Search, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ThemeToggle } from "./ui/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Badge } from "./ui/badge"

export function DashboardHeader() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search infrastructure, tasks, or locations..."
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>

          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-none hover:from-red-600 hover:to-pink-700"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}