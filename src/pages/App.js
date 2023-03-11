import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import "../App.css"
import MenuBar from './components/MenuBar'
import Configure from './components/Configure';
import Loading from './Loading';

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

  // Load saved settings from browser storage
  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
    if (storedSettings) {newSettings(storedSettings)};
  },[]) 
  // TODO - rewrite to load settings from firebase when 

  // When settings change, add them to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
  },[settings])
  // TODO - rewrite to save to firebase so user can have same settings wherever they login


  // When Gear setting saved, add to settings state
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
  // TODO - change this so it is a form and there is one submit button, updates together, settings modal??

  
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

  // Change the settings portion of this to a modal that pops up when you press a button on the menu bar.
  return (
    <>

    <MenuBar/>
    {(telemetry) ? <Dashboard telemetry={telemetry} settings={settings}/> : <Loading />}
  
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
