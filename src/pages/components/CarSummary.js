import React from 'react'
import { Link } from 'react-router-dom'

export default function CarSummary(props) {
  return (
    <div class="card car-summary">
        <div class="card-header">
            <ul class="nav nav-pills card-header-pills">
                <li class="nav-item">
                    <Link to="/ga1"><a class="nav-link active">Details</a></Link>
                </li>
                <li class="nav-item ">
                    <h6 class="car-summary-title">{props.name} Summary</h6>
                </li>
            </ul>
        </div>
        <div class="card-body">
            <p class="card-text">Battery : 70% , Time : 00:45:00</p>
        </div>

    </div>
  )
}
