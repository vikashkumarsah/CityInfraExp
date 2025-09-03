import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  Zap,
  AlertTriangle,
  Car,
  Construction,
  Layers,
  Filter,
  Search,
  Route
} from "lucide-react"
import { RoadSegmentPanel } from "./RoadSegmentPanel"
import { IntersectionPanel } from "./IntersectionPanel"

interface InteractiveMapProps {
  roads?: any[]
  traffic?: any[]
  issues?: any[]
  mode?: 'overview' | 'traffic'
  onLocationSelect?: (location: any) => void
}

export function InteractiveMap({ roads = [], traffic = [], issues = [], mode = 'overview', onLocationSelect }: InteractiveMapProps) {
  const [selectedLayer, setSelectedLayer] = useState('issues')
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [selectedRoadSegment, setSelectedRoadSegment] = useState<string | null>(null)
  const [selectedIntersection, setSelectedIntersection] = useState<string | null>(null)
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)

  // Mock map data points
  const mapPoints = [
    { id: '1', type: 'pothole', severity: 'high', x: 25, y: 30, title: 'Large Pothole', location: 'Main St & 5th Ave' },
    { id: '2', type: 'garbage', severity: 'medium', x: 60, y: 45, title: 'Garbage Accumulation', location: 'Park Avenue' },
    { id: '3', type: 'traffic', severity: 'high', x: 40, y: 60, title: 'Traffic Congestion', location: 'Downtown Intersection' },
    { id: '4', type: 'road_marker', severity: 'low', x: 75, y: 25, title: 'Faded Road Markers', location: 'Highway 101' },
    { id: '5', type: 'pothole', severity: 'medium', x: 30, y: 70, title: 'Medium Pothole', location: 'Oak Street' },
    { id: '6', type: 'traffic', severity: 'medium', x: 80, y: 55, title: 'Moderate Traffic', location: 'City Center' },
  ]

  // Mock road segments
  const roadSegments = [
    { id: 'seg1', x1: 10, y1: 30, x2: 90, y2: 30, name: 'Main Street', condition: 78 },
    { id: 'seg2', x1: 10, y1: 60, x2: 90, y2: 60, name: 'Park Avenue', condition: 65 },
    { id: 'seg3', x1: 30, y1: 10, x2: 30, y2: 90, name: '5th Avenue', condition: 82 },
    { id: 'seg4', x1: 70, y1: 10, x2: 70, y2: 90, name: 'Broadway', condition: 71 }
  ]

  // Mock intersections
  const intersections = [
    { id: 'int1', x: 30, y: 30, name: 'Main & 5th', volume: 1250, congestion: 'high' },
    { id: 'int2', x: 70, y: 30, name: 'Main & Broadway', volume: 890, congestion: 'medium' },
    { id: 'int3', x: 30, y: 60, name: 'Park & 5th', volume: 750, congestion: 'low' },
    { id: 'int4', x: 70, y: 60, name: 'Park & Broadway', volume: 1100, congestion: 'high' }
  ]

  const getPointColor = (type: string, severity: string) => {
    const colors = {
      pothole: { high: 'bg-red-500', medium: 'bg-orange-500', low: 'bg-yellow-500' },
      garbage: { high: 'bg-purple-500', medium: 'bg-purple-400', low: 'bg-purple-300' },
      traffic: { high: 'bg-blue-600', medium: 'bg-blue-500', low: 'bg-blue-400' },
      road_marker: { high: 'bg-green-600', medium: 'bg-green-500', low: 'bg-green-400' }
    }
    return colors[type as keyof typeof colors]?.[severity as keyof typeof colors.pothole] || 'bg-gray-500'
  }

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'pothole': return '🕳️'
      case 'garbage': return '🗑️'
      case 'traffic': return '🚦'
      case 'road_marker': return '🚧'
      default: return '📍'
    }
  }

  const getRoadConditionColor = (condition: number) => {
    if (condition >= 80) return 'stroke-green-500'
    if (condition >= 60) return 'stroke-yellow-500'
    return 'stroke-red-500'
  }

  const getIntersectionColor = (congestion: string) => {
    switch (congestion) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={heatmapEnabled ? "default" : "outline"}
            onClick={() => setHeatmapEnabled(!heatmapEnabled)}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            <Zap className="w-4 h-4 mr-2" />
            Heat Map
          </Button>
          {mode === 'traffic' && (
            <Button size="sm" variant="outline">
              <Route className="w-4 h-4 mr-2" />
              Traffic Flow
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map Area */}
        <div className="lg:col-span-3">
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Interactive Infrastructure Map
                {mode === 'traffic' && <Badge className="ml-2 bg-blue-500">Traffic Mode</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Map Canvas */}
                <div className="h-96 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 rounded-lg border overflow-hidden relative">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#map-grid)" />
                    </svg>
                  </div>

                  {/* Heatmap overlay */}
                  {heatmapEnabled && (
                    <div className="absolute inset-0">
                      {/* High density areas */}
                      <div className="absolute w-32 h-32 bg-red-500/20 rounded-full blur-xl" style={{ left: '20%', top: '25%' }}></div>
                      <div className="absolute w-24 h-24 bg-orange-500/20 rounded-full blur-lg" style={{ left: '55%', top: '40%' }}></div>
                      <div className="absolute w-28 h-28 bg-red-500/15 rounded-full blur-xl" style={{ left: '35%', top: '55%' }}></div>
                    </div>
                  )}

                  {/* Road segments */}
                  <svg className="absolute inset-0 w-full h-full">
                    {roadSegments.map((segment) => (
                      <line
                        key={segment.id}
                        x1={`${segment.x1}%`}
                        y1={`${segment.y1}%`}
                        x2={`${segment.x2}%`}
                        y2={`${segment.y2}%`}
                        className={`${getRoadConditionColor(segment.condition)} cursor-pointer hover:stroke-blue-600 transition-colors`}
                        strokeWidth="6"
                        onClick={() => setSelectedRoadSegment(segment.id)}
                      />
                    ))}
                  </svg>

                  {/* Intersections (Traffic Mode) */}
                  {mode === 'traffic' && intersections.map((intersection) => (
                    <div
                      key={intersection.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110`}
                      style={{ left: `${intersection.x}%`, top: `${intersection.y}%` }}
                      onClick={() => setSelectedIntersection(intersection.id)}
                    >
                      <div className={`w-8 h-8 ${getIntersectionColor(intersection.congestion)} rounded-full flex items-center justify-center text-white text-xs shadow-lg border-2 border-white`}>
                        🚦
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white dark:bg-slate-800 px-2 py-1 rounded shadow">
                        {intersection.volume}
                      </div>
                    </div>
                  ))}

                  {/* Data Points (Overview Mode) */}
                  {mode === 'overview' && mapPoints.map((point) => (
                    <div
                      key={point.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                        selectedLocation?.id === point.id ? 'scale-125 z-10' : ''
                      }`}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      onClick={() => {
                        setSelectedLocation(point)
                        onLocationSelect?.(point)
                      }}
                    >
                      <div className={`w-6 h-6 ${getPointColor(point.type, point.severity)} rounded-full flex items-center justify-center text-white text-xs shadow-lg border-2 border-white`}>
                        <span className="text-xs">{getPointIcon(point.type)}</span>
                      </div>
                      {selectedLocation?.id === point.id && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg border min-w-48 z-20">
                          <h4 className="font-medium text-sm">{point.title}</h4>
                          <p className="text-xs text-slate-500">{point.location}</p>
                          <Badge variant={point.severity === 'high' ? 'destructive' : point.severity === 'medium' ? 'secondary' : 'default'} className="mt-1">
                            {point.severity}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4">
                    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                      <CardContent className="p-3">
                        <div className="text-sm space-y-1">
                          {mode === 'overview' ? (
                            <>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <span>High Priority</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                                <span>Medium Priority</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <span>Low Priority</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <span>High Congestion</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <span>Medium Congestion</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span>Low Congestion</span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-sm">Layer Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Tabs value={selectedLayer} onValueChange={setSelectedLayer} orientation="vertical">
                <TabsList className="grid w-full grid-cols-1 h-auto">
                  <TabsTrigger value="issues" className="justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Issues
                  </TabsTrigger>
                  <TabsTrigger value="traffic" className="justify-start">
                    <Car className="w-4 h-4 mr-2" />
                    Traffic
                  </TabsTrigger>
                  <TabsTrigger value="maintenance" className="justify-start">
                    <Construction className="w-4 h-4 mr-2" />
                    Maintenance
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Active Issues</span>
                <Badge variant="destructive">24</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">In Progress</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Resolved Today</span>
                <Badge variant="default">8</Badge>
              </div>
              {mode === 'traffic' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Speed</span>
                    <Badge variant="outline">25 mph</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Peak Volume</span>
                    <Badge variant="outline">1580/hr</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {selectedLocation && mode === 'overview' && (
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-sm">Selected Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedLocation.title}</h4>
                  <p className="text-sm text-slate-500">{selectedLocation.location}</p>
                </div>
                <Badge variant={selectedLocation.severity === 'high' ? 'destructive' : selectedLocation.severity === 'medium' ? 'secondary' : 'default'}>
                  {selectedLocation.severity} Priority
                </Badge>
                <Button size="sm" className="w-full">
                  Create Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Road Segment Panel */}
      <RoadSegmentPanel
        segmentId={selectedRoadSegment}
        onClose={() => setSelectedRoadSegment(null)}
      />

      {/* Intersection Panel */}
      <IntersectionPanel
        intersectionId={selectedIntersection}
        onClose={() => setSelectedIntersection(null)}
      />
    </div>
  )
}