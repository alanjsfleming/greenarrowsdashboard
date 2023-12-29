import React, { useEffect,useState,useRef } from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import { useAuth } from '../contexts/AuthContext'
import MenuBar from '../layouts/MenuBar'
import LapSummary from './components/LapSummary'
import { doc, getDoc,collection,query,where,getDocs, orderBy,updateDoc } from "firebase/firestore";
import { db } from '../firebase'

import LocationMap from './components/LocationMap'
import { rtdb } from '../firebase'
import { ref, onValue,push,off } from "firebase/database";
import PitStopPanel from './components/PitStopPanel'
import DataLastReceived from '../layouts/DataLastReceived'

// need to pass the car running data array to where it is consumed
// teams/teamid/carid
// need to store the carid somewhere in the settings

// When new data point is taken, compare it to running data array to see if its,
// Actually a new datapoint, if it is then push to the array in realtime database
// with timestamp added



export default function HomePage() {
  // Send a page view event to Firebase Analytics



  const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'
  
  const [telemetry, newTelemetry] = useState([]);
  const [settings, newSettings] = useState()
  const [errorFetching, setErrorFetching] = useState()
  const [dataLastReceived,setDataLastReceived] = useState("2023-06-10T14:37:47.074Z")
  const [fetchURL,setFetchURL] = useState()
  const { currentUser } = useAuth()

  const [resetButton,setResetButton] = useState('btn-primary')
  const [raceStart,setRaceStart] = useState()
  const [raceLength,setRaceLength] = useState(90)

  const [raceTime,setRaceTime] = useState()
  const [raceTimeValue,setRaceTimeValue] = useState()

  const [runningData,setRunningData] = useState([])

  const [carInPit,setCarInPit] = useState(false) // state to track if the car is in the pit or not



  const runningDataRef = useRef(runningData)
  // settings.cars[i].running_data should be always equal to the realtime database entry for that car
  // function to set the settings state to the realtime database entry for that car
  function syncCarDataWithRealtimeDatabase() {
    //car_num = car_num - 1
    //const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[car_num].id}`)
    
  }

  useEffect(() => {
  
    try {
    loadSettingsFromFirebase()
    const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
    if (storedSettings) {
      newSettings(storedSettings)
      
    };  
    } catch (e) {console.log(e)}
    
  },[])
 
  function loadSettingsFromFirebase() {
    const docRef = doc(db, "users", currentUser.uid);
    const carsRef = collection(db,"cars")
    const docSnap = getDoc(docRef).then((doc) => {
      const data = doc.data()
      newSettings(prevSettings => ({
        ...prevSettings,
        teamName:data.team_name,
        raceLength:data.race_length,
        trackLength:data.track_length,
        theme:data.appearance_theme,
        raceStart:data.race_start_time,
        role:data.role,
        lapSummaryTable:data.lap_summary_table,
        summaryMap:data.summary_map,
        manualLapMode:data.manualLapMode,
        carInPit:data.carInPit,
        totalPitTime:data.totalPitTime,
    }))
    
    }).catch((error) => {
      console.log("Error getting user document:", error);
    });
    const carQuery = query(carsRef, where("owner","==",currentUser.uid), orderBy("car_number"))
    const querySnapshot = getDocs(carQuery).then((querySnapshot) => {
      let carArray = []
      //console.log(querySnapshot)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // write this to settings in settings.cars object as an array
        const carDataSnapshot = doc.data()
        carDataSnapshot.id = doc.id
        carArray.push(carDataSnapshot)
      }) 
      newSettings(prevSettings => ({
        ...prevSettings,
        cars:carArray,
    })) 
    }).catch((error) => {
      console.log("Error getting cars documents:", error);
    });
  }

  // save settings to local storage on settings change
  

  // set state start time on component load
  useEffect(()=>{
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
    try {
    setRaceStart(settings.raceStart)
    setRaceLength(settings.raceLength)
    // COME BACK TO THIS
    // Need to load correct car telemetry
    setFetchURL('https://dweet.io/get/latest/dweet/for/'+settings.cars[0].dweet_name)
    } catch {
      console.log('raceStart not set')
    }
    
  },[settings])
  
  useEffect(()=>{
    // When the raceStart changes, if it is not running then make sure client is not listening to realtime database, this is for bandwidth reasons
    if (!raceStart) {
      try {
        const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[0].id}`)
        // Stop listening to database if race is not in progress
        off(rtCarRef)
      } catch(e) {
        console.log(e)
      }
      return
    }
    // Otherwise, if it is on then subscribe and update client state with realtime database value for the users car
    try {
      
      // Change this ref to be dynamic to the car
      const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[0].id}`)
      // start listening to database if race is in progress
      onValue(rtCarRef, (snapshot) => {
        
        const data = []
        snapshot.forEach((childSnapshot) => {
          data.push(childSnapshot.val())
        })
        console.log(data)
      
      
        // If the there is no data in the realtime database, return and do nothing
        if (data === null) {
          console.log("data is null")
          return
        }
        
        // If the data is the same in the database as the client already has then do nothing.
        if (runningDataRef.current === data) {
          console.log("data is the same")
          return
        }

        // If it passes the other escapes then set the client data to be the same as the database
        setRunningData(data)
        runningDataRef.current = data
        
        console.log("Taken value from realtime database")
      }, (error) => {
        console.log("Error: " + error);
      });
      console.log("successfully set up realtime database listener"+rtCarRef)
    } catch (e) { console.log("error setting up realtime database listener" + e)}
  },[raceStart])
  
  //useEffect(()=>{
    //console.log(runningData)
  //},[runningData])

  // Fetch from the dweet every 1.5s
  function handleUpdateTelemetry(e) {
    setFetchURL('https://dweet.io/get/latest/dweet/for/'+settings.cars[0].dweet_name)
    fetch(fetchURL)
    .then((response)=>response.json())
    .then((data)=> { 
      
      newTelemetry([data.with[0].content])
      setErrorFetching(0)
   
      // Make the last data received time state = to the timestamp onn the data packet
     }
    )
    .catch(e =>{
      console.log('undefined'+e)
      setErrorFetching(errorFetching+1)
    });
  }

  // use effect to update running telemetry when telemetry state changes
  

  useEffect(()=>{
    if (telemetry.length > 0 && raceStart) {
      const data = telemetry[0]
      data.timestamp=Date.now()
      appendDataToSettings(data,1)
    }
    
  },[telemetry])

  // This allows the telemetry to be fetched dynamically as it takes time for the url to be taken from local storage
  useEffect(()=>{
    const telemetryInterval = setInterval(handleUpdateTelemetry,1500);
    return () => clearInterval(telemetryInterval);
  },[fetchURL])

  // Race reset
function handleReset(e){
  if (resetButton === 'btn-primary') {
    setResetButton('btn-danger') // Make it scary to confirm
} else {
  setResetButton('btn-primary') // If its already scary then confirm it and reset
  setRaceStart(null)
  newSettings(prevSettings=>({
    ...prevSettings,
    raceStart: null
  }))
  const userRef = doc(db, "users", currentUser.uid);
  updateDoc(userRef, {race_start_time: null}, {merge: true}) // Save this reset to firebase also
}
}

// when a primed reset button is clicked off of it will put the button back to its normal condition
function handleUnfocusReset(e){
  setResetButton('btn-primary')
}

function handleStart(e){
  // Writes the start time to local settings
  const currentTime=Date.now()
  newSettings(prevSettings=>({
    ...prevSettings,
    raceStart: currentTime
  }))

  const userRef = doc(db, "users", currentUser.uid);
  updateDoc(userRef, {race_start_time: currentTime}, {merge: true})
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

// When race is running, save each request to local storage settings.running_data array
// function to append data packet to settings.running_data array
function appendDataToSettings(data,car_num) {
  if (settings?.lapSummaryTable==='Disabled') {
    return 
  }

  // this needs to be changed for when multiple cars...
  const carId = settings.cars[car_num-1].id
  const lastDataPoint = { timestamp : 0}
  // Store the data in firebase realtime database
  const rtDocRef = ref(rtdb, `teams/${currentUser.uid}/${carId}`)

  
  // Check the datapoint against the previous points to see if duplicate
  
  // get last datapoint from realtime database
  //if (settings.cars[0].running_data) { 
  if (runningDataRef.current.length>1) {
  //const lastDataPoint = settings.cars[0].running_data.at(-1)
    const lastDataPoint = runningData.at(-1)
  }
 
  // If the data is the same as the last datapoint, do nothing
  if (lastDataPoint.timestamp === (data.timestamp)) {
    return
  }
  // 
  if (runningDataRef.current && (lastDataPoint.timestamp < (data.timestamp))) {
    // console.log(data.timestamp)
    try {
      const latestDataPointRef = push(rtDocRef, data)
      console.log("pushed")
    } catch(e) {console.log(e)}
  
  }

  
 

  // The below is for when the data is only stored locally
  /*
  console.log(data)
  // if settings.running_data is undefined, create it
  if (!settings.hasOwnProperty('running_data')) {
    newSettings(prevSettings=>({
      ...prevSettings,
      running_data: [data]
      }))
  } else {
    // if settings.running_data is defined, append the data to it
  newSettings(prevSettings=>({
    ...prevSettings,
    running_data: [...prevSettings.running_data, data]
  }))
  }
  */
}
/*
function handleStart(e){
  // Writes the start time to local settings
  const currentTime=Date.now()
  newSettings(prevSettings=>({
    ...prevSettings,
    raceStart: currentTime
  }))

  const userRef = doc(db, "users", currentUser.uid);
  updateDoc(userRef, {race_start_time: currentTime}, {merge: true})
}*/

function handleCarInPit() {
  console.log("Car in pit")
  const currentTime = Date.now()
  newSettings(prevSettings=>({
    ...prevSettings,
    carInPit: currentTime
  }))
  const userRef = doc(db, "users", currentUser.uid);
  updateDoc(userRef, {carInPit: currentTime}, {merge: true})
}

function handleCarLeftPit() {
  console.log("Car left pit")
  const currentTime = Date.now()

  const t = currentTime - settings.carInPit

  const timebefore = settings.totalPitTime

  newSettings(prevSettings=>({
    ...prevSettings,
    carInPit: null,
    totalPitTime: timebefore + t
  }))
  console.log(timebefore + t)
  const userRef = doc(db, "users", currentUser.uid);
  updateDoc(userRef, {carInPit: null,totalPitTime:timebefore+t}, {merge: true})
}

function resetPitTimes() {
  newSettings(prevSettings=>({
    ...prevSettings,
    totalPitTime: 0,
    carInPit:null,
  }))
  const userRef = doc(db, "users", currentUser.uid);
  updateDoc(userRef, {totalPitTime: 0,carInPit:null}, {merge: true})
}


// Function To Extract the coordinates of each car to name and [lat,lon]
const getCarCoordinates = (each) => {
  if (!telemetry[each.car_number-1]) {return null}

  return { name: each.car_name,
           location: [telemetry[each.car_number-1].Lat,telemetry[each.car_number-1].Lon] }

}



// updates the race time every second with the elapsed time in minutes and seconds
useEffect(() => {
  const timerInterval = setInterval(() => {
    setRaceTime(elapsedTimeIntoString())
    setRaceTimeValue(elapsedTimeIntoValue())
  }, 100)
  return () => clearInterval(timerInterval);
},[raceStart]);

  

  return (
    <>
      
    <MenuBar />
    <h2 className="home-page-card--title py-3">{currentUser.displayName} Dashboard</h2>
    {errorFetching>8 && 
    <div className="alert alert-warning mx-2 d-flex flex-column homepage-dash ">
      <p className="text-center">Unable to fetch data from car.</p>
      <div className="m-auto">
      <ul>
        <li>Dweet Thing name may be inputted incorrectly.</li>
        <li>Check that Dweet Thing is receiving data from car.</li>
      </ul>
      </div>
    </div>}
    
    <div className="d-flex homepage-dash flex-column">
      {settings?.dweet_name && <DataLastReceived time={dataLastReceived}/>}
      {settings?.cars ? settings.cars.map((car,index) => (
      <CarSummary name={'Car '+(index+1)+': '+car.car_name} telemetry={telemetry} settings={settings} index={index}/>)) : <p>No cars...</p>}
      <br></br>
      <div className="card-dash car-summary border rounded-3" id="raceTimer">
      <div className="card-header">
          <h3 className="card-title mt-1 text-center">Race {raceTime}</h3>
      </div>
      <div className="card-body">
          <progress className="progress" min="0" max={raceLength} value={raceTimeValue} ></progress>
          <div className="btn-group w-100 mt-2">
              <button disabled={raceStart} onClick={handleStart} className="btn btn-primary btn-block ">Start</button>
              <button disabled={!raceStart} onClick={handleReset} onBlur={handleUnfocusReset} className={"btn btn-block "+resetButton} >Reset</button>
              <Link to="/configure?2" className="btn btn-primary btn-block">Setup</Link>
          </div>
      </div>
  </div>

    <div class="card car-summary" id="raceTimer" hidden>
          <div class="card-header">
              <h3 class="card-title mt-1 text-center">Pit Stop</h3>      
          </div>
          <div class="card-body">
              <h3>{settings?.totalPitTime/1000}s</h3>
              <div class="btn-group w-100 mt-2">
                  
                  <button onClick={handleCarInPit} class="btn btn-primary btn-block ">Car In Pit</button>
                  
                  <button disabled={!settings?.carInPit} onClick={handleCarLeftPit}class="btn btn-primary btn-block">Car Left Pit</button>
                  
                  <button onClick={resetPitTimes} className="btn btn-primary btn-block">Reset</button>
              </div>
          </div>
      </div>

      <br></br>
   
      {(settings && settings.summaryMap==='Enabled') ? 
      <LocationMap telemetry={telemetry} settings={settings} locationData={
        [
          { 
          name : (telemetry[0]?.Lat) ? settings?.cars[0]?.car_name : 'No Location Data',
          location : telemetry[0]?.Lat ? [telemetry[0]?.Lat,telemetry[0]?.Lon] : [50.8724,-0.7389]
        } 
        ]} /> 
        : 
        <></>}

      {(settings && settings.lapSummaryTable==='Enabled') ? 
      <LapSummary settings={settings} runningData={runningData}/> 
      : 
      <></> }
    </div>
   
    
    </>
  )
}


// <DataLastReceived time={dataLastReceived}/>
// 
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