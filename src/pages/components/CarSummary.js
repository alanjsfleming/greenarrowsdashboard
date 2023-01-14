import React from 'react'
import { Link } from 'react-router-dom'

export default function CarSummary(props) {
  return (
    <div class="card car-summary">
        <div class="card-header">
            <ul class="nav nav-pills card-header-pills">
                <li class="nav-item">
                    <Link to="/ga1"><a class="nav-link active">{props.name}</a></Link>
                </li>
            </ul>
        </div>
        <div class="card-body">
            <p class="card-text">Battery : 70% , Amps: 24A</p>
        </div>

    </div>
  )
}
