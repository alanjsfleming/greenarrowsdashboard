import React, { useEffect,useState } from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import RacePanel from './components/RacePanel'
import { useAuth } from '../contexts/AuthContext'
import MenuBar from './components/MenuBar'
import LapSummary from './components/LapSummary'
import { useRace } from '../contexts/RaceContext'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'


// Pass the timer as a prop through to the details page
export default function HomePage() {
  const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'
  
  const [telemetry, newTelemetry] = useState([]);
  const [settings, newSettings] = useState()
  const [errorFetching, setErrorFetching] = useState(0)

  const { currentUser } = useAuth()

  const { resetrace,startTime,startrace } = useRace()

  const [resetButton,setResetButton] = useState('btn-primary')
  const [raceStart,setRaceStart] = useState()
  const [raceLength,setRaceLength] = useState(90)

  const [raceTime,setRaceTime] = useState()
  const [raceTimeValue,setRaceTimeValue] = useState()

  useEffect(() => {
    console.log('useEffect called with empty dependency array');
    try {
    loadSettingsFromFirebase()
    const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
    if (storedSettings) {newSettings(storedSettings)};  
    } catch (e) {console.log(e)}
  },[])
 
  function loadSettingsFromFirebase() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = getDoc(docRef).then((doc) => {
      const data = doc.data()
      newSettings(prevSettings => ({
        ...prevSettings,
        teamName:data.team_name,
        raceLength:data.race_length,
        trackLength:data.track_length,
        theme:data.appearance_theme,
    }))
    console.log(docSnap.data)
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  // save settings to local storage on settings change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
  },[settings])

  // set state start time on component load
  useEffect(()=>{
    try {
    setRaceStart(settings.raceStart)
    setRaceLength(settings.raceLength)
    } catch {
      console.log('raceStart not set')
    }
  },[settings])
  

  const cardweetname='https://dweet.io/get/latest/dweet/for/Albyn1'
  // Fetch from the dweet every 1.5s
  function handleUpdateTelemetry(e) {
    fetch(cardweetname)
    .then((response)=>response.json())
    .then((data)=> { 
      setErrorFetching(0)
     newTelemetry([data.with[0].content])
    })
    .catch(e =>{
      setErrorFetching(errorFetching+1)
    });
  }

  useEffect(()=>{
    const interval = setInterval(handleUpdateTelemetry,1000);
    return () => clearInterval(interval);
  })

  
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
  const interval = setInterval(() => {
    setRaceTime(elapsedTimeIntoString())
    setRaceTimeValue(elapsedTimeIntoValue())
  }, 100)
  return () => clearInterval(interval);
},[raceStart]);

  return (
    <>
    <MenuBar />
    <h2 class="home-page-card--title py-3">{currentUser.displayName} Dashboard</h2>
    {errorFetching>8 && 
    <div class="alert alert-warning mx-2 d-flex flex-column homepage-dash ">
      <p class="text-center">Unable to fetch data from car.</p>
      <div class="m-auto">
      <ul>
        <li>Dweet Thing name may be inputted incorrectly.</li>
        <li>Check that Dweet Thing is receiving data from car.</li>
      </ul>
      </div>
    </div>}
    <div class="d-flex homepage-dash flex-column">
      <CarSummary name={'GA1'} telemetry={telemetry}/>
      <br></br>
      <div class="card car-summary" id="raceTimer">
      <div class="card-header">
          <h3 class="card-title mt-1 text-center">Race {raceTime}</h3>
      </div>
      <div class="card-body">
          <progress class="progress" min="0" max={raceLength} value={raceTimeValue} ></progress>
          <div class="btn-group w-100 mt-2">
              <button disabled={raceStart} onClick={handleStart} class="btn btn-primary btn-block ">Start</button>
              <button onClick={handleReset} onBlur={handleUnfocusReset} class={"btn btn-block "+resetButton} >Reset</button>
              <Link to="/configure?2" class="btn btn-primary btn-block">Setup</Link>
          </div>
      </div>
  </div>
      <br></br>
      <LapSummary />
    </div>
   
    
    </>
  )
}

// <RacePanel />
// {settings.raceLength}
// (raceTime < settings.raceLength) ? raceTime : settings.raceLength+':00'}

// make setup button go to settings page in the race data section
/*
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
}*/
// value={elapsedTimeIntoValue}