import React from 'react'
import Gauge from './Gauge'
import Timer from './Timer'
export default function Vis(type,units,data,settings) {

/* Function to determine which kind of graph and the upper and lower limits to output */

    function determineVisualisation(kind) {

        if (kind.kind==="gauge") {
           
            if (kind.units==='V') {
                return <Gauge data={kind.data} upper="30" lower="0" title={kind.title}/>
            } else if (kind.units==='A') {
                return <Gauge data={kind.data} upper="40" lower="0" title={kind.title}/>
            } else if (kind.units==="th Gear") {
                if (isNaN(kind.data)) {
                    return <a href="#settings" class="btn btn-warning">Missing gear sizes<br></br>Click here to go to settings</a>
                } else {
                return <Gauge data={Math.abs(kind.data)} upper="11" lower="7" title={kind.title}/>
                }
            } else if (kind.units==="%") {
                if (isNaN(kind.data)) {
                    return <a href="#settings" class="btn btn-warning">Missing Ah of battery<br></br>Click here to go to settings</a>
                } else {
                return <Gauge data={kind.data} upper="100" lower="0" title={kind.title}/>
                }
            } else if (kind.units==="Ah/Lap") {
                if (isNaN(kind.data)){
                    return <p class="btn btn-warning">No lap data</p>
                } else {
                return <Gauge data={kind.data} upper="10" lower="0" title={kind.title}/>
                }
            } else if (kind.units==="minutes:seconds") {
                if (!kind.settings.timeStamp) {
                    return <a href="#settings" class="btn btn-warning">Timer not started<br></br>Click here to go to settings</a>
                } else {
                return <Timer settings={kind.settings}/>
                }
            }
            
        }
    }

  return (
    determineVisualisation(type,units,data)
  )
}
