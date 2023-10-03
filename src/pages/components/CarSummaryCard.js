import React from 'react'
import Vis from './Vis'

export default function CarSummaryCard({kind,data,title,units,plannedRundown}) {

// props are each summary element
// { 'title' : 'V1', 'units' : 'V', 'kind' : 'gauge', 'data' : 12 }
// change 'kind' to 'type' to match the Vis component

// if title = 'Battery' then show planned rundown of battery
  function showPlannedRundown() {
    if (plannedRundown===null) {return null}
    if (title==='Battery') {
      return <p class="card-text">Planned: {plannedRundown}%</p>
    } else {
      return null
    }
  }


  return (
    <>
            <div class="card summary-card">      
                <Vis kind={kind} data={data} title={title} units={units}/>
                <div class="card-body">
                    <h5 class="card-title">{title}:</h5>
                 
                    <h6 class="card-text">{data}{units} {showPlannedRundown()}</h6>
                    
                </div>
            </div>
    </>
  )
}
