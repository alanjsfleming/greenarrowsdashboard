import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
// functions to add events which measure how users interact with your app

// sign up
export function logSignUp() {
    logEvent(analytics, "sign_up");
}

// login
export function logLogin() {
    logEvent(analytics, "login");
}

// password reset
export function logPasswordReset() {
    logEvent(analytics, "password_reset");
}

// start race 
export function logStartRace() {
    logEvent(analytics,'start_race')
}


// reset race
export function logResetRace() {
    logEvent(analytics,'reset_race')
}

// on settings change, log battery capacity, race length
export function logSettingsChange(batteryCapacity,raceLength) {
    logEvent(analytics,'settings_change',{
        battery_capacity: batteryCapacity,
        race_length: raceLength
    })
}


// 