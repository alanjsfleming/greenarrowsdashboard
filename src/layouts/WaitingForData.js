import React from 'react'
import { Link } from 'react-router-dom'

export default function WaitingForData() {
  return (
    <div className="text-center alert-warning alert">
        <h3>Waiting for data...</h3>
        <div className="spinner-border text-warning" role="status">
            <span className="sr-only">Waiting for data...</span>
        </div>
        <p className="text-sm">If this is taking a long time, check your Dweet Thing name is correct in the settings and make sure your car is online.</p>
        <Link to="/configure?1" className="btn btn-warning btn-block">Settings</Link>
    </div>
  )
}
