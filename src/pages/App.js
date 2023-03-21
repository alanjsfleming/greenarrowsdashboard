import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import "../App.css"
import MenuBar from './components/MenuBar'
import Loading from './Loading';

/*import { useState,useEffect } from 'react';*/

// This should work dynamically for whatever car is selected.
// Timer should carry across as it assumes racing at the same time. 




function App() {
  const [telemetry, newTelemetry] = useState([]);
  const [settings, newSettings] = useState([])
  const [fetchURL,setFetchURL] = useState()

  const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'
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

  // Timer functions

 

   // Functions to allow user to set amp hour variables

  
  // TODO - change this so it is a form and there is one submit button, updates together, settings modal??

  
  // Fetch from the dweet every 1.5s
  function handleUpdateTelemetry(e) {
    setFetchURL('https://dweet.io/get/latest/dweet/for/'+settings.dweetUrl)
    fetch(fetchURL)
    .then((response)=>response.json())
    .then((data)=> { 
     newTelemetry([data.with[0].content])
     console.log(telemetry)
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
    {(telemetry[0]) ? <Dashboard telemetry={telemetry} settings={settings}/> : <Loading />}
    </>
  );
}
export default App;
