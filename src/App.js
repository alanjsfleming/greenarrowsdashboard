
import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './Dashboard';

/*import { useState,useEffect } from 'react';*/
const ga1dweetname='https://dweet.io/get/latest/dweet/for/Albyn1'






function App() {
  const [telemetry, newTelemetry] = useState([]);
  const carSettingsRef = useRef();
  

  function handleSaveCarSettings(e) {
    const bigGear = carSettingsRef.current.value
    console.log(carSettingsRef.current.value)
    return bigGear
  };

  function handleUpdateTelemetry(e) {
    fetch(ga1dweetname)
    .then((response)=>response.json())
    .then((data)=> { 
      console.log(data.with[0].content)
      newTelemetry([data.with[0].content])
    });
  }

  useEffect(()=>{
    const interval = setInterval(handleUpdateTelemetry,1500);
    return () => clearInterval(interval);
  })


  return (
    <>
    <Dashboard telemetry={telemetry}/>
    <label>Number of teeth on big gear</label>
    <input id="bigGear" ref={carSettingsRef} type="number"/>
    <button onClick={handleSaveCarSettings}>Save</button>
    <label>Total Amp hours of Batteries</label>
    <input id="ampHours" ref={carSettingsRef} type="number"/>
    <button onClick={handleSaveCarSettings}>Save</button>
    <button onClick={handleUpdateTelemetry}>Update Data</button>
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