import React, { useEffect,useState } from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import RacePanel from './components/RacePanel'
import { useAuth } from '../contexts/AuthContext'
import MenuBar from './components/MenuBar'
import LapSummary from './components/LapSummary'
import { useRace } from '../contexts/RaceContext'
import { doc, getDoc,collection,query,where,getDocs, orderBy } from "firebase/firestore";
import { analytics, db } from '../firebase'
import { logEvent } from 'firebase/analytics'
import LocationMap from './components/LocationMap'
import { rtdb } from '../firebase'
import { ref, onValue,push,once } from "firebase/database";

// need to pass the car running data array to where it is consumed
// teams/teamid/carid
// need to store the carid somewhere in the settings

// When new data point is taken, compare it to running data array to see if its,
// Actually a new datapoint, if it is then push to the array in realtime database
// with timestamp added



export default function HomePage() {
  // Send a page view event to Firebase Analytics
  useEffect(() => {
    logEvent(analytics,'summary_page_view')
  })


  const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'
  
  const [telemetry, newTelemetry] = useState([]);
  const [settings, newSettings] = useState()
  const [errorFetching, setErrorFetching] = useState(0)
  const [fetchURL,setFetchURL] = useState()
  const { currentUser } = useAuth()

  const { resetrace,startTime,startrace } = useRace()

  const [resetButton,setResetButton] = useState('btn-primary')
  const [raceStart,setRaceStart] = useState()
  const [raceLength,setRaceLength] = useState(90)

  const [raceTime,setRaceTime] = useState()
  const [raceTimeValue,setRaceTimeValue] = useState()

  // settings.cars[i].running_data should be always equal to the realtime database entry for that car
  // function to set the settings state to the realtime database entry for that car
  function syncCarDataWithRealtimeDatabase() {
    //car_num = car_num - 1
    //const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[car_num].id}`)
    
  }

  useEffect(() => {
    console.log('useEffect called with empty dependency array');
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
    }))
    
    }).catch((error) => {
      console.log("Error getting user document:", error);
    });
    const carQuery = query(carsRef, where("owner","==",currentUser.uid), orderBy("car_number"))
    const querySnapshot = getDocs(carQuery).then((querySnapshot) => {
      let carArray = []
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
    try {
      const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[0].id}`)
      onValue(rtCarRef, (snapshot) => {
        const data = snapshot.val();  
        newSettings(prevSettings => ({
          ...prevSettings,
          cars:prevSettings.cars.map((car,i) => {
            if (i === 0) {
              return {...car,running_data:data}
            }
            return car
          })
          }))
          console.log("successfully synced car data with realtime database")
      }, (error) => {
        console.log("Error: " + error.code);
      });} catch (e) {}
  },[settings])
  
  
  
  // Fetch from the dweet every 1.5s
  function handleUpdateTelemetry(e) {
    setFetchURL('https://dweet.io/get/latest/dweet/for/'+settings.cars[0].dweet_name)
    fetch(fetchURL)
    .then((response)=>response.json())
    .then((data)=> { 
      setErrorFetching(0)
      newTelemetry([data.with[0].content])
     
     }
     
    )
    .catch(e =>{
      console.log('undefined')
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
    try {
      
    } catch {}
    
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

// When race is running, save each request to local storage settings.running_data array
// function to append data packet to settings.running_data array
function appendDataToSettings(data,car_num) {
  // this needs to be changed for when multiple cars...
  const carId = settings.cars[car_num-1].id

  // Store the data in firebase realtime database
  const rtDocRef = ref(rtdb, `teams/${currentUser.uid}/${carId}`)

  // the 1 is the car num
  syncCarDataWithRealtimeDatabase(1)
  // Check the datapoint against the previous points to see if duplicate
  
  // get last datapoint from realtime database
  const lastDataPoint = settings.cars[0].running_data.at(-1)
 
  // if the last datapoint is the same as the current datapoint, don't push it
  if (lastDataPoint && (lastDataPoint.timestamp < (data.timestamp+1000))) {
    return
  } else {
    // If it passes then Push the data to the realtime database
    push(rtDocRef, data)
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
      {settings ? settings.cars.map((car,index) => (
      <CarSummary name={'Car '+(index+1)+': '+car.car_name} telemetry={telemetry}/>)) : <p>No cars...</p>}
      <br></br>
      <div class="card-dash car-summary" id="raceTimer">
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
      {(settings && settings.summaryMap==='Enabled') ? 
      <LocationMap settings={settings} locationData={
        [
          { 
          name : (telemetry.Lat && settings) ? settings.cars[0].car_name : 'No GPS data',
          location : (telemetry.Lat) ? [telemetry.Lat,telemetry.Lon] : [57.1189133,-2.1351633]
        } 
        ]} /> 
        : 
        <></>}

      {(settings && settings.lapSummaryTable==='Enabled') ? 
      <LapSummary settings={settings}/> 
      : 
      <></> }
    </div>
   
    
    </>
  )
}

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