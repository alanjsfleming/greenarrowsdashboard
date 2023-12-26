import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { doc } from 'firebase/firestore'

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



  return (
    <div>Settings</div>
  )
}
