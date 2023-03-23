import React from 'react'
import Vis from './Vis'

export default function CarSummaryCard(props) {

// props are each summary element
// { 'title' : 'V1', 'units' : 'V', 'kind' : 'gauge', 'data' : 12 }
// change 'kind' to 'type' to match the Vis component


  return (
    <>
            <div class="card summary-card">      
                <Vis kind={props.kind} data={props.data} title={props.title} units={props.units}/>
                <div class="card-body">
                    <h5 class="card-title">{props.title}:</h5>
                 
                    <h6 class="card-text">{props.data}{props.units}</h6>
                </div>
            </div>
    </>
  )
}
