import React, { useRef, useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import MenuBar from './MenuBar'
import { doc,getFirestore,updateDoc} from 'firebase/firestore'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../firebase'

// change this all to be a modal?
export default function Configure() {
    const { currentUser,updatedisplayname } = useAuth()
    const configureFormRef = useRef()
    const [currentTab,setCurrentTab] = useState(window.location.href.split('?')[1])
    const [settings,newSettings] = useState([])
    const [error,setError] = useState()
    const [success,setSuccess] = useState()

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
        saveSettingsToFirebase()
            .catch((e)=>{console.log(e)})
        // call function to save settings to firebase
        // not doing that here because it will save settings every time page loading???
    },[settings])

    // determine if a tab should hide depending on current tab selected
    function determineHide(tab) {
        if (tab === parseInt(currentTab)) {
            return false
        } else {
            return true
        }
    }

    // determine if a tab button should be active depending on current tab selected
    function determineActive(tab) {
        if (tab === parseInt(currentTab)) {
            return "active"
        } else {
            return ""
        }
    }

    // change tab when button clicked
    function changeTab(e) {
        setCurrentTab(e.target.value)
        console.log(settings)
      
    }

    // save update settings with form data when save button clicked
    const handleSaveSettings = (e) => {
        try {
            saveSettingsToSettings(e)
            
            
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
        const teamName = configureFormRef.current.elements.teamName.value ? configureFormRef.current.elements.teamName.value : settings.teamName
        const carName = configureFormRef.current.elements.carName.value ? configureFormRef.current.elements.carName.value : settings.carName
        const dweetUrl = configureFormRef.current.elements.dweetUrl.value ? configureFormRef.current.elements.dweetUrl.value : settings.dweetUrl
        const ampHours = configureFormRef.current.elements.ampHours.value ? configureFormRef.current.elements.ampHours.value : settings.ampHours
        const teethGear = configureFormRef.current.elements.teethGear.value ? configureFormRef.current.elements.teethGear.value : settings.teethGear
        const raceLength = configureFormRef.current.elements.raceLength.value ? configureFormRef.current.elements.raceLength.value : settings.raceLength
        const trackLength = configureFormRef.current.elements.trackLength.value ? configureFormRef.current.elements.trackLength.value : settings.trackLength
        const theme = configureFormRef.current.elements.theme.value ? configureFormRef.current.elements.theme.value : settings.theme

        console.log(settings.teamName,teamName)
        newSettings(prevSettings => ({
            ...prevSettings,
            teamName:teamName,
            carName:carName,
            dweetUrl:dweetUrl,
            ampHours:ampHours,
            teethGear:teethGear,
            raceLength:raceLength,
            trackLength:trackLength,
            theme:theme
        }))

        console.log(teamName,settings.teamName)
    }

    // function to save settings to firebase car document when settings saved
    async function saveSettingsToFirebase() {
        const userSettings = {  team_name : settings.teamName,
                                race_length : settings.raceLength,
                                race_start_time : settings.raceStart,
                                track_length : settings.trackLength,
                                appearance_theme : settings.theme 
                            }
        updatedisplayname(settings.teamName)
        updateDoc(userDocRef, userSettings, { merge: true })
        .then(userDocRef => {
            console.log("Document written with ID: ", userDocRef.id);
        })
        .catch(error => {
            console.error("Error adding document: ", error);
        });
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

    // function to update a document in the cars collection in firebase
    // document will contain all the settings for that car:
    // - car_name
    // - battery_capacity
    // - dweet_name
    // - large_gear_teeth 
    // - owner ( current user uid )
    // - wheel circumference
    function updateCar() {
        
    }
    
    // function to add a new car to the cars collection in firebase
    function addNewCar() {
        // TODO
        //if (settings.car) {
         //   setError('There is currently a limit of one car per user.')
          //  return
        //}
        // add new document with default values
        const newCar = [{    car_name : 'My',
                            dweet_name : 'Thing',
                            battery_capacity : 28, 
                            large_gear_teeth : 60,
                            owner: '123456789',
                            wheel_circumference : 4
                     }]
        const previousCars = settings.cars
        newSettings(prevSettings => ({
            ...prevSettings,
            cars : previousCars.concat(newCar)
        }))
    }

    // function to delete a car from the cars collection in firebase
    function deleteCar() {
        // TODO
        // delete document
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
  return (
    <>
    <MenuBar />

    <div class="mx-1 d-flex flex-column justify-content-between text-center mb-5">
        
        <div class="text-center btn-group" role="group" aria-label="Settings Tabs">
            <button value="0" class={"btn btn-secondary col-3 "+determineActive(0)} onClick={changeTab}>Account</button>
            <button value="1" class={"btn btn-secondary col-3 "+determineActive(1)} onClick={changeTab}>Cars</button>
            <button value="2" class={"btn btn-secondary col-3 "+determineActive(2)} onClick={changeTab}>Data</button>
            <button value="3" class={"btn btn-secondary col-3 "+determineActive(3)} onClick={changeTab}>Layout</button>
        </div>
        
        <h1 class="pt-2 pb-3">Settings</h1>

        {error && <p onClick={hideAlerts} className="alert alert-danger">{error}</p>}
        {success && <p onClick={hideAlerts} className="alert alert-success">{success}</p>}

        <form ref={configureFormRef}>
        <div class="tab" hidden={determineHide(0)}>
            <h3>Account</h3>
            <div class="form-group my-3">
                <label for="teamName">Change Team Name</label>
                <input type="text" class="form-control" id="teamName" placeholder={settings.teamName}></input>
            </div>

            <Link to="/reset-password"><button class="btn btn-outline-dark btn-block">Reset Password Here</button></Link>

            <Link to="/logout"><button class="btn btn-dark btn-block my-2">Logout</button></Link>
        </div>

        <div class="tab" hidden={determineHide(1)}>
            <h3>Cars</h3>
            <div class="card w-100 m-auto">
                <div class="card-header">
                    <h4 class="card-title">Car 1: {settings.carName}</h4>
                </div>
                <div class="card-body">
                <div class="form-group">
                    <label for="carName">Car Name</label>
                    <input type="text" class="form-control" id="carName" placeholder={settings.carName}></input>
                </div>

                <div class="form-group my-3">
                    <label for="dweetUrl">Dweet Thing name</label>
                    <input type="text" class="form-control" id="dweetUrl" placeholder={settings.dweetUrl}></input>
                </div>

                <div class="form-group my-3">
                    <label for="ampHours">Battery Capacity (Amp Hours)</label>
                    <input type="number" class="form-control" id="ampHours" placeholder={settings.ampHours}></input>
                </div>

                <div class="form-group my-3">
                    <label for="teethGear">Teeth on larger gear</label>
                    <input type="number" class="form-control" id="teethGear" placeholder={settings.teethGear}></input>
                </div>
                </div>
            </div>
            

        

            <br></br>
            <button disabled type="button" onClick={addNewCar} class="btn btn-primary btn-block">Add car</button>
        </div>

        <div class="tab" hidden={determineHide(2)}>
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
                <label for="theme">Lap Increments by distance</label>
                <select class="form-control" id="lapIncrementDistance">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
            </div>
        </div>

        <div class="tab" hidden={determineHide(3)}>
            <h3>Appearance</h3>
            <div class="form-group my-3">
                <label for="theme">Theme</label>
                <select class="form-control" id="theme">
                    <option>Light</option>
                    <option>Dark</option>
                </select>
            </div>
        </div>

        <div class="fixed-bottom d-flex">
        <button onClick={handleSaveSettings} type="button" class="btn btn-primary btn-block m-1">Save</button>
        </div>
        </form>
    </div>
    
    

  
   
    </>
  )
}

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