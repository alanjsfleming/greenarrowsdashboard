import React from 'react'
import TelemetryCard from './TelemetryCard';

// Estimate gear, based on GA1. 59.44 is wheel diameter so this wont work for other cars. Change that.
// Is it diameter or circumference????
// Change This function to return the gear number from the telemetry data if reverse gear mode is not selected.
function estimateGear(Spd,RPM,bG) {
  if (!bG){
    return NaN
  } else {
  // change the 59.44 to the wheel diameter
  let wheelRPM=Spd/(59.44*60/63360);
  let gearRatio=RPM/wheelRPM;
  let numTeethMotor=bG/gearRatio;
  // 0.5 is an offset to make the gear number more accurate, possibly add a setting for this?
  // not sure what 21 is for, but it works.
  let gearNumber=Math.round(21.5-numTeethMotor);
  return(gearNumber);
  }
}

// Calculate % Battery remaining
function calculateBatteryPercent(ah,ahtotal) {
  if (!ahtotal){
    return NaN
  } else {
  const percent = ((ahtotal-ah)/ahtotal*100).toFixed(1)
  return percent
  }
} 

// Calculate motor efficiency.
function calculateMotorEfficiency(Vt,A,T) {
  const efficiency = 1.6655+0.003*Vt+0.0026*A-0.0429*T
  const output = Math.round(efficiency*100)
  return output
}

// Enter your own equation
//https://mycurvefit.com/
// Excel can get equation of line, go back to Motor experiments and enter

//<div class="grid-item">
//<TelemetryCard title="Time Elapsed:" units="minutes:seconds" kind="gauge" settings={settings}/>
//</div>
//
//
// Make this populate with only as many as I want, render all of them but have hidden class?
export default function Telemetry({telemetry,settings}) {


  return (
    <>
    <div class="grid-items telemetry">
      <div class="grid-item">
        <TelemetryCard title="Time Elapsed:" units="minutes:seconds" kind="gauge" settings={settings}/>
      </div>

      <div class="grid-item">
        <TelemetryCard title="Estimated Gear:" data={estimateGear((telemetry.Spd*2.237),telemetry.RPM,settings.teethGear)} units="th Gear" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Battery:" data={calculateBatteryPercent(telemetry.AH,settings.ampHours)} units="%" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Vt:" data={telemetry.Vt} units="V" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Amp Hours per Lap:" data={telemetry.AH/telemetry.lap} units="Ah/Lap" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Motor Efficiency:" data={calculateMotorEfficiency(telemetry.Vt,telemetry.A,telemetry.Tmp1)} units="%" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="V1" data={telemetry.V1} units="V" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="V2:" data={telemetry.Vt-telemetry.V1} units="V" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="A:" data={telemetry.A} units="A" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Motor RPM:" data={telemetry.RPM} kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Speed:" data={(telemetry.Spd*2.237).toFixed(1)} units="mph" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Throttle:" data={telemetry.Thrtl} units="%" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Amp Hours used:" data={telemetry.AH} units="Ah" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Laps:" data={telemetry.Lap} units="" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Motor Temperature:" data={telemetry.Tmp1} units="&deg;C" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Battery Temperature:" data={telemetry.Tmp2} units="&deg;C" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Brake:" data={telemetry.Brk} units="" kind="gauge"/>
      </div>
      <div class="grid-item">
        <TelemetryCard title="Distance:" data={telemetry.Distance} units="" kind="gauge"/>
      </div>
    </div>
   
    </>
  )
}


/* <div class="card">
        <div class="card-body">
          <h5 class="card-title">Estimated Gear:</h5>
          <h6 class="card-text">{estimateGear((telemetry.Spd*2.237),telemetry.RPM,settings.bigGear)}</h6>
        </div>
      </div>
      */