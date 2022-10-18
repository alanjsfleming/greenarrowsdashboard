import React from 'react';
import Dashboard from './Dashboard';
import { useState,useEffect } from 'react';
const dweetURL = 'https://dweet.io/get/latest/dweet/for/Albyn1'

function estimateGear(Spd,RPM) {
  let wheelRPM=Spd/(59.44*60/63360);
  let gearRatio=RPM/wheelRPM;
  let numTeethMotor=58/gearRatio;
  let gearNumber=Math.round(21.5-numTeethMotor);
  return(gearNumber);
}

function App() {
  return (
    <>
    <Dashboard />
    <input type="number"/>
    <button>Submit</button>
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