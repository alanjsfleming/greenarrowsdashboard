import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import "../App.css"
import MenuBar from './components/MenuBar'

/*import { useState,useEffect } from 'react';*/

// This should work dynamically for whatever car is selected.
// Timer should carry across as it assumes racing at the same time. 




function App() {
  const [telemetry, newTelemetry] = useState([]);
  const [settings, newSettings] = useState([])
  const GearSettingsRef = useRef();
  const AmpHourSettingsRef = useRef()
  const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'
  const cardweetname='https://dweet.io/get/latest/dweet/for/Albyn1'

  /* Load saved settings  */

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
    if (storedSettings) {newSettings(storedSettings)};
  },[]) 

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
  },[settings])

  function handleSaveGearSettings(e) {
    const bigGear = GearSettingsRef.current.value
    newSettings(prevSettings => ({
      ...prevSettings,
      bigGear:bigGear
      }))
  };

  // Timer functions

  function handleStartTimer(e) {
    const timeStamp=Date.now()
    newSettings(prevSettings => ({
      ...prevSettings,
      timeStamp:timeStamp
    }))
  }

  function handleResetTimer(e) {
    newSettings(prevSettings => {
      const {timeStamp, ...rest} = prevSettings;
      return rest
    });
  };

  // Functions to allow user to set amp hour variables

  function handleSaveAmpHourSettings(e){
    const ampHours = AmpHourSettingsRef.current.value
    newSettings(prevSettings => ({
      ...prevSettings,
      ampHours:ampHours
    }))
  }
  
  // Fetch from the dweet every 1.5s

  function handleUpdateTelemetry(e) {
    fetch(cardweetname)
    .then((response)=>response.json())
    .then((data)=> { 
     newTelemetry([data.with[0].content])
    });
  }

  useEffect(()=>{
    const interval = setInterval(handleUpdateTelemetry,1500);
    return () => clearInterval(interval);
  })

  // Page Starts here
  return (
    <>

    <MenuBar/>
    <Dashboard telemetry={telemetry} settings={settings}/>
    
    
      <div class="settings">
        <h5 id="settings">Settings:</h5>
        <br></br>
        <div>
          <label>Number of teeth on big gear (currently {settings.bigGear})</label>
          <input class="input-sm" ref={GearSettingsRef} type="number" defaultValue={settings.bigGear}/>
          <button class="btn btn-primary" onClick={handleSaveGearSettings}>Save</button>
        </div>
      <br></br>
        <div>
          <label>Total Amp hours of batteries (currently {settings.ampHours} )</label>
          <input class="input-sm" ref={AmpHourSettingsRef} type="number" defaultValue={settings.ampHours}/>
          <button class="btn btn-primary" onClick={handleSaveAmpHourSettings}>Save</button>
        </div>
      <br></br>
        <button class="btn btn-primary" onClick={handleUpdateTelemetry}>Update Telemetry</button>
        <div class="timer-button-container">
            <h6>Race Timer:</h6>
            <button class="btn btn-primary" onClick={handleStartTimer}>Start</button>
            <button class="btn btn-primary timer-button-right" onClick={handleResetTimer}>Reset</button>
        </div>
        <a href="#topOfPage" class="btn btn-primary goTopBtn">Go to top</a>
      </div>
 
    </>
  );
}

export default App;

/*
<div className="App">
      <header className="App-header">
        
        <h1>
          Green Arrows Dashboard
        </h1>
        <section class="primary-data">
          <div>
            <h3>BatteryPercent</h3>
          </div>
        </section>
        
      </header>
    </div>
    */