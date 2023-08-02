import React from 'react'
import {Link} from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Emoji from './Emoji';



//<img src={GALogo} height="25" alt="logo" id="navBarLogo" class="d-inline-block align-middle"></img>
//🦉

// Need to set displayName when user signs up

export default function MenuBar(settings) {

  const { currentUser } = useAuth()

  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <nav className="navbar sticky-top" id="topOfPage">
    <Link to="/" style={{color:'inherit',textDecoration:'inherit'}}>
      <p className="navbar-brand menuBar">
          <Emoji symbol="🦉" label="owl" />
          {currentUser.displayName}</p></Link>
        <div className="nav-link-container" id="myTopnav">
          
        <Link to="/configure?0" className="icon"><i className="fa fa-gears" style={{fontSize:"21px"}}></i></Link>
        </div>
    </nav>
    </>
  )
}


/* <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navBarNavAltMarkup" aria-expanded="false" aria-label="Toggle Menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        
        </div>

        function openMenuFunction() {
  const x=document.getElementById("myTopnav");
  if (x.className==="nav-link-container") { 
    x.className +=" responsive"} 
  else {
    x.className = "nav-link-container";
  }
}

        <Link to="/ga1" style={{color:'inherit',textDecoration:'inherit'}}><a class="menutabmove">GA1</a></Link>
          <Link to="/ga2" style={{color:'inherit',textDecoration:'inherit'}}><a class="menutabmove">GA2</a></Link>
*/