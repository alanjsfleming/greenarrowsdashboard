import React, { useState } from 'react'
import { useRace } from '../../contexts/RaceContext'


export default function RacePanel() {
  const { resetrace } = useRace()
  const [resetButton,setResetButton] = useState('Reset')

  function handleReset(e){
    if (resetButton==='Confirm') {
      resetrace()
      setResetButton('Reset')
    } else {
      setResetButton('Confirm')
    }
  }

  return (
    <div class="card car-summary">
        <div class="card-header">
            <h5 class="card-title mt-1">Race</h5>
        </div>
        <div class="card-body">
            <progress class="progress" min="0" max="100" ></progress>
            <ul>
                <button class="btn btn-primary mx-1">Start</button>
                {(resetButton==='Reset') ? <button onClick={handleReset} class="btn btn-primary mx-1">Reset</button> : <button onClick={handleReset} class="btn btn-danger mx-1">Reset</button>}
                <button class="btn btn-primary mx-1">Setup</button>
            </ul>
        </div>
    </div>
  )
}
// value={elapsedTimeIntoValue}