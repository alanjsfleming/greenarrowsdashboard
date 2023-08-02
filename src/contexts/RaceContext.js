import React, { useContext,useState,useEffect } from 'react'
import { db } from '../firebase'


//I DONT THINK THIS FILE IS USED ANYWHERE IN THE PROJECT!
const RaceContext = React.createContext()

const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'



export function useRace() {
    return useContext(RaceContext)
}

export function RaceProvider({ children }) {
    const [startTime,setStartTime] = useState()
   
    
    
    
    // use effect to load start time from local storage on refresh
    /*
    useEffect(() => {
        const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
        if (storedSettings.race_start) {setStartTime(storedSettings.race_start)};

    },[])
    */

    

    function startrace() {
        setStartTime(Date.now())
    }

    function resetrace() {
        setStartTime(null)
    }

    const value = {
        startTime,
        startrace,
        resetrace
    }

  return (
    <RaceContext.Provider value={value}>
        {children}
    </RaceContext.Provider>
  )
}
