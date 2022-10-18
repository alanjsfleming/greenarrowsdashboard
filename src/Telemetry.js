import React from 'react'

export default function Telemetry({telemetry}) {
  return (
    <div>{telemetry.name} : {telemetry.value}</div>
  )
}
