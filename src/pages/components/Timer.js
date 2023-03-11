import React from 'react'
import { useEffect } from 'react'
import { useRace } from '../../contexts/RaceContext'

export default function Timer() {

    const [raceStart,setRaceStart] = useRace()
    const {startTime} = useRace()

    useEffect(()=>{
        setRaceStart(startTime)
      },[startTime])

    function timeSinceStart() {
        const currentTime=Date.now()
        const elapsedTime=currentTime-raceStart
      
        return elapsedTime
    }

    function elapsedTimeIntoValue() {
        const elapsedTime = timeSinceStart()
        return elapsedTime/1000/60
    }

    function elapsedTimeIntoString() {
        const elapsedTime = timeSinceStart()
        const mins=Math.floor(elapsedTime/1000/60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const seconds=Math.round((elapsedTime/1000)%60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const string = `${mins}:${seconds}`
        return string
    }

    
    
  return (
    <>
    <div class="gauge-holder">
        <progress class="progress" min="0" max="100" value={elapsedTimeIntoValue()}></progress>
    </div>
    <div class="elapsedTime">{elapsedTimeIntoString()}</div>
    </>
  )
}


//useEffect(()=>{
//    const interval = setInterval(timeSinceStart,1000);
//    console.log("hi")
//    return () => clearInterval(interval);
//  })