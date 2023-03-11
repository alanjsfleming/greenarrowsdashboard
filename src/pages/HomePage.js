import React, { useEffect,useState } from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import RacePanel from './components/RacePanel'
import { useAuth } from '../contexts/AuthContext'
import MenuBar from './components/MenuBar'


// Pass the timer as a prop through to the details page
export default function HomePage() {

  const cardweetname='https://dweet.io/get/latest/dweet/for/Albyn1'
  const [telemetry, newTelemetry] = useState([]);

  const { currentUser } = useAuth()
  
  // Fetch from the dweet every 1.5s
  function handleUpdateTelemetry(e) {
    fetch(cardweetname)
    .then((response)=>response.json())
    .then((data)=> { 
     newTelemetry([data.with[0].content])
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
    <div class="d-flex flex-column">
      <CarSummary name={'GA1'} telemetry={telemetry}/>
      <br></br>
      <RacePanel />
    </div>
   
    
    </>
  )
}

// <RacePanel />