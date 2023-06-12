import React from 'react'
import { Link } from 'react-router-dom'


export default function ContentLocked(props) {

 

  return (
    <div class="d-flex flex-column justify-content-around">
        <div class="text-center my-2">Not available in current plan.</div>
        <Link to={"/upgrade-plan?fromApp=true&currentPlan="+props.role} class="btn align-self-center btn-outline-dark">Upgrade Plan</Link>
    </div>
  )
}
