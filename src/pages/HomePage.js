import React, { useEffect,useState } from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import RacePanel from './components/RacePanel'
import { useAuth } from '../contexts/AuthContext'
import MenuBar from './components/MenuBar'
import LapSummary from './components/LapSummary'


// Pass the timer as a prop through to the details page
export default function HomePage() {
  const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'
  
  const [telemetry, newTelemetry] = useState([]);
  const [settings, newSettings] = useState()
  const [errorFetching, setErrorFetching] = useState(0)

  const { currentUser } = useAuth()

 

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
      <RacePanel />
      <br></br>
      <LapSummary />
    </div>
   
    
    </>
  )
}

// <RacePanel />