import React from 'react'
import {Link}  from "react-router-dom"
import CarSummary from './components/CarSummary'
import RacePanel from './components/RacePanel'
import Timer from './components/Timer'



// Pass the timer as a prop through to the details page
export default function HomePage() {
  return (
    <>
    <div class="card home-page-card">
    <h2 class="home-page-card--title">Green Arrows Dashboard</h2>
    <CarSummary name={'Green Arrows 1'}/>
    <br></br>
    <Link to="/details" style={{color:'inherit',textDecoration:'inherit'}}><button class="btn btn-primary">Details</button></Link>
    
    </div>
    <RacePanel />
    </>
  )
}
