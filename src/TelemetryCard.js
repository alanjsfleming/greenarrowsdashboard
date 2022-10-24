import React from 'react'
import Vis from './Vis'

export default function TelemetryCard({title,data,units,kind}) {
  return (
    <div class="card">
        <Vis kind={kind} data={data} units={units} title={title}/>
        <div class="card-body">
          <h5 class="card-title">{title}</h5>
          <h6 class="card-text">{data}{units}</h6>
        </div>
      </div>
  )
}
