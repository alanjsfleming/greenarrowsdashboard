import React, { useState, useRef, useEffect } from 'react';
import "../App.css"
import MenuBar from '../layouts/MenuBar'
import Telemetry from "./components/Telemetry"

import WaitingForData from '../layouts/WaitingForData';
import { Link } from 'react-router-dom';
import { useTelemetry } from '../contexts/TelemetryContext';
import { useDatabase } from '../contexts/DatabaseContext';



// This should work dynamically for whatever car is selected.
// /details/:carID
// This will be a page that shows the details of the car selected when :carID's owner is the current user

function App() {
  // State variables
  const { telemetry } = useTelemetry()
  
  
  const [fetchURL,setFetchURL] = useState()

  const { userSettings, carsSettings, elapsedRaceTime } = useDatabase()

  const [settings, newSettings] = useState()

// function handleUpdateTelemetry(e) {
//  newTelemetry(handleGetDweet(settings.cars[0].dweet_name))
//  console.log(telemetry)
// }


  
  // Page Starts here

  return (
    <>

    <MenuBar/>
    {(telemetry && userSettings && carsSettings[0]) ? 
    <Telemetry telemetry={telemetry} settings={userSettings} carsSettings={carsSettings[0]}/>
    :
    (settings?.dweet_name) ?
      <div className="w-75 mx-auto mt-5">
        <WaitingForData />
      </div>
    : 
    <div className="w-75 mx-auto mt-5">
      <Link to={`/configure?${4}`} className="btn btn-warning btn-block">Set Dweet Thing Name Here</Link>
    </div>
    }
  
    </>
  );
}
export default App;
