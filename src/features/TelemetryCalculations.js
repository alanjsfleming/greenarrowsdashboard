export function estimateGear(Spd,RPM,axle_gear_teeth) {
    // Spd : Speed from the Telemetry
    // RPM : RPM from the Telemetry
    // bG :  Number of teeth on the large gear
    if (!axle_gear_teeth) {
        return NaN // If the large gear is not set to anything, return NaN so it throws an error in the UI
    }

    let wheelRPM = Spd / (59.44 * 60 / 63360 ); // Calculate the wheel RPM, 59.44 is the wheel diameter I believe!
    let gearRatio = RPM / wheelRPM; // Calculate the gear ratio
    let numTeethMotor = axle_gear_teeth / gearRatio; // Number of teeth on the Driver Gear can be calculated from the gear ratio and the number of teeth on the large gear (driven)

    // 0.5 is an offset to make the gear number more accurate, possibly add a setting for this?
    // Im not sure why it is 21 but this gives the correct value for the green arrows car

    // 21 when gear 11 has 11 teeth and 22 when gear 11 has 12 teeth
    let gearNumber = Math.round(22.5 - numTeethMotor);

    return(gearNumber);
}

export function calculateBatteryPercent(AhUsed,AhTotal) {
    // AhUsed : Ah used by the car so far
    // AhTotal : Total Ah of the battery
    // AhOffset : Ah offset of the battery (positive number if it is reset during race)

    const AhOffset = 0 // This is 0 for now until the setting is added to the UI , but I would like this function to be written

    if (!AhTotal) {
        return NaN // If the total Ah is not set to anything, return NaN so it throws an error in the UI
    }
    // Calculate the percent of battery remaining
    const percent = ((AhTotal - AhUsed + AhOffset) / AhTotal * 100).toFixed(1)
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

export function calculatePlannedBatteryPercentage(AhPer5Mins,AhTotal,raceStartTime) {
    // Formula for calculating the planned battery percentage at a given time
    // AhPer5Mins is the planned Ah used per 5 minutes
    if (!AhPer5Mins) {
        return NaN // If the Ah per 5 minutes is not set to anything, return NaN so it throws an error in the UI
    }
    if (!raceStartTime) {
        return 100 // If race hasnt started yet, return 100% 
    }

    
    const timeElapsed = (Date.now() - raceStartTime) / 1000 / 60 // Time elapsed in minutes
    
    const percent = ((AhTotal - AhPer5Mins * timeElapsed) / AhTotal * 100).toFixed(1) // Calculate the planned percent of battery remaining
    // If the percent is less than 0, return 0
    if (percent < 0) {
        return 0
    }
    
    return percent
}