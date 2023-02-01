import React, { useContext,useState } from 'react'


const RaceContext = React.createContext()

export function useRace() {
    return useContext(RaceContext)
}

export function RaceProvider({ children }) {
    const [startTime,setStartTime] = useState()
    const [raceOngoing,setRaceOngoing] = useState()

    function startrace() {
        setStartTime(Date.now())
        setRaceOngoing(true)
    }

    function resetrace() {
        setStartTime(null)
        setRaceOngoing(false)
    }

    const value = {
        startTime,
        raceOngoing,
        startrace,
        resetrace
    }

  return (
    <RaceContext.Provider value={value}>
        {children}
    </RaceContext.Provider>
  )
}
