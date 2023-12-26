import React from 'react'

// Props should be the main form ref, an array of car form refs and the settings object

// Where the hook is called in settings page, you can use 
// const carFormRefs = settings.cars.map(car => { return getRef(car.car_number) })
// to get the car form refs

export default function EatSettingsForm(userFormRef,carFormRefs,settings) {
    // Get all user settings data, if no data is provided, use the existing setting
    let settingsObject = {
      team_name : userFormRef.current.elements.teamName?.value ? userFormRef.current.elements.teamName.value : settings.teamName,
      race_length : userFormRef.current.elements.raceLength?.value ? userFormRef.current.elements.raceLength.value : settings.raceLength,
      track_length : userFormRef.current.elements.trackLength?.value ? userFormRef.current.elements.trackLength.value : settings.trackLength,
      manual_lap_mode : userFormRef.current.elements.manualLapMode?.value ? userFormRef.current.elements.manualLapMode.value : settings.manualLapMode,
      race_start_time : settings?.raceStart ? settings.raceStart : null,
    // Features
      summary_map : userFormRef.current.elements.summaryMap?.value ? userFormRef.current.elements.summaryMap.value : settings.summaryMap,
      lap_summary_table : userFormRef.current.elements.lapSummaryTable?.value ? userFormRef.current.elements.lapSummaryTable.value : settings.lapSummaryTable,
      planned_battery_usage : userFormRef.current.elements.plannedBatteryUsage?.value ? userFormRef.current.elements.plannedBatteryUsage.value : settings?.plannedBatteryUsage,
      cars: [] // cars will be added later
    }
    console.log(settingsObject)
    // carFormRefs will be an array of carRefs that will be used to access the car data forms
    // iterate over carFormRefs to get the data from each car form
    let carsCopy = [...settings.cars]
    console.log(carsCopy)
    for (let i = 0; i < carsCopy.length; i++) {
      const carFormRef = carFormRefs[i]
      carsCopy[i].car_name = carFormRef.current.elements.carName?.value ? carFormRef.current.elements.carName.value : carsCopy[i].car_name
      carsCopy[i].dweet_name = carFormRef.current.elements.dweetName?.value ? carFormRef.current.elements.dweetName.value : carsCopy[i].dweet_name
      carsCopy[i].battery_capacity = carFormRef.current.elements.ampHours?.value ? carFormRef.current.elements.ampHours.value : carsCopy[i].battery_capacity
      carsCopy[i].wheel_circumference = carFormRef.current.elements.wheelCircumference?.value ? carFormRef.current.elements.wheelCircumference.value : carsCopy[i].wheel_circumference
      carsCopy[i].small_gear_teeth = carFormRef.current.elements.smallGearTeeth?.value ? carFormRef.current.elements.smallGearTeeth.value : carsCopy[i].small_gear_teeth
      carsCopy[i].large_gear_teeth = carFormRef.current.elements.teethGear?.value ? carFormRef.current.elements.teethGear.value : carsCopy[i].large_gear_teeth
    }
    // Add the cars back into the settings object

    // return a settings object that will be used to update the user and car data both in state and database
    
    return [settingsObject,carsCopy]
}
