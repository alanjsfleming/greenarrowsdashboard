import React, {useEffect} from 'react'
import Gauge from './Gauge'
export default function Vis(type,units,data) {

/* Function to determine which kind of graph and the upper and lower limits to output */

    function determineVisualisation(kind) {

        if (kind.kind==="gauge") {
           
            if (kind.units==='V') {
                return <Gauge data={kind.data} upper="30" lower="0" title={kind.title}/>
            } else if (kind.units==='A') {
                return <Gauge data={kind.data} upper="40" lower="0" title={kind.title}/>
            } else if (kind.units==="th Gear") {
                return <Gauge data={Math.abs(kind.data)} upper="11" lower="7" title={kind.title}/>
            } else if (kind.units=="%") {
                return <Gauge data={kind.data} upper="100" lower="0" title={kind.title}/>
            }
            
        }
    }

  return (
    determineVisualisation(type,units,data)
  )
}
