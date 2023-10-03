function removeFalsyValues(array) {
    return array.filter(element => element)
}


export default function getSettingsObject(userFormRef,carFormRefs,settings) {
    console.log(userFormRef.current)
    const userDataForm = new FormData(userFormRef.current); // Get the user data from the form
    console.log(userDataForm)
    const userData = Object.fromEntries(userDataForm.entries()); // Convert the user data to an object
    console.log(userData)
    // We need to get t he right ref from carFormRefs so we need to take the car settings
    const carsCopy = [...settings.cars]; // Copy the cars array from settings
    
    console.log("hello")
    carsCopy.forEach((car,index) => {
        const carFormRef = carFormRefs[index]; // Get the right ref from carFormRefs
        console.log(carFormRef.current)
        const carDataForm = new FormData(carFormRef.current); // Get the car data from the form
        console.log(carDataForm)
        const carData = Object.fromEntries(carDataForm.entries()); // Convert the car data to an object
        console.log(carData)
        carsCopy[index] = {...car,...removeFalsyValues(carData)}; // Merge the car data with the car object
    })
    console.log(carsCopy)
    userData['cars'] = carsCopy // Add the cars back into the userData object
    // merge userData and settings into a new object
    const newSettings = {...settings, ...removeFalsyValues(userData)}

    console.log(newSettings)
}