import { useAuth } from "./AuthContext"
import { db } from "../firebase"
import { doc, onSnapshot, query, collection, where } from "firebase/firestore"
import React, { useEffect, useState,useContext } from "react"


const DatabaseContext = React.createContext()

export function useDatabase() {
    return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }) {
    // Current User
    const { currentUser } = useAuth()

    // Settings Data
    const [userSettings,setUserSettings] = useState()
    const [carsSettings,setCarsSettings] = useState()
    const [elapsedRaceTime,setElapsedRaceTime] = useState(0)

    useEffect(()=> {
        // If not logged in then jsut return
        if (!currentUser) {
            return
        }
        // Subscribe to the user document
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef,userSnapshot => {
            if (userSnapshot.exists()) {
                setUserSettings(userSnapshot.data())
            } else {
                console.log("No such document!");
                setUserSettings(null);
            }
        })
        // Subscribe to the user's cars 
        const carsQuery = query(collection(db, "cars"), where("owner", "==", currentUser.uid));
        const unsubscribeCars = onSnapshot(carsQuery, carsSnapshot => {
            const newCarsSettings = carsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setCarsSettings(newCarsSettings)
            console.log(newCarsSettings)
        });
        return () => {
            unsubscribeUser();
            unsubscribeCars();
        }
    }
    ,[currentUser])

    useEffect(()=> {
        let interval;
        if (userSettings?.race_start_time) {
            interval = setInterval(() => {
                setElapsedRaceTime(Date.now() - userSettings.race_start_time)    
            }, 1000); // Update every second
        }
        return ()=> clearInterval(interval) // Clear interval on component unmount
    },[userSettings?.race_start_time])

    const value = {
        userSettings,
        carsSettings,
        elapsedRaceTime,
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    )
}