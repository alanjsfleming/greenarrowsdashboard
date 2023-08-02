import React from 'react'
import { Link } from 'react-router-dom'
import Emoji from './Emoji'
// landing page at - appname.co.uk
// have this as    - dash.appname.co.uk/login

// This is the log in page that gets redirected to from landing page.


export default function MenuBar() {
  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <nav className="navbar sticky-top" id="topOfPage">
        <a className="navbar-brand menuBar py-1 my-2" href="https://dashowl.co.uk">
            <Emoji symbol="🦉" label="owl" />DashOwl</a>
        
    </nav>
    </>
  )
}