import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { doc } from 'firebase/firestore'
import { remove } from 'firebase/database';

export default function Settings() {

    // Firebase
    const { currentUser } = useAuth()
    const userDocRef = doc(db,"users",currentUser.uid);

    // Local storage key
    const LOCAL_STORAGE_SETTINGS_KEY='dashboardApp.settings'

    // On page load, get settings from local storage
    const getInitialSettings = () => {
        const storedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
        return storedSettings ? storedSettings : null;
    }

    const [settings,setSettings] = useState(getInitialSettings());
    const [error,setError] = useState('')
    const [success,setSuccess] = useState('')
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
    
    


  return (
    <div>Settings</div>
  )
}
