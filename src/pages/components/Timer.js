import React, { useState } from 'react'
import { useEffect } from 'react'

export default function Timer() {
    const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'

    
    const [raceStart,setRaceStart] = useState()
    const [raceTime,setRaceTime] = useState()
    const [raceTimeValue,setRaceTimeValue] = useState()

    const [settings,newSettings] = useState({})

    useEffect(() => {
        console.log('useEffect called with empty dependency array');
        try {
        const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
        if (storedSettings) {newSettings(storedSettings)};  
        } catch (e) {console.log(e)}
      },[])
     
    
      // save settings to local storage on settings change
      useEffect(() => {
        console.log('useEffect called with settings dependency');
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
      },[settings])
    
      // set state start time on component load
      useEffect(()=>{
        console.log('useEffect called with raceStart dependency');
        if (settings.raceStart){
        setRaceStart(settings.raceStart)
        }
      },[settings])

      function timeSinceStart() {
        const currentTime=Date.now()
        if (settings.raceStart) {
          const elapsedTime=currentTime-settings.raceStart
          return elapsedTime
        } else {
          return null
        }
      }

    function elapsedTimeIntoValue() {
        const elapsedTime = timeSinceStart()
        return elapsedTime/1000/60
    }

    function elapsedTimeIntoString() {
        const elapsedTime = timeSinceStart()
        const mins=Math.floor(elapsedTime/1000/60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const seconds=Math.round((elapsedTime/1000)%60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const string = `${mins}:${seconds}`
        
        return string
      }

      useEffect(() => {
        console.log(raceStart)
        const interval = setInterval(() => {
          setRaceTime(elapsedTimeIntoString())
          setRaceTimeValue(elapsedTimeIntoValue())
        }, 100)
        return () => clearInterval(interval);
      },[raceStart]);
    
  return (
    <>
    <div class="gauge-holder">
        <progress class="progress" min="0" max="90" value={raceTimeValue}></progress>
    </div>
    <div class="elapsedTime">{raceTime}</div>
    </>
  )
}


//useEffect(()=>{
//    const interval = setInterval(timeSinceStart,1000);
//    console.log("hi")
//    return () => clearInterval(interval);
//  })