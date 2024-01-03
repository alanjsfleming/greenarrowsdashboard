import { createContext,useContext,useState } from 'react'
import { useDatabase } from './DatabaseContext'

const TelemetryContext = createContext()

export function useTelemetry() {
    return useContext(TelemetryContext)
}

export function TelemetryProvider({children}) {
    // Get settings from database

    const { userSettings,carsSettings } = useDatabase()
    // this state is always refererenced from the realtime database.
    const [latestTelemetry,setLatestTelemetry] = useState()
    // All Telemetry data for this race
    const [telemetry,setTelemetry] = useState([])

    // Every second, get the latest telemetry packet from Dweet, and add it to the telemetry array if it's new
    // Set this latest packet to latestTelemetry
    // remove the interval and restart it if the carsSettings.dweet_name changes so it always fetches the right dweet
    // How can I set this up so that it will handle multiple cars in future?

    // useEffect(()=> {
    //     let interval;
    //     if (carsSettings?.dweet_name) {
    //         interval = setInterval(() => {
    //             getLatestTelemetry(carsSettings.dweet_name)
    //         }, 1000); // Update every second
    //     }
    //     return ()=> clearInterval(interval) // Clear interval on component unmount
    // },[carsSettings?.dweet_name])

    // function getLatestTelemetry(dweetName) {
    //     fetch(`https://dweet.io/get/latest/dweet/for/${dweetName}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data?.with?.length > 0) {
    //             const newTelemetry = data.with[0].content
    //             if (newTelemetry !== latestTelemetry) {
    //                 setLatestTelemetry(newTelemetry)
    //                 setTelemetry([...telemetry,newTelemetry])
    //             }
    //         }
    //     })




    const value = {
        telemetry,
        latestTelemetry,
    }

    return (
        <TelemetryContext.Provider value={value}>
            {children}
        </TelemetryContext.Provider>
    )
}