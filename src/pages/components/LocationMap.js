import React, {useState,useEffect} from "react"
import { Map, Marker } from "pigeon-maps"
import { Link } from "react-router-dom"

import ContentLocked from "../../layouts/ContentLocked"

export default function LocationMap(props) {
    // -2.1351633
    const temp = [57.1189133, -2.1351633]
    const [carLocations, setCarLocations] = useState()
    const [mapCentre, setMapCentre] = useState()
    const [mapZoom, setMapZoom] = useState(15)
    const [settings, setSettings] = useState()
    const [allowedPermissions, setAllowedPermissions] = useState(true)


    useEffect(() => {
        try {
            if (props.settings.role === 'pro' || props.settings.role === 'standard') {
                setAllowedPermissions(true)
            }
        } catch(error) {
            console.log(error)
        }
    },[props.settings])

    // carLocations is an array of arrays, each containing the lat and long of the car
    // carLocations = [[lat,long],[lat,long],[lat,long]]
    // carLocations[0] = [lat,long]
    
    function determineCentreOfMap() {
        let latTotal = 0
        let longTotal = 0
        if (!carLocations) return null
        carLocations.forEach((car) => {
            latTotal += car.location[0]
            longTotal += car.location[1]
        })
        const latCentre = latTotal / carLocations.length
        const longCentre = longTotal / carLocations.length

        return [latCentre,longCentre]
    }

    const renderMarker = (car) => {
        if (!car.location) {return null} // if car has no location data, don't render a marker

        return <Marker width={50} anchor={car.location} color="green" />

    }

    //  if (carLocations.length === 1) return <Marker width={50} anchor={carLocations[0]} color="green"/>
       

    const renderCarLegend = (car) => {
        if (!carLocations) {return null}
        return <p class="btn btn-outline-primary btn-block">{car.name}</p>
    }
    
    // I want car buttons to center map on car and have colours

    useEffect(() => {
        setCarLocations(props.locationData)
        setMapCentre(determineCentreOfMap())
        
    },[props.locationData])


  return (
    <div class="card car-summary mb-4">
        <div class="card-header text-center">
            <h3>Map</h3>
        </div>
        <div class="card-body car-summary-vis d-flex flex-column">
            {(carLocations && allowedPermissions) ? 
            <>
            <Map height={300} center={mapCentre} touchEvents={true} mouseEvents={true} defaultZoom={15} >
                {carLocations.map(renderMarker)}
            </Map>
            <div class="btn-group w-100">
                {carLocations.map(renderCarLegend)}
            </div>
            </>
            : (allowedPermissions ? 
            <div class="d-flex flex-column">
            <p>No Location Data...</p>
            <Link to="/configure?3" class="btn btn-outline-secondary btn-block">Disable Map</Link>
            </div> 
            : 
            <ContentLocked role={props.settings.role}/>
            )
            }

        </div>
    </div>
  )
}