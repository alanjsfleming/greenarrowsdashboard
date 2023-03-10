import React from 'react'
import Vis from './Vis'

export default function CarSummaryCard(props) {

// props are each summary element
// { 'title' : 'V1', 'units' : 'V', 'kind' : 'gauge', 'data' : 12 }



  return (
    <>
            <div class="card summary-card">      
                <Vis kind={props.kind} data={props.data} title={props.title} units={props.units}/>
                <div class="summary-card-label px-4 my-1">
                    <span>{props.title}:</span>
                 
                    <span>{props.data}{props.units}</span>
                </div>
            </div>
    </>
  )
}
