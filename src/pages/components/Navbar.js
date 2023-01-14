import React from 'react'
import { Link } from 'react-router-dom'

// landing page at - appname.co.uk
// have this as    - dash.appname.co.uk/login

// This is the log in page that gets redirected to from landing page.


export default function MenuBar() {
  return (
    <nav class="navbar navbar-expand-md navbar-light bg-light mb-4">
        <div class="container-fluid">
            <a class="navbar-brand underline" href="#">TelemetryInsights</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
                <li class="nav-item">
                    <a class="nav-link">Features</a>
                </li>
            </ul>
            <div class="d-flex">
                <a href="#"><button class="btn btn-primary">Register</button></a>
            </div>
        </div>
        </div>
    </nav>
  )
}