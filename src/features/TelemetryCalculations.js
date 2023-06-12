import React from 'react'

export function estimateGear(Spd,RPM,bG) {
    // Spd is Speed from the Telemetry
    // RPM is RPM from the Telemetry
    // bG is the number of teeth on the large gear from the settings

    if (!bG) {
        return NaN // If the large gear is not set to anything, return NaN so it throws an error in the UI
    }

    // Calculate the wheel RPM
    // 59.44 is the wheel diameter I believe!
    let wheelRPM = Spd / (59.44 * 60 / 63360 );
    let gearRatio = RPM / wheelRPM;
    let numTeethMotor = bG / gearRatio;

    // 0.5 is an offset to make the gear number more accurate, possibly add a setting for this?

    // not sure what 21 is for, but it works.

    let gearNumber = Math.round(21.5 - numTeethMotor);

    return(gearNumber);
}

export function calculateBatteryPercent(AhUsed,AhTotal) {
    if (!AhTotal) {
        return NaN // If the total Ah is not set to anything, return NaN so it throws an error in the UI
    }
    // Calculate the percent of battery remaining
    const percent = ((AhTotal - AhUsed) / AhTotal * 100).toFixed(1)
    return percent
}


// Honestly this function is completely stupid but I am keeping it for now.
// This would be better when I get an actual formula.
// Go back to motor experiments and enter the data into excel to get the equation of the line.
export function calculateMotorEfficiency(Vt,A,T) {
    // Vt = Voltage of both Batteries, A = Amps being drawn by motor, idk what T is
    const efficiency = 1.6655 + 0.003 * Vt + 0.0026 * A - 0.0429 * T
    const output = Math.round(efficiency * 100)
    return output
}
