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
    const [userData,setUserData] = useState()
    const [carsData,setCarsData] = useState()

    useEffect(()=> {
        // Subscribe to the user document
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef,userSnapshot => {
            if (userSnapshot.exists()) {
                setUserData(userSnapshot.data())
            } else {
                console.log("No such document!");
                setUserData(null);
            }
        })
        // Subscribe to the user's cars 
        const carsQuery = query(collection(db, "cars"), where("owner", "==", currentUser.uid));
        const unsubscribeCars = onSnapshot(carsQuery, carsSnapshot => {
            const newCarsData = carsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setCarsData(newCarsData)
        });
        return () => {
            unsubscribeUser();
            unsubscribeCars();
        }
    }
    ,[currentUser])

    const value = {
        userData,
        carsData,
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    )
}