import { InteractiveMap } from "./InteractiveMap"

interface MapViewProps {
  roads: any
  traffic: any
}

export function MapView({ roads, traffic }: MapViewProps) {
  return (
    <InteractiveMap 
      roads={roads?.roads || []} 
      traffic={traffic?.intersections || []}
      onLocationSelect={(location) => {
        console.log('Selected location:', location)
      }}
    />
  )
}