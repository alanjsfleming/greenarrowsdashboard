import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import MenuBar from '../layouts/MenuBar';
import { Link } from 'react-router-dom';
import { ref, remove, set } from "firebase/database";
import app, { rtdb } from '../firebase';
import { postSettingsToDatabase } from '../features/Settings/postSettingsToDatabase';
import { getCheckoutUrl, getPortalUrl } from '../stripe/stripePayment.ts';
import { useNavigate } from 'react-router-dom';
import { getMembershipStatus } from '../stripe/getMembershipStatus.ts';


export default function Settings() {

    // Firebase
    const { currentUser, updatedisplayname, isMember } = useAuth()

    // Navigate
    const navigate = useNavigate()  

    // Local storage key
    const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'

    // On page load, get settings from local storage
    const getInitialSettings = () => {
        const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
        return storedSettings ? storedSettings : null;
    }

    const [settings,setSettings] = useState(getInitialSettings());
    const [formSettings,setFormSettings] = useState(getInitialSettings());

    const [error,setError] = useState('')
    const [success,setSuccess] = useState('')

    const [loading,setLoading] = useState(false)
    const [billingLoading,setBillingLoading] = useState(false)

    const [currentTab,setCurrentTab] = useState(window.location.href.split('?')[1] || '0')
    const [carDropdownShown,setCarDropdownShown] = useState(false)

    // UI functions
    // Determine if a tab should be hidden or not
    function determineHide(tab) {
      if (tab === parseInt(currentTab)) {
        return false
      } else {
        return true
      }
    }

    // Determine if a tab has the active class
    function determineActive(tab) {
      if (tab === parseInt(currentTab)) {
        return 'active'
      } else {
        return ''
      }
    }

    // Change tab when clicked
    function changeTab(e) {
      setCarDropdownShown(false)
      if (e.target.value) {
        setCurrentTab(e.target.value)
      } else {
        setCurrentTab(e.target.parentElement.getAttribute('data-value'))
      }
    }

    // Hide popup alerts
    function hideAlerts() {
      setError('')
      setSuccess('')
    }

    const handleAccountChange = (e) => {
      const { name, value } = e.target;
      setFormSettings({...formSettings,[name]:value})
    }

    const handleCarChange = (index,e) => {
      const { name, value } = e.target;
      const newCars = [...formSettings.cars];
      newCars[index][name] = value;
      setFormSettings({...formSettings,cars:newCars})
    }

    // Relook at this
    function resetRunningData() {
      const rtCarRef = ref(rtdb,`teams/${currentUser.uid}/${settings.cars[0].id}`)
      try {
        remove(rtCarRef).then(() => {
          setSuccess('Running data reset')
          setSettings(prevSettings=>({
            ...prevSettings,
            running_data:[]
          }))
        })

      } catch (e) {
        setError('Could not reset running data')
      }
    }

    useEffect(() => {
      console.log('Form settings changed')
      console.log(formSettings)
    }
    ,[formSettings])
    
    const handleSaveSettings = async (e) => {
      hideAlerts();
      setLoading(true)
      // Save formSettings
      try {
        await postSettingsToDatabase(currentUser.uid,formSettings)
        await updatedisplayname(formSettings.team_name)
        console.log("SAVING THIS",formSettings)  
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY,JSON.stringify(formSettings))
        setLoading(false)
        setSuccess('Settings saved')
        setError('')
      } catch (e) {
        console.log(e)
        setSuccess('')
        setError('Could not save settings')
        setLoading(false)
      }
    }

    const handleUpgradeToMember = async () => {
      setBillingLoading(true);
      const priceId = "price_1OUEJ9DW8WPlqGXzTSo4jAK0";
      const checkoutUrl = await getCheckoutUrl(app,priceId);

      // Navigate doesnt work here so use 
      // navigate(checkoutUrl); 

      // Navigate to checkout url 
      window.location.href = checkoutUrl;

    }

    const handleManageBilling = async () => {
      setBillingLoading(true);
      const portalUrl = await getPortalUrl(app);
      window.location.href = portalUrl;
    }

  return (
    <>
    <MenuBar />

    <div className="d-flex flex-column justify-content-between text-center mb-5 configure-dash">
      <div className="text-center mx-1 btn-group" role="group" aria-label="Settings Tab">
        <button value="0" className={"btn btn-secondary col-3 "+determineActive(0)} onClick={changeTab}>Account</button>
        <button value="1" className={"btn btn-secondary col-3 "+determineActive(1)} onClick={changeTab}>Cars</button>
        <button value="2" className={"btn btn-secondary col-3 "+determineActive(2)} onClick={changeTab}>Data</button>
        <button value="3" className={"btn btn-secondary col-3 "+determineActive(3)} onClick={changeTab}>Layout</button>
      </div>

      <h1 className="pt-2 pb-3">Settings</h1>


      {error && <p onClick={hideAlerts} className="alert alert-danger">{error}</p>}
      {success && <p onClick={hideAlerts} className="alert alert-success">{success}</p>}

      <form>

        <div className="tab mx-1" hidden={determineHide(0)}>
          <h3>Account</h3>
          <div className="form-group my-3">
            <label htmlFor="team_name">Team Name</label>
            <input 
              type="text"
              className="form-control"
              name="team_name"
              value={formSettings?.team_name || ''}
              onChange={handleAccountChange}
              placeholder="Team Name"
              />
          </div>

          <hr></hr>

          <button hidden={isMember} onClick={handleUpgradeToMember} className="btn btn-primary btn-block" type="button" >
            {billingLoading ? 
            <div className="spinner-border text-light spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div> 
            : 
            "Upgrade"
            }
          </button>

          <button hidden={!isMember} onClick={handleManageBilling} className="btn btn-dark btn-block" type="button" >
            {billingLoading ? 
            <div className="spinner-border text-light spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div> 
            : 
            "Manage Billing"
            }
          </button>

          <hr></hr>
          <Link to="/reset-password" className="btn btn-outline-dark btn-block">
            Reset Password
          </Link>
          <Link to="/logout" className="btn btn-outline-dark btn-block my-2">
            Logout
          </Link>

          <div className="border-top mt-2">
            <h3 className="mt-2">DashOwl</h3>
            <a href="https://www.vis.dashowl.co.uk" className="btn btn-outline-dark btn-block">eChook Logfile Visualiser</a>
          </div>
        </div>

        <div className="tab mx-1" hidden={determineHide(1)}>
          <h3>Cars</h3>
          {settings?.cars ? settings.cars.map((car,index)=>(
            <div className="card w-100 m-auto mb-2">
              <div className="card-header w-100 h-100 p-0" data-value={index+4} onClick={changeTab}>
                <h4 className="card-title p-2 m-0">{car.car_name}</h4>
              </div>
            </div>
          )) : <p>No cars found</p>}
        </div>

        <div className="tab mx-1" hidden={determineHide(2)}>
          <h3>Race</h3>
          <div className="form-group my-3">
            <label htmlFor="race_length">Race Length (mins)</label>
            <input 
              type="number"
              className="form-control"
              name="race_length"
              value={formSettings?.race_length || 90}
              onChange={handleAccountChange}
              placeholder="90" 
            />
          </div>

          <div className="form-group my-3">
            <label htmlFor="track_length">Manual Track Length (m)</label>
            <input 
              type="number"
              className="form-control"
              name="track_length"
              value={formSettings?.track_length || 2500}
              onChange={handleAccountChange}
              placeholder="2500"
            />
          </div>

          <div className="form-group my-3">
            <label htmlFor="manual_lap_mode">Lap Increments by Distance</label>
            <select 
              className="form-control"
              name="manual_lap_mode"
              value={formSettings?.manual_lap_mode || 'false'}
              onChange={handleAccountChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <button className="btn btn-danger btn-block" type="button" onClick={resetRunningData}>Reset Recorded Data</button>
        </div>

        <div className="tab mx-1" hidden={determineHide(3)}>
          <h3>Layout</h3>
          <div className="form-group my-3">
            <label htmlFor="summary_map">Location Map</label>
            <select 
              className="form-control"
              name="summary_map"
              value={formSettings?.summary_map || 'true'}
              onChange={handleAccountChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="form-group my-3">
            <label htmlFor="lap_summary_table">Lap Summary Table</label>
            <select 
              className="form-control"
              name="lap_summary_table"
              value={formSettings?.lap_summary_table || 'false'}
              onChange={handleAccountChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="fixed-bottom">
          <button onClick={handleSaveSettings} className="btn btn-primary btn-block" type="button" >
            {loading ? 
            <div class="spinner-border text-light spinner-border-sm" role="status">
              <span class="sr-only">Loading...</span>
            </div> 
            : 
            "Save"
            }
          </button>
        </div>
      </form>

      <form>
      {formSettings?.cars ? formSettings.cars.map((car,index)=>(
        <div key={index} className="tab mx-1" hidden={determineHide(index+4)}>
          <div className="card w-100 m-auto">
            <div className="card-header">
              <h4 className="card-title">Car: {car?.car_name || 'My Car'}</h4>
            </div>
            <div className="card-body">
              <div className="form-group my-3">
                <label htmlFor="car_name">Car Name</label>
                <input 
                  type="text"
                  className="form-control"
                  name="car_name"
                  value={car?.car_name || 'My Car'}
                  onChange={(e)=>handleCarChange(index,e)}
                  placeholder="Car Name"
                  />
              </div>

              <div className="form-group my-3">
                <label htmlFor="dweet_name">Dweet Thing Name</label>
                <input 
                  type="text"
                  className="form-control"
                  name="dweet_name"
                  value={car?.dweet_name || ''}
                  onChange={(e)=>handleCarChange(index,e)}
                  placeholder="Dweet Thing Name"
                  />
              </div>

              <div className="form-group my-3">
                <label htmlFor="battery_capacity">Battery Capacity (Ah)</label>
                <input 
                  type="number"
                  className="form-control"
                  name="battery_capacity"
                  value={car?.battery_capacity || 25}
                  onChange={(e)=>handleCarChange(index,e)}
                  placeholder="Battery Capacity"
                  />
              </div>

              <div className="form-group my-3">
                <label htmlFor="reverse_gearing_mode">Reverse Gearing Mode</label>
                <select 
                  className="form-control"
                  name="reverse_gearing_mode"
                  value={car?.reverse_gearing_mode || 'false'}
                  onChange={(e)=>handleCarChange(index,e)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="form-group my-3">
                <label htmlFor="motor_gear_teeth">Number of teeth on motor gear</label>
                <input
                  type="number"
                  className="form-control"
                  name="motor_gear_teeth"
                  value={car?.motor_gear_teeth || 20}
                  onChange={(e)=>handleCarChange(index,e)}
                  placeholder="Motor Gear Teeth"
                />
              </div>

              <div className="form-group my-3">
                <label htmlFor="axle_gear_teeth">Number of teeth on axle gear</label>
                <input
                  type="number"
                  className="form-control"
                  name="axle_gear_teeth"
                  value={car?.axle_gear_teeth || 60}
                  onChange={(e)=>handleCarChange(index,e)}
                  placeholder="Axle Gear Teeth"
                />
              </div>

              <div className="form-group my-3">
                <label htmlFor="gear_number_offset">Gear Number Offset</label>
                <br></br>
                <small>You can adjust this if your gear number is showing consistently off.</small>
                <input
                  type="number"
                  className="form-control"
                  name="gear_number_offset"
                  value={car?.gear_number_offset || 0}
                  onChange={(e)=>handleCarChange(index,e)}
                  placeholder="Gear Number Offset"
                />
              </div>

              <div className="form-group my-3">
                <label htmlFor="battery_offset">Battery Offset</label>
                <br></br>
                <small>You can adjust this if you accidently reset the Amp Hours used during the race.</small>
                <input
                  type="number"
                  className="form-control"
                  name="battery_offset"
                  value={car?.battery_offset || 0}
                  onChange={(e)=>handleCarChange(index,e)}
                  placeholder="Battery Offset"
                />
              </div>

              

            </div>
          </div>
        </div>

      )) : <p>No cars found</p>}
      </form>
    </div>
    </>
  )
}

/*
<div className="form-group my-3">
            <label htmlFor="planned_battery_usage"></label>


            */