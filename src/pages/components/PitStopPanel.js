import React,{useEffect, useState} from 'react'
import elapsedTimeIntoString from '../../utils/TimeFunctions'
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function PitStopPanel({totalPitTime}) {

    const { currentUser } = useAuth(); // get the current user from the auth context

    const [carInPit,setCarInPit] = useState(false) // state to track if the car is in the pit or not

    const [pitStart,setPitStart] = useState(null) // state to track the time the car has been in the pit this time

    const [totalPitDuration,setTotalPitDuration] = useState() // state to track the time the car has been in the pit this time

    const [pitDuration,setPitDuration] = useState() // state to track the time the car has been in the pit this time

    // Get the total time in pits so far from the settings to display on the pit stop panel

    useEffect(()=>{
        if (carInPit===true) {
            console.log("hello")
            setPitStart(Date.now())
            const tempNow = Date.now()
            const pitTimerInterval = setInterval(() => {
                
                setPitDuration(elapsedTimeIntoString(Date.now()-pitTimerInterval))
            }
            , 100)
            return () => clearInterval(pitTimerInterval);
        } else {
            // add the pit timer to the totalPitTime setting in firebase
            const userRef = doc(db, "users", currentUser.uid);
            pitStart && updateDoc(userRef, {totalPitTime: Date.now()-pitStart}, {merge: true}) // update the total pit time in firebase, using conditional so it doesnt set it to null on page load
            setPitStart(null) // reset the pit start time
          
        }
    },[carInPit])

    // car in pit should start a timer that counts up to track how long the car is in the pit

  return (
    <div hidden class="card car-summary" id="raceTimer">
        <div class="card-header">
            <h3 class="card-title mt-1 text-center">Pit Stop</h3>
            
        </div>
        <div class="card-body">
            <h3 className="text-center">{totalPitDuration}</h3>

            {pitStart && <p className="text-center fs-">{pitDuration}</p>}

            <div class="btn-group w-100 mt-2">
                {(!carInPit===true) ?
                <button onClick={()=>{setCarInPit(true)}} class="btn btn-primary btn-block ">Car In Pit</button>
                :
                <button onClick={()=>{setCarInPit(false)}}class="btn btn-primary btn-block">Car Left Pit</button>
                }
                <button disabled={!pitDuration} className="btn btn-primary btn-block">Reset</button>
            </div>
        </div>
    </div>
  )
}
