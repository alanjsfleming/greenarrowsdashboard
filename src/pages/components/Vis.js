import React from 'react'
import Gauge from './Gauge'

import Timer from './Timer'
export default function Vis(type,units,data,settings) {

// Rewrite this function to make it neater, choose vis type based on type specified, set upper and lower, title etc...

    function determineVisualisation(props) {

        if (props.kind==="gauge") {
           
            if (props.units==='V') {
                return <Gauge data={props.data} upper="30" lower="0" title={props.title}/>
            } else if (props.units==='A') {
                return <Gauge data={props.data} upper="40" lower="0" title={props.title}/>
            } else if (props.units==="th Gear") {
                if (isNaN(props.data)) {
                    return <a href="#settings" class="btn btn-warning">Missing gear sizes<br></br>Click here to go to settings</a>
                } else {
                return <Gauge data={Math.abs(props.data)} upper="11" lower="7" title={props.title}/>
                }
            } else if (props.units==="%") {
                if (isNaN(props.data)) {
                    return <a href="#settings" class="btn btn-warning">Missing Ah of battery<br></br>Click here to go to settings</a>
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
                if (!props.settings.timeStamp) {
                    return <a href="#settings" class="btn btn-warning">Timer not started<br></br>Click here to go to settings</a>
                } else {
                return <Timer settings={props.settings}/>
                }
            }
            
        }
    }

  return (
    determineVisualisation(type,units,data)
  )
}
