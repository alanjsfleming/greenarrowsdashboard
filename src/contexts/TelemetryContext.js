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
    const [latestTelemetry,setLatestTelemetry] = useState([])
    // All Telemetry data for this race
    const [telemetry,setTelemetry] = useState([])

    // Every second, get the latest telemetry packet from Dweet, and add it to the telemetry array if it's new
    // Set this latest packet to latestTelemetry
    // remove the interval and restart it if the carsSettings.dweet_name changes so it always fetches the right dweet
    // How can I set this up so that it will handle multiple cars in future?
    //console.log(carsSettings)
    async function getLatestTelemetry(dweet_name) {
        //console.log(dweet_name)
        try {
            const response = await fetch(`https://dweet.io/get/latest/dweet/for/${dweet_name}`);
            const data = await response.json();
            //console.log(data.with[0])
            if (data?.with[0]) {
                const newTelemetry = data.with[0]
                if (newTelemetry !== latestTelemetry[latestTelemetry.length-1]) {
                    setTelemetry(newTelemetry)
                    //console.log(telemetry)
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
        const currentCarsSettings = carsSettings; // Capture the current value
    
        if (currentCarsSettings) {
            for (let i=0; i<currentCarsSettings.length; i++) {
                const car = currentCarsSettings[i];
                const carRef = ref(rtdb,`teams/${currentUser.uid}/${car.id}`)
    
                carTelemetryListeners[car.id] = onValue(carRef, (snapshot) => {
                    const data = snapshot.val();
                    setLatestTelemetry(prevData => ({
                        ...prevData,
                        [car.id]: data
                    }))
                });
            }
        }
    
        return () => {
            if (carsSettings) {
                carsSettings.forEach(car => {
                    // Retrieve the stored ref and callback
                    const { ref: carRef, callback } = carTelemetryListeners[car.id];
                    if (carRef && callback) {
                        off(carRef, 'value', callback);
                    }
                });
            }
        };
    },[carsSettings])


    useEffect(() => {
        // Initialize the intervals array to ensure it's never undefined
        let intervals = [];
    
        // Ensure carsSettings is defined and not empty before setting intervals
        if (carsSettings && carsSettings.length > 0) {
            carsSettings.forEach(car => {
                if (car?.dweet_name) {
                    const interval = setInterval(() => {
                        getLatestTelemetry(car.dweet_name);
                    }, 1200); // Update every 1.2 seconds
    
                    intervals.push(interval); // Store the interval ID in the array
                }
            });
        } else {
            console.log('No cars settings available or carsSettings is empty.');
        }
    
        // Cleanup function to clear all intervals
        return () => {
            if (intervals.length > 0) {
                intervals.forEach(interval => clearInterval(interval));
            }
        };
    }, [carsSettings]); // Depend on carsSettings
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