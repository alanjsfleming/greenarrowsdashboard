import React, { useRef, useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import MenuBar from './MenuBar'


// change this all to be a modal?
export default function Configure() {

    const [currentTab,setCurrentTab] = useState(window.location.href.split('?')[1])
    const [settings,newSettings] = useState([])
    const [error,setError] = useState()
    const [success,setSuccess] = useState()

    const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'

    useEffect(() => {
        const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
        if (storedSettings) {newSettings(storedSettings)};
     
      },[]) 


    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
        
    },[settings])

    function determineHide(tab) {
        if (tab === parseInt(currentTab)) {
            return false
        } else {
            return true
        }
    }

    function determineActive(tab) {
        if (tab === parseInt(currentTab)) {
            return "active"
        } else {
            return ""
        }
    }

    function changeTab(e) {
        setCurrentTab(e.target.value)
        console.log(settings)
      
    }

    function handleSaveSettings() {
        try {
            setError()
            setSuccess('Settings saved successfully!')
            
        } catch (e){
            setSuccess()
            setError('Failed to save settings: ' + JSON.stringify('error'))
        }
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

    function hideAlerts() {
        setError()
        setSuccess()
    }


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

        {error && <p onClick={hideAlerts} className="alert alert-danger alert-dismissible">{error}</p>}
        {success && <p onClick={hideAlerts} className="alert alert-success alert-dismissible">{success}</p>}

        <div class="tab" hidden={determineHide(0)}>
            <h3>Account</h3>
            <div class="form-group my-3">
                <label for="team-name">Change Team Name</label>
                <input type="text" class="form-control" id="team-name" placeholder="Team name"></input>
            </div>

            <Link to="/reset-password"><button class="btn btn-outline-dark btn-block">Reset Password Here</button></Link>

            <Link to="/logout"><button class="btn btn-dark btn-block my-2">Logout</button></Link>
        </div>

        <div class="tab" hidden={determineHide(1)}>
            <h3>Cars</h3>

            <div class="card w-100 m-auto">
                <div class="card-header">
                    <h4 class="card-title">Car 1: GA1</h4>
                </div>
                <div class="card-body">
                <div class="form-group">
                    <label for="car-name">Car Name</label>
                    <input type="text" class="form-control" id="car-name" placeholder="My Car"></input>
                </div>

                <div class="form-group my-3">
                    <label for="dweet-url">Dweet Thing name</label>
                    <input type="text" class="form-control" id="dweet-url" placeholder="Thing name"></input>
                </div>

                <div class="form-group my-3">
                    <label for="amp-hours">Battery Capacity (Amp Hours)</label>
                    <input type="number" class="form-control" id="amp-hours" placeholder="28"></input>
                </div>

                <div class="form-group my-3">
                    <label for="teeth-gear">Teeth on larger gear</label>
                    <input type="number" class="form-control" id="teeth-gear" placeholder="58"></input>
                </div>
                </div>
            </div>

        

            <br></br>
            <button type="button" disabled class="btn btn-primary btn-block">Add new</button>
        </div>

        <div class="tab" hidden={determineHide(2)}>
            <h3>Race</h3>
            <div class="form-group my-3">
                <label for="race-length">Race Length (mins)</label>
                <input type="number" class="form-control" id="race-length" placeholder="90"></input>
            </div>

            <div class="form-group my-3">
                <label for="track-length">Manual Track Length (m)</label>
                <input type="number" class="form-control" id="track-length" placeholder="3800"></input>
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