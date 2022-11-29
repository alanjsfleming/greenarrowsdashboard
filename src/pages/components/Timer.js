import React from 'react'
import { useEffect } from 'react'


export default function Timer(settings) {

    function timeSinceStart(settings,startTime) {
        const currentTime=Date.now()
        const elapsedTime=currentTime-settings.settings.timeStamp
        return elapsedTime
    }

    function elapsedTimeIntoValue(settings) {
        const elapsedTime = timeSinceStart(settings)
        return elapsedTime/1000/60
    }

    function elapsedTimeIntoString(settings) {
        const elapsedTime = timeSinceStart(settings)
        const mins=Math.floor(elapsedTime/1000/60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const seconds=Math.round((elapsedTime/1000)%60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const string = `${mins}:${seconds}`
        return string
    }

    useEffect(()=>{
        const interval = setInterval(timeSinceStart,1200);
        return () => clearInterval(interval);
      })
    
  return (
    <>
    <div class="gauge-holder">
        <progress class="progress" min="0" max="100" value={elapsedTimeIntoValue(settings)}></progress>
    </div>
    <div class="elapsedTime">{elapsedTimeIntoString(settings)}</div>
    </>
  )
}
