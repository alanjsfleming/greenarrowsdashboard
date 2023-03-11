import React, { useState,useEffect } from 'react'
import { useRace } from '../../contexts/RaceContext'


export default function RacePanel() {
  const { resetrace,startTime,startrace } = useRace()
  const [resetButton,setResetButton] = useState('btn-primary')
  const [raceStart,setRaceStart] = useState()
  const [currentTime,setCurrentTime] = useState()

  useEffect(()=>{
    setRaceStart(startTime)
  },[startTime])

  function handleReset(e){
    if (resetButton === 'btn-primary') {

      setResetButton('btn-danger')
  } else {
    setResetButton('btn-primary')
    resetrace()
  }

}

function handleUnfocusReset(e){
  setResetButton('btn-primary')
}

  function handleStart(e){
    startrace()
    console.log(startTime)
  }

  function timeSinceStart() {
    const currentTime=Date.now()
    console.log(currentTime)
    if (raceStart) {
      const elapsedTime=currentTime-raceStart
      return elapsedTime
    } else {
      return null
    }
    
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

  // rewrite this so function is called to set the time into a state and then the UI displays the state instead of calling the function

  return (
    <div class="card car-summary" id="raceTimer">
        <div class="card-header">
            <h3 class="card-title mt-1 text-center">Race {elapsedTimeIntoString()}</h3>
        </div>
        <div class="card-body">
            <progress class="progress" min="0" max="100" value={elapsedTimeIntoValue()} ></progress>
            <div>
                <button onClick={handleStart} class="btn btn-primary mx-1">Start</button>
                <button onClick={handleReset} onBlur={handleUnfocusReset} class={"btn mx-1 "+resetButton} >Reset</button>
                <button class="btn btn-primary mx-1">Setup</button>
            </div>
        </div>
    </div>
  )
}
// value={elapsedTimeIntoValue}