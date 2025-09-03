import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Zap } from "lucide-react"

interface MapViewProps {
  roads: any
  traffic: any
}

export function MapView({ roads, traffic }: MapViewProps) {
  return (
    <div className="relative">
      <div className="h-96 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-slate-800 dark:to-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapPin className="w-16 h-16 mx-auto text-slate-400" />
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Interactive Map</h3>
            <p className="text-slate-500 dark:text-slate-400">Map integration with Mapbox GL JS would be implemented here</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="destructive">High Priority Areas</Badge>
            <Badge variant="secondary">Medium Priority</Badge>
            <Badge variant="default">Normal Conditions</Badge>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 left-4 space-y-2">
        <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
          <Zap className="w-4 h-4 mr-2" />
          Heat Map
        </Button>
        <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
          <Navigation className="w-4 h-4 mr-2" />
          Traffic Flow
        </Button>
      </div>

      <div className="absolute top-4 right-4">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-sm space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Critical Issues</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Moderate Issues</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Good Condition</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}