import React from 'react'
import { Link } from 'react-router-dom'
import CarSummaryCard from './CarSummaryCard'
import Vis from './Vis'

export default function CarSummary(props) {



    // summary card has following props
    // // { 'title' : 'V1', 'units' : 'V', 'kind' : 'gauge', 'data' : 12 }
  return (
    <div class="card car-summary">
        <Link class="summary-link" to="/details">
        <div class="card-header">
          
            <h3>{props.name}</h3>
            
        </div>
        </Link>
        <div class="card-body car-summary-vis">
            <CarSummaryCard title={'V1'} units={'V'} kind={'gauge'} data={10.5}/>
            <CarSummaryCard />
            <CarSummaryCard />
        </div>
        

    </div>
  )
}
