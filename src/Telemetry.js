import React from 'react'


function estimateGear(Spd,RPM) {
    let wheelRPM=Spd/(59.44*60/63360);
    let gearRatio=RPM/wheelRPM;
    let numTeethMotor=58/gearRatio;
    let gearNumber=Math.round(21.5-numTeethMotor);
    return(gearNumber);
  }

  

export default function Telemetry({telemetry}) {
  return (
    <>
    <div class="gauge gear">Estimated Gear : {estimateGear((telemetry.Spd*2.237),telemetry.RPM)}</div>
    <div class="gauge">Vt : {telemetry.Vt}</div>
    <div>V1 : {telemetry.V1}</div>
    <div>V2 : {telemetry.Vt-telemetry.V1}</div>
    <div>A : {telemetry.A}</div>
    <div>Motor RPM : {telemetry.RPM}</div>
    <div>Speed : {telemetry.Spd*2.237}</div>
    <div>Throttle : {telemetry.Thrtl}</div>
    <div>Amp Hours : {telemetry.AH}</div>
    <div>Lap : {telemetry.lap}</div>
    <div>Temperature 1 : {telemetry.Tmp1}</div>
    <div>Temperature 2 : {telemetry.Tmp2}</div>
    <div>Break : {telemetry.Brk}</div>
    <div>Distance : {telemetry.Distance}</div>
    </>
  )
}
