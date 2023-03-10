import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import MenuBar from './MenuBar'


// change this all to be a modal?
export default function Configure() {




  return (
    <>
    <MenuBar />

    <div class="px-2">
        <div class="text-center">
            <a href="#account" class="btn btn-primary">Account</a>
            <a href="#cars" class="btn btn-primary">Cars</a>
            <a href="#data" class="btn btn-primary">Data</a>
            <a href="#appearance" class="btn btn-primary">Appearance</a>
        </div>

        <div class="tab">
            <h3>Account</h3>
            <div class="form-group">
                <label for="team-name">Team Name</label>
                <input type="text" class="form-control" id="team-name" placeholder="Enter team name"></input>
            </div>

            <Link to="/reset-password">Reset Password Here</Link>
        </div>

        <div class="tab">
            <h3>Cars</h3>

            <div>
                <h4>Car 1: GA1</h4>
                <div class="form-group">
                    <label for="car-name">Car Name</label>
                    <input type="text" class="form-control" id="car-name" placeholder="My Car"></input>
                </div>

                <div class="form-group">
                    <label for="dweet-url">Dweet Thing name</label>
                    <input type="text" class="form-control" id="dweet-url" placeholder="Thing name"></input>
                </div>

                <div class="form-group">
                    <label for="amp-hours">Battery Capacity (Amp Hours)</label>
                    <input type="number" class="form-control" id="amp-hours" placeholder="28"></input>
                </div>

                <div class="form-group">
                    <label for="teeth-gear">Teeth on larger gear</label>
                    <input type="number" class="form-control" id="teeth-gear" placeholder="58"></input>
                </div>
            </div>

            <br></br>
            <button type="button" class="btn btn-primary btn-block">Add new</button>
        </div>
        <button type="button" class="btn btn-primary btn-block my-1">Save</button>
    </div>

    
    <div id="account">
        <h3>Account</h3>
        <ul>
            <li>Change team name</li>
            <li>Reset password</li>
            <li>Overview settings</li>
        </ul>
    </div>

    <div id="cars">
        <h3>Cars</h3>
        <ul>
            <li>Update Dweet URL</li>
        </ul>
        <p>Add new</p>
    </div>

    <div id="data">
        <h3>Data</h3>
        <ul>
            <li>List of data. For each: name, unit, upper, lower, vis type, category</li>
        </ul>

    </div>


    <div id="appearance">
        <h3>Appearance</h3>
        <ul>
            <li>Reorder</li>
        </ul>
    </div>

   
    </>
  )
}
