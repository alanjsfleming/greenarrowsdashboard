import React, { useState,useEffect } from 'react'
import { useRace } from '../../contexts/RaceContext'
import { Link } from 'react-router-dom'

// the page will not run because of the error below
// TypeError: Cannot read property 'raceStart' of undefined
// I am trying to load the start time from local storage on component load
// I am doing this so it can save the new value of start time to the local storage when clicked
// I am trying to use the same method as in the App.js file
// it is not working because the settings state is not being set on component load


export default function RacePanel() {
  const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'

  
  const { resetrace,startTime,startrace } = useRace()

  const [resetButton,setResetButton] = useState('btn-primary')
  const [raceStart,setRaceStart] = useState()

  const [settings,newSettings] = useState({})
  const [raceTime,setRaceTime] = useState()
  const [raceTimeValue,setRaceTimeValue] = useState()
  // Load settings from local storage
  

  // load settings from local storage on component load
  // why does the functin not work?
  // it is not setting the settings state
  useEffect(() => {
    console.log('useEffect called with empty dependency array');
    try {
    const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
    if (storedSettings) {newSettings(storedSettings)};  
    } catch (e) {console.log(e)}
  },[])
 

  // save settings to local storage on settings change
  useEffect(() => {
    console.log('useEffect called with settings dependency');
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
  },[settings])

  // set state start time on component load
  useEffect(()=>{
    console.log('useEffect called with raceStart dependency');
    if (settings.raceStart){
    setRaceStart(settings.raceStart)
    }
  },[settings])


  function handleReset(e){
    if (resetButton === 'btn-primary') {

      setResetButton('btn-danger')
  } else {
    setResetButton('btn-primary')
    setRaceStart(null)
    newSettings(prevSettings=>({
      ...prevSettings,
      raceStart: null
    }))
  }

}

// when a primed reset button is clicked off of it will put the button back to its normal condition
function handleUnfocusReset(e){
  setResetButton('btn-primary')
}

  function handleStart(e){
    startrace()
    // Writes the start time to local settings
    const currentTime=Date.now()
    newSettings(prevSettings=>({
      ...prevSettings,
      raceStart: currentTime
    }))
  }


  function timeSinceStart() {
    const currentTime=Date.now()
    if (settings.raceStart) {
      const elapsedTime=currentTime-settings.raceStart
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

  // updates the race time every second with the elapsed time in minutes and seconds
  useEffect(() => {
    console.log(raceStart)
    const interval = setInterval(() => {
      setRaceTime(elapsedTimeIntoString())
      setRaceTimeValue(elapsedTimeIntoValue())
    }, 100)
    return () => clearInterval(interval);
  },[raceStart]);

  
  // make setup button go to settings page in the race data section

  return (
    <div class="card car-summary" id="raceTimer">
        <div class="card-header">
            <h3 class="card-title mt-1 text-center">Race {(raceTime < settings.raceLength) ? raceTime : settings.raceLength+':00'}</h3>
        </div>
        <div class="card-body">
            <progress class="progress" min="0" max={settings.raceLength} value={raceTimeValue} ></progress>
            <div class="btn-group w-100 mt-2">
                <button disabled={raceStart} onClick={handleStart} class="btn btn-primary btn-block ">Start</button>
                <button onClick={handleReset} onBlur={handleUnfocusReset} class={"btn btn-block "+resetButton} >Reset</button>
                <Link to="/configure?2" class="btn btn-primary btn-block">Setup</Link>
            </div>
        </div>
    </div>
  )
}
// value={elapsedTimeIntoValue}