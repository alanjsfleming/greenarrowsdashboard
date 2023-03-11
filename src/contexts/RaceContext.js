import React, { useContext,useState } from 'react'


const RaceContext = React.createContext()

export function useRace() {
    return useContext(RaceContext)
}

export function RaceProvider({ children }) {
    const [startTime,setStartTime] = useState()


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
