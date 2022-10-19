import React from 'react'


function estimateGear(Spd,RPM,bG) {
    let wheelRPM=Spd/(59.44*60/63360);
    let gearRatio=RPM/wheelRPM;
    let numTeethMotor=bG/gearRatio;
    let gearNumber=Math.round(21.5-numTeethMotor);
    return(gearNumber);
  }

function calculateBatteryPercent(ah,ahtotal) {
  const percent = ((ahtotal-ah)/ahtotal*100).toFixed(1)
  return percent
} 

export default function Telemetry({telemetry,settings}) {
  return (
    <>
    <div class="grid-container">
    <div class="telem gauge gear">Estimated Gear : {estimateGear((telemetry.Spd*2.237),telemetry.RPM,settings.bigGear)}</div>
    <div class="telem battery">Battery : {calculateBatteryPercent(telemetry.AH,settings.ampHours)}%
    
    </div>
    <div class="telem gauge">Vt : {telemetry.Vt}V</div>
    <div class="telem gauge">V1 : {telemetry.V1}V</div>
    <div class="telem gauge">V2 : {telemetry.Vt-telemetry.V1}V</div>
    <div class="telem gauge">A : {telemetry.A}A</div>
    <div class="telem gauge">Motor RPM : {telemetry.RPM}</div>
    <div class="telem gauge">Speed : {(telemetry.Spd*2.237).toFixed(1)} mph</div>
    <div class="telem gauge">Throttle : {telemetry.Thrtl}%</div>
    <div class="telem">Amp Hours used: {telemetry.AH}Ah</div>
    <div class="telem gauge">Lap : {telemetry.lap}</div>
    <div class="telem thermometer">Temperature 1 : {telemetry.Tmp1}&deg;C</div>
    <div class="telem thermometer">Temperature 2 : {telemetry.Tmp2}&deg;C</div>
    <div class="telem">Break : {telemetry.Brk}></div>
    <div class="telem">Distance : {telemetry.Distance}</div>
    </div>
    </>
  )
}
