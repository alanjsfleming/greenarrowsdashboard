
import React, { useState, useRef } from 'react';
import Dashboard from './Dashboard';

/*import { useState,useEffect } from 'react';*/
const ga1dweetname='https://dweet.io/get/latest/dweet/for/Albyn1'


function estimateGear(Spd,RPM) {
  let wheelRPM=Spd/(59.44*60/63360);
  let gearRatio=RPM/wheelRPM;
  let numTeethMotor=58/gearRatio;
  let gearNumber=Math.round(21.5-numTeethMotor);
  return(gearNumber);
}




function App() {
  const [telemetry, newTelemetry] = useState([]);
  const carSettingsRef = useRef();
  

  function handleSaveCarSettings(e) {
    const bigGear = carSettingsRef.current.value
    console.log(carSettingsRef.current.value)
    return bigGear
  };

  function handleUpdateTelemetry(e) {
    console.log("hello")
    console.log(fetch(ga1dweetname).json)
    
    
    return
  };

  return (
    <>
    <Dashboard telemetry={telemetry}/>
    <label>Number of teeth on big gear</label>
    <input ref={carSettingsRef} type="number"/>
    <button onClick={handleSaveCarSettings}>Save</button>
    <button onClick={handleUpdateTelemetry}>Update</button>
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