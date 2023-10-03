import React,{useEffect,useState} from 'react'
import Gauge from './Gauge'
import { Link } from 'react-router-dom'
import Timer from './Timer'
import { useRace } from '../../contexts/RaceContext'


export default function Vis(type,units,data) {

    const [raceStart,setRaceStart] = useState()
    const {startTime} = useRace()

    useEffect(()=>{
        setRaceStart(startTime)
      },[startTime])
// Rewrite this function to make it neater, choose vis type based on type specified, set upper and lower, title etc...

    function determineVisualisation(props) {

        if (props.kind==="gauge") {
           
            if (props.units==='V') {
                return <Gauge data={props.data} upper="30" lower="0" title={props.title}/>
            } else if (props.units==='A') {
                return <Gauge data={props.data} upper="40" lower="0" title={props.title}/>
            } else if (props.units==="th Gear") {
                if (isNaN(props.data)) {
                    return <Link to="/configure?1" class="btn btn-warning">Missing gear sizes<br></br>Click here to go to settings</Link>
                } else {
                return <Gauge data={Math.abs(props.data)} upper="11" lower="7" title={props.title}/>
                }
            } else if (props.units==="%") {
                if (isNaN(props.data)) {
                    return <Link to="/configure?1" class="btn btn-warning">Missing Ah of battery<br></br>Click here to go to settings</Link>
                } else {
                return <Gauge data={props.data} upper="100" lower="0" title={props.title}/>
                }
            } else if (props.units==="Ah/Lap") {
                if (isNaN(props.data)){
                    return <p class="btn btn-warning">No lap data</p>
                } else {
                return <Gauge data={props.data} upper="10" lower="0" title={props.title}/>
                }
            } else if (props.units==="minutes:seconds") {
                if (raceStart<1) {
                    return <Link to="/" style={{color:'inherit',textDecoration:'inherit'}}><p class="btn btn-warning btn-block">Timer not started<br></br>Click here to start a race</p></Link>
                } else {
                return <Timer  settings={props.settings}/>
                }
            }
        }
    }

  return (
    determineVisualisation(type,units,data)
  )
}
