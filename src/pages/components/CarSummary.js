import React from 'react'
import { Link } from 'react-router-dom'
import CarSummaryCard from './CarSummaryCard'
import Vis from './Vis'

export default function CarSummary(props) {



    // summary card has following props
    // // { 'title' : 'V1', 'units' : 'V', 'kind' : 'gauge', 'data' : 12 }
    // TODO: make the user be able to choose which metrics to display in the summary card. Up to 9. Make it a grid so it looks nice.

    function mapCarSummaries() {
        return props.summary.map((summary) => {
            return <CarSummaryCard title={summary.title} units={summary.units} kind={summary.kind} data={summary.data} />
        })
    }

  return (
    <div class="card car-summary mt-4">
        <Link class="summary-link" to="/details">
        <div class="card-header">
          
            <h3>{props.name}</h3>
            
        </div>
        </Link>
        <div class="card-body car-summary-vis">
        {(props.telemetry[0]) ? 
            <>
            <CarSummaryCard title={'V1'} units={'V'} kind={'gauge'} data={props.telemetry[0]['Vt']}/>
            <CarSummaryCard title={'Battery'} units={'%'} kind={'gauge'} data={Math.round(100-(props.telemetry[0]['AH']/28)*100)} />
            <CarSummaryCard title={'Amps'} units={'A'} kind={'gauge'} data={props.telemetry[0]['A']}/>
            
            </> : <h3>Fetching data...</h3>
            }
            </div>
        

    </div>
  )
}
// <CarSummaryCard title={'th Gear'} units={'th Gear'} kind={'gauge'} data={props.telemetry[0]['Gear']}/>