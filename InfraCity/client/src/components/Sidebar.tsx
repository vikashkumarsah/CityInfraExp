import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  MapPin, 
  FileText,
  Settings,
  Users,
  Bell
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Task Management', href: '/tasks', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Planning', href: '/planning', icon: MapPin },
  { name: 'Reports', href: '/reports', icon: FileText },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">CityInfra</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">City Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">admin@city.gov</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}