import React, { useRef } from 'react'
import MenuBar from './components/MenuBar'

export default function Configure() {




  return (
    <>
    <MenuBar/>
    <div class="card w-75">
        <div class="text-center">
            <a href="#account" class="btn btn-primary">Account</a>
            <a href="#cars" class="btn btn-primary">Cars</a>
            <a href="#data" class="btn btn-primary">Data</a>
            <a href="#appearance" class="btn btn-primary">Appearance</a>
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
            <li>List of data. For each: name, unit, upper, lower, vis type, category, jsonfieldname </li>
        </ul>

    </div>


    <div id="appearance">
        <h3>Appearance</h3>
        <ul>
            <li>Reorder</li>
        </ul>

    </div>

    </div>
    </>
  )
}
