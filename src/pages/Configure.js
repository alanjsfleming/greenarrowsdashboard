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
import EatSettingsForm from '../hooks/EatSettingsForm'
import getSettingsObject from '../features/Settings/getSettingsObject'
import ObjectUndefinedToNull from '../utils/ObjectUndefinedToNull.js'


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


    // save settings to local storage when settings updated
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
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
        //console.log(settings,getRef(1).current.elements) 
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
            const carFormRefs = settings.cars.map(car=>{return getRef(car.car_number)})
            const settingsObject = EatSettingsForm(configureFormRef,carFormRefs,settings)
            //getSettingsObject(configureFormRef,carFormRefs,settings)
            console.log(settingsObject)
            newSettings(settingsObject)
            saveSettingsToFirebase(settingsObject)
            
            setError()
            setSuccess('Settings saved successfully!') 
        } catch (e){
            //console.log(e)
            setSuccess()
            setError('Failed to save settings.',e)
        }
    }

    // function to save settings to firebase car document when settings saved
    async function saveSettingsToFirebase(settingsObject) {
        // Split the cars into a new variable because they are saved in two different collections in firebase
        const carSettings = settingsObject.cars
        delete settingsObject.cars;
        const userSettings = settingsObject
        
        // First update the user document in firebase & the team name in auth.
        try {
            updatedisplayname(settingsObject.teamName) // Update display name in auth
            setDoc(userDocRef, userSettings, { merge: true }) // update user document in firebase
            .then(userDocRef => {
                //console.log("Document successfully updated!",userDocRef);
                setSuccess('Settings saved successfully!') 
                setError()
                
            })
            .catch(error => {
                console.error("Error adding document: ", error);
                setSuccess()
                setError('Failed to save settings to cloud.',error)
                
            })
        } catch(error) {
            setSuccess()
            setError('Failed to save settings to cloud.',error)
        }

        // Now for every car, update its car document in firebase
        carSettings.forEach(car => {
            // Find the car document in firebase
            const carQuery = query(collection(db,"cars"),where("owner","==",currentUser.uid),where("car_number","==",car.car_number))
            // Build the car document to be updated in firebase, not updating the car number or owner.
            console.log(car)
            const carDoc = ObjectUndefinedToNull(car);
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
                        //console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((e)=>{
                        setTimeout(()=>{
                        setSuccess()
                        setError("Settings failed to save to cloud." + e)
                    },50)
                    })
                }
            })
            .catch((e)=>{
                setTimeout(()=>{
                    setSuccess()
                    setError("Settings failed to save to cloud." + e)
                    },50)
            })
        })
    }

    // hide alerts when clicked
    function hideAlerts() {
        setError()
        setSuccess()
    }

    
    // function to add a new car to the cars collection in firebase - This is not available for free users so check that
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
        //console.log(carNumber,currentUser.uid)
        const carQuery = query(collection(db,"cars"),where("owner","==",currentUser.uid),where("car_number","==",parseInt(carNumber)))
                
        const carQuerySnapshot = getDocs(carQuery).then((querySnapshot) => {
            if (querySnapshot.size>0) {
                //console.log(querySnapshot.docs[0].id)
                deleteDoc(doc(db,"cars",querySnapshot.docs[0].id))
                .then(() => {
                    //console.log("Document successfully deleted!");
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

    // Delete car settings from settings object
    function deleteCarSettings(carNumber) {       
        const previousCars = settings.cars
        const newCars = previousCars.filter(car => car.car_number !== carNumber)

        newSettings(prevSettings => ({
            ...prevSettings,
            cars : newCars
        }))
    }

    // WHen the delete button is clicked it pops up the are you sure modal
    function handleDeleteCar(e) {
        const carNumber = e.target.value
        // First, popup a confirmation dialog
        // The actual deletion happens when the user confirms it
        setCarBeingDeleted(carNumber)
    }

    // When user confirms car deletion, delete the car from firebase and the settings object and close modal
    function deleteCarConfirmed() {
        // delete the car from firebase
        deleteCarFirebase(carBeingDeleted)
        deleteCarSettings(carBeingDeleted)
        // Hide the 'Are you sure' modal
        setCarBeingDeleted()
        // Change off of the car tab
        changeTab()
    }

    // cancel delete car interaction
    function deleteCarCancelled() {
        // Hide the 'Are you sure' modal
        setCarBeingDeleted()
    }

    // This is a not so temporary function 
    function tempFuncResetRunData() {
        // This is a temporary function to reset the running data in firebase
        // The teams/user/car id is hardcoded in here but change this to be dynamic, maybe a dropdown to choose which one to clear?
        // Right now since one car only is allowed it is car[0].id
        // VCq7rqiEK4qbGd7qZ4C0 is GA1
        const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[0].id}`)
        remove(rtCarRef).then(()=>{
            //console.log("deleted")
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
    
    <div className="d-flex flex-column justify-content-between text-center mb-5 configure-dash">
        <div className="text-center mx-1 btn-group" role="group" aria-label="Settings Tabs">
            <button value="0" className={"btn btn-secondary col-3 "+determineActive(0)} onClick={changeTab}>Account</button>
            <button value="1" className={"btn btn-secondary col-3 "+determineActive(1)} onClick={changeTab} >Cars</button>
            <button value="2" className={"btn btn-secondary col-3 "+determineActive(2)} onClick={changeTab}>Data</button>
            <button value="3" className={"btn btn-secondary col-3 "+determineActive(3)} onClick={changeTab}>Layout</button>
        </div>
        
        <div className={"modal fade "+((carBeingDeleted) && " show  d-block")}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Delete Car</h3>
                            
                        </div>
                        <div className="modal-content p-4">
                            <h4 className="my-3">Are you sure you want to delete this car?</h4>
                            <h4>This is irreversible!</h4>
                            <button className="btn btn-danger btn-lg mt-2" onClick={deleteCarConfirmed}>Yes, Delete</button>
                            <br></br>
                            <button className="btn btn-outline-primary btn-lg" onClick={deleteCarCancelled}>No! Cancel</button>
                        </div>
                    </div>
                </div>
        </div>
       

        <h1 className="pt-2 pb-3">Settings</h1>

        {error && <p onClick={hideAlerts} className="alert alert-danger">{error}</p>}
        {success && <p onClick={hideAlerts} className="alert alert-success">{success}</p>}

        <form ref={configureFormRef}>
        <div className="tab  mx-1" hidden={determineHide(0)}>
            <h3>Account</h3>
            <div className="form-group my-3">
                <label htmlFor="teamName">Change Team Name</label>
                <input type="text" className="form-control" name="teamName" id="teamName" placeholder={settings.teamName}></input>
            </div>
            <hr></hr>
            <Link to="/reset-password"><button className="btn btn-outline-dark btn-block">Reset Password</button></Link>

            <Link to="/logout"><button className="btn btn-dark btn-block my-2">Logout</button></Link>

            <div className="border-top mt-2" hidden>
                <h3 className="mt-2">Billing</h3>
                <a href="https://billing.stripe.com/p/login/3cs5kB9WG4242mkbII" className="btn btn-outline-dark btn-block mb-2">Manage Billing Here</a>
             
            </div>

            <div className="border-top mt-2">
                <h3 className="mt-2">DashOwl</h3>
                <a href="https://www.vis.dashowl.co.uk" className="btn btn-outline-dark btn-block">eChook Logfile Visualiser (Free!)</a>
                <div hidden className="form-group my-3">
                    <label htmlFor="newsLetterEmail">Newsletter:</label>
                    <input type="email" className="form-control text-center" name="newsLetterEmail" id="newsLetterEmail" placeholder={currentUser.email}></input>

                </div>
            </div>


        </div>

        <div className="tab mx-1" hidden={determineHide(1)}>
            <h3>Cars</h3>
            {settings.cars ? settings.cars.map((car,index)=>(
            <div className="card w-100 m-auto mb-2">
                <div className="card-header w-100 h-100 p-0" data-value={index+4} onClick={changeTab}>
                    <h4 className="card-title p-2 m-0">Car {index+1}: {car.car_name}</h4>
                </div>

                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="carName">Car Name</label>
                        <input type="text" className="form-control" disabled id="carName" placeholder={car.car_name}></input>
                    </div>
                </div>
            </div>)
            ): <p>No cars...</p>}
            

        

            <br></br>
            
        </div>

        <div className="tab mx-1" hidden={determineHide(2)}>
            <h3>Race</h3>
            <div className="form-group my-3">
                <label htmlFor="raceLength">Race Length (mins)</label>
                <input type="number" className="form-control" id="raceLength" name="raceLength" placeholder={settings.raceLength}></input>
            </div>

            <div hidden={!(settings?.role==='standard' || settings?.role==='pro')}  className="form-group my-3">
                <label htmlFor="trackLength">Manual Track Length (m)</label>
                <input type="number" className="form-control" id="trackLength" name="trackLength" placeholder={settings.trackLength}></input>
            </div>

    
            <div hidden={!(settings?.role==='standard' || settings?.role==='pro')}  className="form-group my-3">
                <label htmlFor="manualLapMode">Lap Increments by distance</label>
                <select className="form-control" name="manualLapMode" id="manualLapMode">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
            </div>

            <div hidden={!(settings?.role==='standard' || settings?.role==='pro')} className="form-group my-3">
                <label htmlFor="plannedBatteryUsage">Planned Battery Usage (Ah/min)</label>
                <input type="number" className="form-control" name="plannedBatteryUsage" id="plannedBatteryUsage" placeholder={settings?.plannedBatteryUsage}></input>
            </div>

            <button hidden={!(settings?.role==='standard' || settings?.role==='pro')} className="btn btn-danger btn-block" type="button" onClick={tempFuncResetRunData}>Reset Recorded Data</button>
            
            <div className="alert alert-info py-4 mx-5">
                <p>Lap summary tables are in last stages of development, you will find the settings here.</p>
            </div>
        </div>

        <div className="tab mx-1" hidden={determineHide(3)}>
            <h3 hidden >Appearance</h3>
            <div hidden className="form-group my-3">
                <label htmlFor="theme">Theme</label>
                <select name="theme" disabled className="form-control" id="theme">
                    <option>Light</option>
                    <option>Dark</option>
                </select>
            </div>

            <h3>Summary Page</h3>
            <div className="form-group my-3">
                <label htmlFor="summaryMap">Location map</label>
                <select name="summaryMap" className="form-control" id="summaryMap">
                    <option>Disabled</option>
                    <option selected={settings.summaryMap==='Enabled' ? "selected" : ""}>Enabled</option>
                </select>
            </div>

            <div className="form-group my-3">
                <label htmlFor="lapSummaryTable">Lap Summary Table</label>
                <select name="lapSummaryTable" className="form-control" id="lapSummaryTable">
                    <option>Disabled</option>
                    <option selected={settings.lapSummaryTable==='Enabled' ? "selected" : ""}>Enabled</option>
                </select>
            </div>
        </div>

        <div className="fixed-bottom d-flex">
        <button onClick={handleSaveSettings} type="button" className="btn btn-primary btn-block m-1">Save</button>
        </div>




        </form>

        {settings.cars ? settings.cars.map((car,index)=>(
        <form className="tab mx-1" ref={setRef(car.car_number)} hidden={determineHide(index+4)}>
            <div className="card w-100 m-auto">
                <div className="card-header">
                    <h4 className="card-title">Car {index+1}: {car.car_name}</h4>
                </div>
                <div className="card-body">
                <div className="form-group">
                    <label htmlFor="carName">Car Name</label>
                    <input name="carName" type="text" className="form-control" id="carName" placeholder={car.car_name}></input>
                </div>

                <div className="form-group my-3">
                    <label htmlFor="dweetUrl">Dweet Thing name</label>
                    <input name="dweetUrl" type="text" className="form-control" id="dweetUrl" placeholder={car.dweet_name}></input>
                </div>

                <div className="form-group my-3">
                    <label htmlFor="ampHours">Battery Capacity (Amp Hours)</label>
                    <input name="ampHours" type="number" className="form-control" id="ampHours" placeholder={car.battery_capacity}></input>
                </div>

                <div className="form-group my-3">
                    <label htmlFor="wheelCircumference">Wheel circumference (m)</label>
                    <input name="wheelCircumference" type="number" className="form-control" id="wheelCircumference" placeholder={car.wheel_circumference}></input>
                </div>

                <div className="form-group my-3">
                    <button type="button" value={index} onClick={handleReverseGearingMode} className="btn btn-outline-primary btn-block">{car.reverse_gearing_mode ? 'Disable ' : 'Enable '}Reverse Gearing Mode</button>
                </div>
                <div hidden={car.reverse_gearing_mode ? false : true} >
                <div className="form-group my-3" hidden>
                    <label htmlFor="teethGear">Teeth on small gear</label>
                    <input name="smallteethGear" type="number" className="form-control" id="smallteethGear"></input>
                </div>

                <div className="form-group my-3">
                    <label htmlFor="teethGear">Teeth on large gear</label>
                    <input type="number" name="teethGear" className="form-control" id="teethGear" placeholder={car.large_gear_teeth}></input>
                </div>
                </div>
                <br></br>
                    <div hidden={(settings.cars.length<=1)}>
                        <small className="text-muted">Deleting a car is irreversible!</small>
                        <button  type="button" className="btn btn-outline-danger btn-block" value={car.car_number} onClick={handleDeleteCar}>Delete Car</button> 
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