import React from 'react'
import Telemetry from './Telemetry'

export default function Dashboard({telemetry,settings}) {
  return (
    telemetry.map(telemetry => {
        return <Telemetry telemetry={telemetry} settings={settings}/>
    })
  )
}
