import React from 'react'
import { Link } from 'react-router-dom'
import CarSummaryCard from './CarSummaryCard'
import Vis from './Vis'
import WaitingForData from '../../layouts/WaitingForData'
import { calculateBatteryPercent } from '../../features/TelemetryCalculations'

export default function CarSummary(props) {
    // summary card has following props
    // // { 'title' : 'V1', 'units' : 'V', 'kind' : 'gauge', 'data' : 12 }
    // TODO: make the user be able to choose which metrics to display in the summary card. Up to 9. Make it a grid so it looks nice.

    function mapCarSummaries() {
        return props.summary.map((summary) => {
            return <CarSummaryCard title={summary.title} units={summary.units} kind={summary.kind} data={summary.data} />
        })
    }

    function calculatePlannedRundownPercentage(s) {
        // s = starttime
        if (s===null) {return null}
        const t = Date.now()

        const elapsedSeconds = (t-s)/1000 // get the elapsed time in seconds
        
        if (props.settings?.totalPitTime) {
            // Calculate % rundown according to plan and compensating for the pit stops
            return Math.round (100-(elapsedSeconds) * (100/(85+props.settings?.totalPitTime/1000/60)/60))
        }
        
        // Calculate the percentage rundown according to plan
        return Math.round(100-(elapsedSeconds) * (100/90/60)) // 100% - (elapsed seconds) * (100% / 90 minutes / 60 seconds)
    }   

  return (
    <div class="card car-summary mt-4">
        <Link class="summary-link" to="/details">
        <div class="card-header">
          
            <h3>{props.name}</h3>
            <small>Click here for more data</small>
        </div>
        </Link>
        <div class="card-body car-summary-vis">
        {(props.telemetry[0]) ? 
            <>
            <CarSummaryCard title={'V1'} units={'V'} kind={'gauge'} data={props.telemetry[0]['Vt']}/>
            <CarSummaryCard title={'Battery'} units={'%'} kind={'gauge'} data={calculateBatteryPercent(props.telemetry[0]['AH'],props.settings?.cars[0]?.battery_capacity)} plannedRundown={calculatePlannedRundownPercentage(props.settings?.race_start_time)}/>
            <CarSummaryCard title={'Amps'} units={'A'} kind={'gauge'} data={props.telemetry[0]['A']}/>
            
            </> : <WaitingForData />
            }
            </div>
    </div>
  )
}//Math.round(100-(props.telemetry[0]['AH']/28)*100)
// <CarSummaryCard title={'th Gear'} units={'th Gear'} kind={'gauge'} data={props.telemetry[0]['Gear']}/>