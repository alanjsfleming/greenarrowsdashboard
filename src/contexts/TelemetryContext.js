import { createContext, useContext, useState, useEffect } from 'react'
import { useDatabase } from './DatabaseContext'
import { rtdb } from '../firebase'
import { ref, onValue, off } from 'firebase/database'
import { useAuth } from './AuthContext'

const TelemetryContext = createContext()

export function useTelemetry() {
    return useContext(TelemetryContext)
}

export function TelemetryProvider({children}) {
    // Get settings from database
    const { currentUser } = useAuth()
    const { carsSettings } = useDatabase()
    // this state is always refererenced from the realtime database.
    const [latestTelemetry,setLatestTelemetry] = useState()
    // All Telemetry data for this race
    const [telemetry,setTelemetry] = useState([])

    // Every second, get the latest telemetry packet from Dweet, and add it to the telemetry array if it's new
    // Set this latest packet to latestTelemetry
    // remove the interval and restart it if the carsSettings.dweet_name changes so it always fetches the right dweet
    // How can I set this up so that it will handle multiple cars in future?

    async function getLatestTelemetry(dweet_name) {
        try {
            const response = await fetch(`https://dweet.io/get/latest/dweet/for/${dweet_name}`);
            const data = await response.json();

            if (data?.with?.length > 0) {
                const newTelemetry = data.with[0].content
                if (newTelemetry !== latestTelemetry) {
                    setTelemetry(telemetry)
                }
            }
        }
        catch(error) {
            console.log(error)
        }
    }
    // Subscribe to the realtime database and get the latest telemetry packet
    useEffect(()=> {
        const carTelemetryListeners = {};
        // Make a for loop that iterates over each item in the carsSettings
        for (let i=0; i<carsSettings?.length; i++) {
            // For each car, subscribe to the realtime database
            const car = carsSettings[i];
            const carRef = ref(rtdb,`teams/${currentUser.uid}/${car.id}`)

            // Add a listener to the carRef
            carTelemetryListeners[car.id] = onValue(carRef, (snapshot) => {
                const data = snapshot.val();
                setLatestTelemetry(prevData => ({
                    ...prevData,
                    [car.id]: data
                }))
            });
        }
        // Cleanup
        return () => {
            const carIds = Object.keys(carTelemetryListeners);
            for (let i=0; i<carsSettings.length; i++) {
                off(carTelemetryListeners[carIds[i]])
            }
        }
    },[carsSettings])


    useEffect(()=> {
        let interval;
        if (carsSettings?.dweet_name) {
            interval = setInterval(() => {
                getLatestTelemetry(carsSettings.dweet_name)
            }, 1200); // Update every 1.2 seconds, (because 1second gets timed out)
        }
        return ()=> clearInterval(interval) // Clear interval on component unmount
    },[carsSettings?.dweet_name])
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
        telemetry, // All data
        latestTelemetry, // Object with latest data for each car
    }

    return (
        <TelemetryContext.Provider value={value}>
            {children}
        </TelemetryContext.Provider>
    )
}