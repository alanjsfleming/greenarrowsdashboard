import React, { useEffect,useState } from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import RacePanel from './components/RacePanel'
import { useAuth } from '../contexts/AuthContext'
import MenuBar from './components/MenuBar'
import LapSummary from './components/LapSummary'


// Pass the timer as a prop through to the details page
export default function HomePage() {

  const cardweetname='https://dweet.io/get/latest/dweet/for/Albyn1'
  const [telemetry, newTelemetry] = useState([]);
  const [settings, newSettings] = useState()
  const [errorFetching, setErrorFetching] = useState(0)

  const { currentUser } = useAuth()
  
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
    const interval = setInterval(handleUpdateTelemetry,1500);
    return () => clearInterval(interval);
  })

  return (
    <>
    <MenuBar />
    <h2 class="home-page-card--title py-3">{currentUser.displayName} Dashboard</h2>
    {errorFetching>8 && <div class="alert alert-warning text-center mx-2">Unable to fetch data from car.<br></br> Check that Dweet has data.</div>}
    <div class="d-flex flex-column">
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