import React from 'react'
import Telemetry from './Telemetry'

export default function Dashboard({telemetry}) {
  return (
    telemetry.map(telemetry => {
        return <Telemetry key={telemetry.id} telemetry={telemetry}/>
    })
  )
}
