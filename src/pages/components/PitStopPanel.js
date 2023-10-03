import React,{useEffect, useState} from 'react'
import { elapsedTimeIntoString } from '../../utils/TimeFunctions'

export default function PitStopPanel({totalPitTime}) {

    const [carInPit,setCarInPit] = useState(false)

    const [pitTimer,setPitTimer] = useState(null)

    // Get the total time in pits so far from the settings to display on the pit stop panel


    useEffect(()=>{
        if (carInPit===true) {
            setPitTimer(Date.now())
            console.log("hello")
        } else {
            // add the pit timer to the totalPitTime setting in firebase and local storage and reset the pit timer
            setPitTimer(null)
        }
    },[carInPit])

    // car in pit should start a timer that counts up to track how long the car is in the pit

  return (
    <div class="card car-summary" id="raceTimer">
        <div class="card-header">
            <h3 class="card-title mt-1 text-center">Pit Stop</h3>
        </div>
        <div class="card-body">

            {pitTimer && <p className="text-center fs-">{elapsedTimeIntoString(Date.now()-pitTimer)}</p>}

            <div class="btn-group w-100 mt-2">
                {(!carInPit===true) ?
                <button onClick={()=>{setCarInPit(true)}} class="btn btn-primary btn-block ">Car In Pit</button>
                :
                <button onClick={()=>{setCarInPit(false)}}class="btn btn-primary btn-block">Car Left Pit</button>
                }
            </div>
        </div>
    </div>
  )
}
