import React from 'react'

// Props should be the main form ref, an array of car form refs and the settings object

// Where the hook is called in settings page, you can use 
// const carFormRefs = settings.cars.map(car => { return getRef(car.car_number) })
// to get the car form refs

export default async function useSettingsForm({userFormRef,carFormRefs,settings}) {
    // Get all user settings data, if no data is provided, use the existing setting
    const teamName = userFormRef.current.elements.teamName.value ? userFormRef.current.elements.teamName.value : settings.teamName
    const raceLength = userFormRef.current.elements.raceLength.value ? userFormRef.current.elements.raceLength.value : settings.raceLength
    const trackLength = userFormRef.current.elements.trackLength.value ? userFormRef.current.elements.trackLength.value : settings.trackLength
    const theme = userFormRef.current.elements.theme.value ? userFormRef.current.elements.theme.value : settings.theme
    const manualLapMode = userFormRef.current.elements.manualLapMode.value ? userFormRef.current.elements.manualLapMode.value : settings.manualLapMode
    
    // Features
    const summaryMap = userFormRef.current.elements.summaryMap.value ? userFormRef.current.elements.summaryMap.value : settings.summaryMap
    const lapSummaryTable = userFormRef.current.elements.lapSummaryTable.value ? userFormRef.current.elements.lapSummaryTable.value : settings.lapSummaryTable

    // carFormRefs will be an array of carRefs that will be used to access the car data forms
    // iterate over carFormRefs to get the data from each car form
    const carsCopy = [...settings.cars]
    carsCopy.forEach((car, index) => {
        const carFormRef = carFormRefs[index]
        car.car_name = carFormRef.current.elements.carName.value ? carFormRef.current.elements.carName.value : car.car_name
        car.dweet_name = carFormRef.current.elements.dweetName.value ? carFormRef.current.elements.dweetName.value : car.dweet_name
        car.battery_capacity = carFormRef.current.elements.ampHours.value ? carFormRef.current.elements.ampHours.value : car.battery_capacity
        car.wheel_circumference = carFormRef.current.elements.wheelCircumference.value ? carFormRef.current.elements.wheelCircumference.value : car.wheel_circumference
        car.small_gear_teeth = carFormRef.current.elements.smallGearTeeth.value ? carFormRef.current.elements.smallGearTeeth.value : car.small_gear_teeth
        car.large_gear_teeth = carFormRef.current.elements.teethGear.value ? carFormRef.current.elements.teethGear.value : car.large_gear_teeth
    })





    // return a settings object that will be used to update the user and car data both in state and database
  return (settingsObject)
}
