import React, { useRef, useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import MenuBar from '../layouts/MenuBar'
import { doc,updateDoc,addDoc, deleteDoc} from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { where, getDocs,query,collection } from 'firebase/firestore'
import {ref,remove} from "firebase/database"
import { rtdb } from '../firebase'
import useDynamicRefs from '../hooks/useDynamicRefs.tsx'
import { setDoc } from 'firebase/firestore'


export default function Configure() {
    const { currentUser,updatedisplayname } = useAuth()
    const configureFormRef = useRef()
    const [currentTab,setCurrentTab] = useState(window.location.href.split('?')[1])
    const [settings,newSettings] = useState([])
    const [error,setError] = useState()
    const [success,setSuccess] = useState()
    const [carDropdownShow,setCarDropdownShow] = useState(false)
    const [getRef,setRef] = useDynamicRefs()
    const [carBeingDeleted,setCarBeingDeleted] = useState()

    // The user's settings are stored in the settings object at this ref
    const userDocRef = doc(db,"users", currentUser.uid)

    const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'

    // Load settings from local storage
    useEffect(() => {
        const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
        if (storedSettings) {newSettings(storedSettings)};
     
    },[]) 


    // save settings to local storage and firebase on settings change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
        // if settings not empty -> save to firebase?
        // call function to save settings to firebase
        // not doing that here because it will save settings every time page loading???
    },[settings])

    // This will determine if a tab should be shown or not depending on the current tab selected
    function determineHide(tab) {
        if (tab === parseInt(currentTab)) {
            return false
        } else {
            return true
        }
    }

    // This will determine if a tab should be active for the class name depending on the current tab selected
    function determineActive(tab) {
        if (tab === parseInt(currentTab)) {
            return "active"
        } else {
            return ""
        }
    }

    // When a tab is clicked, it will switch the view to only show that one.
    function changeTab(e) {
        setCarDropdownShow(false)
        if (e.target.value) {
            setCurrentTab(e.target.value)
        } else {
            setCurrentTab(e.target.parentElement.getAttribute("data-value"))
        }
        console.log(settings,getRef(1).current.elements) 
    }


    // Edit this function to take the e.target.value as the car number to find cars[e.target.value]
    // and then toggle the reverse gearing mode on the car itself rather than the settings
    // can I do this without saving the settings every time?
    function handleReverseGearingMode(e) {
        const carNumber = e.target.value
        const carsCopy = [...settings.cars]
        if (carsCopy[carNumber].reverse_gearing_mode) {
            carsCopy[carNumber].reverse_gearing_mode = false
        } else {
            carsCopy[carNumber].reverse_gearing_mode = true
        }
        newSettings(prevSettings=>({...prevSettings,cars:carsCopy}))
    }

    // save update settings with form data when save button clicked
    const handleSaveSettings = (e) => {
        try {
            saveSettingsToSettings(e)
            saveSettingsToFirebase()
            .catch((e)=>{console.log(e)})
            
            setError()
            setSuccess('Settings saved successfully!') 
        } catch (e){
            console.log(e)
            setSuccess()
            setError('Failed to save settings.')
        }
    }

    function saveSettingsToSettings(e) {
        console.log(settings)
        // Account Settings
        const teamName = configureFormRef.current.elements.teamName.value ? configureFormRef.current.elements.teamName.value : settings.teamName
        const raceLength = configureFormRef.current.elements.raceLength.value ? configureFormRef.current.elements.raceLength.value : settings.raceLength
        const trackLength = configureFormRef.current.elements.trackLength.value ? configureFormRef.current.elements.trackLength.value : settings.trackLength
        const theme = configureFormRef.current.elements.theme.value ? configureFormRef.current.elements.theme.value : settings.theme
        const manualLapMode = configureFormRef.current.elements.manualLapMode.value ? configureFormRef.current.elements.manualLapMode.value : settings.manualLapMode

        // Features
        const summaryMap = configureFormRef.current.elements.summaryMap.value ? configureFormRef.current.elements.summaryMap.value : settings.summaryMap
        const lapSummaryTable = configureFormRef.current.elements.lapSummaryTable.value ? configureFormRef.current.elements.lapSummaryTable.value : settings.lapSummaryTable

        // Car settings Legacy
        //const carName = configureFormRef.current.elements.carName.value ? configureFormRef.current.elements.carName.value : settings.carName
        //const dweetUrl = configureFormRef.current.elements.dweetUrl.value ? configureFormRef.current.elements.dweetUrl.value : settings.dweetUrl
        //const ampHours = configureFormRef.current.elements.ampHours.value ? configureFormRef.current.elements.ampHours.value : settings.ampHours
        //const teethGear = configureFormRef.current.elements.teethGear.value ? configureFormRef.current.elements.teethGear.value : settings.teethGear

        // Dynamic Car Settings
        // Loop through all cars and use getRef(carid) to get the ref for each car, then get the value of each input
        // and update the car object in the settings
        const carsCopy = [...settings.cars]
        carsCopy.forEach(car => {
            const carRef = getRef(car.car_number)
            car.car_name = carRef.current.elements.carName.value ? carRef.current.elements.carName.value : car.car_name
            car.dweet_name = carRef.current.elements.dweetUrl.value ? carRef.current.elements.dweetUrl.value : car.dweet_name
            car.battery_capacity = carRef.current.elements.ampHours.value ? carRef.current.elements.ampHours.value : car.battery_capacity
            car.wheel_circumference = carRef.current.elements.wheelCircumference.value ? carRef.current.elements.wheelCircumference.value : car.wheel_circumference
            car.small_gear_teeth = carRef.current.elements.smallteethGear.value ? carRef.current.elements.smallteethGear.value : car.small_gear_teeth
            car.large_gear_teeth = carRef.current.elements.teethGear.value ? carRef.current.elements.teethGear.value : car.large_gear_teeth
        })
        newSettings(prevSettings => ({
            ...prevSettings,
            cars:carsCopy
        }))


        console.log(settings.teamName,teamName)
        newSettings(prevSettings => ({
            ...prevSettings,
            teamName:teamName,
            //carName:carName,
            //dweetUrl:dweetUrl,
            //ampHours:ampHours,
            //teethGear:teethGear,
            raceLength:raceLength,
            trackLength:trackLength,
            theme:theme,
            manualLapMode:manualLapMode,
            summaryMap:summaryMap,
            lapSummaryTable:lapSummaryTable
        }))

        console.log(teamName,settings.teamName)
        
    }

    // function to save settings to firebase car document when settings saved
    async function saveSettingsToFirebase() {
        const userSettings = {  team_name : settings.teamName,
                                race_length : settings.raceLength,
                                race_start_time : settings.raceStart,
                                track_length : settings.trackLength,
                                appearance_theme : settings.theme,
                                manualLapMode : settings.manualLapMode,
                                lap_summary_table : settings.lapSummaryTable,
                                summary_map : settings.summaryMap,
                            }
        // now get the car setting array
        const carSettings = settings.cars
        try {
        // update displayname
        updatedisplayname(settings.teamName)
        // update user document in firebase
        updateDoc(userDocRef, userSettings, { merge: true })
        .then(userDocRef => {
            console.log("Document successfully updated!",userDocRef);
            setSuccess('Settings saved successfully!') 
            setError()
            
        })
        .catch(error => {
            console.error("Error adding document: ", error);
            setSuccess()
            setError('Failed to save settings to cloud.',error)
            
        });}
        catch (e) {
            console.log(e)
        }

         // For every car in the settings array, update the car document in firebase
        carSettings.forEach(car => {
            console.log(car.car_number)
            // Create a query to find the car document in firebase
            const carQuery = query(collection(db,"cars"),where("owner","==",currentUser.uid),where("car_number","==",car.car_number))
            // Build the car document to be updated in firebase
            console.log()
            const carDoc = {    
                                car_name:car.car_name,
                                battery_capacity:car.battery_capacity,
                                dweet_name:car.dweet_name,
                                large_gear_teeth:car.large_gear_teeth,
                                wheel_circumference:car.wheel_circumference,
                                reverse_gearing_mode:car.reverse_gearing_mode ? true : false,
                                small_gear_teeth:car.small_gear_teeth
                        }

            // Get the query results
            const carQuerySnapshot = getDocs(carQuery).then((querySnapshot)=>{
          
            // If the query returns a document, get the document id
            if (querySnapshot.size >0) {
                const carDocumentId = querySnapshot.docs[0].id
                // Update the car document in firebase
                setDoc(doc(db,"cars",carDocumentId),carDoc,{merge:true})
            } else {
                // If the query does not return a document (i.e. the car document does not exist)
                // then create a new car document in firebase
                const carDoc = {    
                    car_name:car.car_name,
                    car_number:car.car_number,
                    owner:currentUser.uid,
                    battery_capacity:car.battery_capacity,
                    dweet_name:car.dweet_name,
                    large_gear_teeth:car.large_gear_teeth,
                    wheel_circumference:car.wheel_circumference,
                    reverse_gearing_mode:car.reverse_gearing_mode
                }
                const carsCollectionRef = collection(db,"cars")
                addDoc(carsCollectionRef,carDoc)
                .then((docRef)=>{
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((e)=>{
                    console.log(e)
                })
                }
            })
            .catch((e)=>{
                console.log(e)
            })
        })
    }


    /*
    function handleSaveAmpHourSettings(e){
        const ampHours = AmpHourSettingsRef.current.value
        newSettings(prevSettings => ({
          ...prevSettings,
          ampHours:ampHours
        }))
      }
      */

    // hide alerts when clicked
    function hideAlerts() {
        setError()
        setSuccess()
    }

    
    // function to add a new car to the cars collection in firebase
    function addNewCar() {
        // TODO
        // Use this IF to limit the number of cars depending on the user's plan
        //if (settings.car?.length > 0) {
         //   setError('There is currently a limit of one car per user.')
          //  return
        //}
        // add new document with default values
        const newCar = [{    car_name : 'New Car',
                            car_number : settings.cars.length+1,
                            dweet_name : 'Thing',
                            battery_capacity : 28,
                            small_gear_teeth:20, 
                            large_gear_teeth : 60,
                            // id field = document id in firestore
                            owner: currentUser.uid,
                            wheel_circumference : 4,
                            reverse_gearing_mode : false,
                     }]
        const previousCars = settings.cars
        newSettings(prevSettings => ({
            ...prevSettings,
            cars : previousCars.concat(newCar)
        }))
    }

    // I want to only call this when a car is deleted and then save button is pressed really
    // TODO - above
    function deleteCarFirebase(carNumber) {
        console.log(carNumber,currentUser.uid)
        const carQuery = query(collection(db,"cars"),where("owner","==",currentUser.uid),where("car_number","==",parseInt(carNumber)))
                
        const carQuerySnapshot = getDocs(carQuery).then((querySnapshot) => {
            if (querySnapshot.size>0) {
                console.log(querySnapshot.docs[0].id)
                deleteDoc(doc(db,"cars",querySnapshot.docs[0].id))
                .then(() => {
                    console.log("Document successfully deleted!");
                    setSuccess('Car deleted successfully!')
                    // Now delete the car from the settings
                    
                    // Then I need to update all the car numbers

                    // Make array of all cars

                    // Loop through array and set car number to index+1

                    // Update the settings
                    // update firebase
                }
                )
                .catch((error) => {
                    console.error("Error removing document: ", error);
                    setError('Failed to delete car.')
                    }
                )

            }
        })
    }

    function deleteCarSettings(carNumber) {
       
        const previousCars = settings.cars
        const newCars = previousCars.filter(car => car.car_number !== carNumber)

        newSettings(prevSettings => ({
            ...prevSettings,
            cars : newCars
        }))
    }

    function handleDeleteCar(e) {
        const carNumber = e.target.value
        // First, popup a confirmation dialog
        // The actual deletion happens when the user confirms it
        setCarBeingDeleted(carNumber)
    }

    function deleteCarConfirmed() {
        // delete the car from firebase
        deleteCarFirebase(carBeingDeleted)
        deleteCarSettings(carBeingDeleted)
        // Hide the 'Are you sure' modal
        setCarBeingDeleted()
        // Change off of the car tab
        changeTab()
    }

    function deleteCarCancelled() {
        // Hide the 'Are you sure' modal
        setCarBeingDeleted()
    }
  

    function tempFuncResetRunData() {
        // This is a temporary function to reset the running data in firebase
        // The teams/user/car id is hardcoded in here but change this to be dynamic, maybe a dropdown to choose which one to clear?
        // Right now since one car only is allowed it is car[0].id
        // VCq7rqiEK4qbGd7qZ4C0 is GA1
        const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[0].id}`)
        remove(rtCarRef).then(()=>{
            console.log("deleted")
        })
        newSettings(prevSettings=>({
          ...prevSettings,
          running_data: []
        }))
      }



    /*
    const MapTeamCars = () => {
        if (settings.car) {
            return settings.cars.map((car,index) => {
                return <div class="card w-100 m-auto">
                <div class="card-header">
                    <h4 class="card-title">Car {index+1}: {car.car_name}</h4>
                </div>
                <div class="card-body">
                <div class="form-group">
                    <label for="carName">Car Name</label>
                    <input type="text" class="form-control" id="carName" placeholder={car.car_name}></input>
                </div>

                <div class="form-group my-3">
                    <label for="dweetUrl">Dweet Thing name</label>
                    <input type="text" class="form-control" id="dweetUrl" placeholder={car.dweet_name}></input>
                </div>

                <div class="form-group my-3">
                    <label for="ampHours">Battery Capacity (Amp Hours)</label>
                    <input type="number" class="form-control" id="ampHours" placeholder={car.battery_capacity}></input>
                </div>

                <div class="form-group my-3">
                    <label for="teethGear">Teeth on larger gear</label>
                    <input type="number" class="form-control" id="teethGear" placeholder={car.large_gear_teeth}></input>
                </div>
                </div>
            </div>
            })
        }
    }
*/

// <button disabled type="button" onClick={addNewCar} class="btn btn-primary btn-block">Add car</button>


  return (
    <>
    <MenuBar />
    
    <div class="d-flex flex-column justify-content-between text-center mb-5 configure-dash">
        <div class="text-center mx-1 btn-group" role="group" aria-label="Settings Tabs">
            <button value="0" class={"btn btn-secondary col-3 "+determineActive(0)} onClick={changeTab}>Account</button>
            <button value="1" class={"btn btn-secondary col-3 "+determineActive(1)} onClick={changeTab} >Cars</button>
            <button value="2" class={"btn btn-secondary col-3 "+determineActive(2)} onClick={changeTab}>Data</button>
            <button value="3" class={"btn btn-secondary col-3 "+determineActive(3)} onClick={changeTab}>Layout</button>
        </div>
        
        <div class={"modal fade "+((carBeingDeleted) && " show  d-block")}>
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">Delete Car</h3>
                            
                        </div>
                        <div class="modal-content p-4">
                            <h4 class="my-3">Are you sure you want to delete this car?</h4>
                            <h4>This is irreversible!</h4>
                            <button class="btn btn-danger btn-lg mt-2" onClick={deleteCarConfirmed}>Yes, Delete</button>
                            <br></br>
                            <button class="btn btn-outline-primary btn-lg" onClick={deleteCarCancelled}>No! Cancel</button>
                        </div>
                    </div>
                </div>
        </div>
       

        <h1 class="pt-2 pb-3">Settings</h1>

        {error && <p onClick={hideAlerts} className="alert alert-danger">{error}</p>}
        {success && <p onClick={hideAlerts} className="alert alert-success">{success}</p>}

        <form ref={configureFormRef}>
        <div class="tab  mx-1" hidden={determineHide(0)}>
            <h3>Account</h3>
            <div class="form-group my-3">
                <label for="teamName">Change Team Name</label>
                <input type="text" class="form-control" id="teamName" placeholder={settings.teamName}></input>
            </div>

            <Link to="/reset-password"><button class="btn btn-outline-dark btn-block">Reset Password Here</button></Link>

            <Link to="/logout"><button class="btn btn-dark btn-block my-2">Logout</button></Link>

            <div class="border-top mt-2">
                <h3 class="mt-2">Billing</h3>
                <button class="btn btn-outline-dark btn-block mb-2" type="button">Manage Billing Here</button>
                <Link to={"/upgrade-plan?fromApp=true&currentPlan="+settings.role} class="btn btn-outline-dark btn-block mb-2">Upgrade Plan</Link>
            </div>

            <div class="border-top mt-2">
                <h3 class="mt-2">DashOwl</h3>
                <a href="https://www.vis.dashowl.co.uk" class="btn btn-outline-dark btn-block">eChook Logfile Visualiser (Free!)</a>
                <div hidden class="form-group my-3">
                    <label for="newsLetterEmail">Newsletter:</label>
                    <input type="email" class="form-control text-center" id="newsLetterEmail" placeholder={currentUser.email}></input>

                </div>
            </div>


        </div>

        <div class="tab mx-1" hidden={determineHide(1)}>
            <h3>Cars</h3>
            {settings.cars ? settings.cars.map((car,index)=>(
            <div class="card w-100 m-auto mb-2">
            
                <div class="card-header" data-value={index+4} onClick={changeTab}>
                    <h4 class="card-title">Car {index+1}: {car.car_name}</h4>
                </div>

                <div class="card-body">
                    <div class="form-group">
                        <label for="carName">Car Name</label>
                        <input type="text" class="form-control" id="carName" placeholder={car.car_name}></input>
                    </div>
                </div>
            </div>)
            ): <p>No cars...</p>}
            

        

            <br></br>
            
        </div>

        <div class="tab mx-1" hidden={determineHide(2)}>
            <h3>Race</h3>
            <div class="form-group my-3">
                <label for="raceLength">Race Length (mins)</label>
                <input type="number" class="form-control" id="raceLength" placeholder={settings.raceLength}></input>
            </div>

            <div class="form-group my-3">
                <label for="trackLength">Manual Track Length (m)</label>
                <input type="number" class="form-control" id="trackLength" placeholder={settings.trackLength}></input>
            </div>

    
            <div class="form-group my-3">
                <label for="manualLapMode">Lap Increments by distance</label>
                <select class="form-control" id="manualLapMode">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
            </div>
            <button class="btn btn-danger btn-block" type="button" onClick={tempFuncResetRunData}>Reset Data</button>
            
        </div>

        <div class="tab mx-1" hidden={determineHide(3)}>
            <h3>Appearance</h3>
            <div class="form-group my-3">
                <label for="theme">Theme</label>
                <select disabled class="form-control" id="theme">
                    <option>Light</option>
                    <option>Dark</option>
                </select>
            </div>

            <h3>Summary Page</h3>
            <div class="form-group my-3">
                <label for="summaryMap">Location map</label>
                <select class="form-control" id="summaryMap">
                    <option>Disabled</option>
                    <option selected={settings.summaryMap==='Enabled' ? "selected" : ""}>Enabled</option>
                </select>
            </div>

            <div class="form-group my-3">
                <label for="lapSummaryTable">Lap Summary Table</label>
                <select class="form-control" id="lapSummaryTable">
                    <option>Disabled</option>
                    <option selected={settings.lapSummaryTable==='Enabled' ? "selected" : ""}>Enabled</option>
                </select>
            </div>
        </div>

        <div class="fixed-bottom d-flex">
        <button onClick={handleSaveSettings} type="button" class="btn btn-primary btn-block m-1">Save</button>
        </div>




        </form>

        {settings.cars ? settings.cars.map((car,index)=>(
        <form class="tab mx-1" ref={setRef(car.car_number)} hidden={determineHide(index+4)}>
            <div class="card w-100 m-auto">
                <div class="card-header">
                    <h4 class="card-title">Car {index+1}: {car.car_name}</h4>
                </div>
                <div class="card-body">
                <div class="form-group">
                    <label for="carName">Car Name</label>
                    <input type="text" class="form-control" id="carName" placeholder={car.car_name}></input>
                </div>

                <div class="form-group my-3">
                    <label for="dweetUrl">Dweet Thing name</label>
                    <input type="text" class="form-control" id="dweetUrl" placeholder={car.dweet_name}></input>
                </div>

                <div class="form-group my-3">
                    <label for="ampHours">Battery Capacity (Amp Hours)</label>
                    <input type="number" class="form-control" id="ampHours" placeholder={car.battery_capacity}></input>
                </div>

                <div class="form-group my-3">
                    <label for="wheelCircumference">Wheel circumference (m)</label>
                    <input type="number" class="form-control" id="wheelCircumference" placeholder={car.wheel_circumference}></input>
                </div>

                <div class="form-group my-3">
                    <button type="button" value={index} onClick={handleReverseGearingMode} class="btn btn-outline-primary btn-block">{car.reverse_gearing_mode ? 'Disable ' : 'Enable '}Reverse Gearing Mode</button>
                </div>
                <div hidden={car.reverse_gearing_mode ? false : true} >
                <div class="form-group my-3">
                    <label for="teethGear">Teeth on small gear</label>
                    <input type="number" class="form-control" id="smallteethGear"></input>
                </div>

                <div class="form-group my-3">
                    <label for="teethGear">Teeth on large gear</label>
                    <input type="number" class="form-control" id="teethGear" placeholder={car.large_gear_teeth}></input>
                </div>
                </div>
                <br></br>
                    <div hidden={(settings.cars.length<=1)}>
                        <small class="text-muted">Deleting a car is irreversible!</small>
                        <button  type="button" class="btn btn-outline-danger btn-block" value={car.car_number} onClick={handleDeleteCar}>Delete Car</button> 
                    </div>
                </div>
            </div>
        </form>)): <p>No cars...</p>}



        
    </div>
    
    

  
   
    </>
  )
}


// Okay...
// I believe the best way to have the dynamic refs is use npm i use-dynamic-refs
// And then use on each div created by the map, ref={setRef(car.car_number)} ??
// Then that will give me the ref for the whole div, i will have to then get 
// each individual input by using ref.current.querySelector('input') or something like that??
// Then i can use that to get the value of each input and then update the car object
// import useDynamicRefs from 'use-dynamic-refs';
// const [setRef, getRef] = useDynamicRefs();
// https://medium.com/@fitzmuzenda/create-refs-dynamically-in-react-ea2a4567b88



/*
  <div hidden>
    <div id="account">
        <h3>Account</h3>
        <ul>
            <li>Change team name</li>
            <li>Reset password</li>
            <li>Overview settings</li>
        </ul>
    </div>

    <div id="cars">
        <h3>Cars</h3>
        <ul>
            <li>Update Dweet URL</li>
        </ul>
        <p>Add new</p>
    </div>

    <div id="data">
        <h3>Data</h3>
        <ul>
            <li>List of data. For each: name, unit, upper, lower, vis type, category</li>
        </ul>

    </div>


    <div id="appearance">
        <h3>Appearance</h3>
        <ul>
            <li>Reorder</li>
        </ul>
    </div>
    </div>
*/