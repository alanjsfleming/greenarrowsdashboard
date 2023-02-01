import React from 'react'
import { startTime, raceOngoing } from '../../contexts/RaceContext'

export default function RacePanel() {
  return (
    <div class="card">
        <div class="card-header">
            <h5 class="card-title mt-1">Race</h5>
        </div>
        <div class="card-body">
            <progress class="progress" min="0" max="100" value={elapsedTimeIntoValue}></progress>
            <ul>
                <button class="btn btn-primary mx-1">Start</button>
                <button class="btn btn-primary mx-1">Reset</button>
                <button class="btn btn-primary mx-1">Setup</button>
            </ul>
        </div>
    </div>
  )
}
