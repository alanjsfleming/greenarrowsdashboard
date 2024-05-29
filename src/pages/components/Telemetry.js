import React from 'react'
import TelemetryCard from './TelemetryCard';
import { estimateGear,calculateBatteryPercent,calculateMotorEfficiency } from '../../features/TelemetryCalculations';

/*
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
*/
// Enter your own equation
//https://mycurvefit.com/
// Excel can get equation of line, go back to Motor experiments and enter

//<div class="grid-item">
//<TelemetryCard title="Time Elapsed:" units="minutes:seconds" kind="gauge" settings={settings}/>
//</div>
//
//
// Make this populate with only as many as I want, render all of them but have hidden class?
export default function Telemetry({telemetry,settings,carsSettings}) {
  
  console.log(telemetry)
  return (
    <>
    <div class="grid-items telemetry">

    
      <div class="grid-item border mt-1 rounded-3">
        <TelemetryCard title="Time Elapsed:" units="minutes:seconds" kind="gauge" settings={settings}/>
      </div>

      <div class="grid-item border rounded-3">
        <TelemetryCard title="Estimated Gear:" data={carsSettings[0]?.reverse_gearing_mode ? estimateGear((telemetry?.content?.Spd*2.237),telemetry?.content?.RPM,carsSettings[0]?.axle_gear_teeth) : telemetry.content?.Gear} units="th Gear" kind="gauge"/>
      </div>

      <div class="grid-item border rounded-3">
        <TelemetryCard title="Battery:" data={calculateBatteryPercent(telemetry?.content?.AH,carsSettings?.battery_capacity)} units="%" kind="gauge"/>
      </div>
      
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Vt:" data={telemetry?.content?.Vt} units="V" kind="gauge"/>
      </div>

      <div class="grid-item border rounded-3" hidden>
        <TelemetryCard title="Amp Hours per Lap:" data={telemetry?.content?.AH/telemetry?.content?.lap} units="Ah/Lap" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3" hidden>
        <TelemetryCard title="Motor Efficiency:" data={calculateMotorEfficiency(telemetry?.content?.Vt,telemetry?.content?.A,telemetry?.content?.Tmp1)} units="%" kind="gauge"/>
      </div>
     
      <div class="grid-item border rounded-3">
        <TelemetryCard title="V1" data={telemetry?.content?.V1} units="V" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3">
        <TelemetryCard title="V2:" data={telemetry?.content?.Vt-telemetry?.content?.V1} units="V" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3">
        <TelemetryCard title="A:" data={telemetry?.content?.A} units="A" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Motor RPM:" data={telemetry?.content?.RPM} kind="gauge"/>
      </div>

      {telemetry?.content?.Spd &&
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Speed:" data={(telemetry?.content?.Spd*2.237).toFixed(1)} units="mph" kind="gauge"/>
      </div>}


      {telemetry?.content?.Thrtl &&
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Throttle:" data={telemetry?.content?.Thrtl} units="%" kind="gauge"/>
      </div>}


      <div class="grid-item border rounded-3">
        <TelemetryCard title="Amp Hours used:" data={telemetry?.content?.AH} units="Ah" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Laps:" data={telemetry?.content?.Lap} units="" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Motor Temperature:" data={telemetry?.content?.Tmp1} units="&deg;C" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Battery Temperature:" data={telemetry?.content?.Tmp2} units="&deg;C" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3">
        <TelemetryCard title="Brake:" data={telemetry?.content?.Brk} units="" kind="gauge"/>
      </div>
      <div class="grid-item border rounded-3 mb-1">
        <TelemetryCard title="Distance:" data={telemetry?.content?.Distance} units="" kind="gauge"/>
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

      /* <div class="grid-item">
        <LocationMap settings={settings} locationData={
          [
            {
              name : 'GA1',
              location : (telemetry.Lat) ? [telemetry.Lat,telemetry.Lon] : [52,-2]
            }
          ]
        }/>
      </div>*/

/*


  */