import React from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import RacePanel from './components/RacePanel'
import { useAuth } from '../contexts/AuthContext'
import MenuBar from './components/MenuBar'


// Pass the timer as a prop through to the details page
export default function HomePage() {

  const { currentUser } = useAuth()




  return (
    <>
    <MenuBar />
    <h2 class="home-page-card--title">{currentUser.displayName} Dashboard</h2>
    <CarSummary name={'GA1'}/>
    <br></br>
    <RacePanel />
    
   
    
    </>
  )
}

// <RacePanel />