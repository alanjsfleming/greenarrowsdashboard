import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import "../App.css"
import MenuBar from '../layouts/MenuBar'
import Loading from './Loading';
import WaitingForData from '../layouts/WaitingForData';



// This should work dynamically for whatever car is selected.
// /details/:carID
// This will be a page that shows the details of the car selected when :carID's owner is the current user

function App() {
  // State variables
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
    try {
    setFetchURL('https://dweet.io/get/latest/dweet/for/'+settings.cars[0].dweet_name)
    } catch (error) {
      console.log(error)
    }
  },[settings])
  // TODO - rewrite to save to firebase so user can have same settings wherever they login

  
  // Fetch from the dweet every 1.5s
  function handleUpdateTelemetry(e) {
    setFetchURL('https://dweet.io/get/latest/dweet/for/'+settings.cars[0].dweet_name)
    fetch(fetchURL)
    .then((response)=>response.json())
    .then((data)=> { 
     newTelemetry([data.with[0].content])
     //console.log(telemetry)
    });
  }
 
// function handleUpdateTelemetry(e) {
//  newTelemetry(handleGetDweet(settings.cars[0].dweet_name))
//  console.log(telemetry)
// }

  useEffect(()=>{
    const interval = setInterval(handleUpdateTelemetry,1500);
    return () => clearInterval(interval);
  })


  // Page Starts here

  return (
    <>

    <MenuBar/>
    {(telemetry[0]) ? <Dashboard telemetry={telemetry} settings={settings}/> : <div className="w-75 mx-auto mt-5"><WaitingForData /></div>}
    </>
  );
}
export default App;
