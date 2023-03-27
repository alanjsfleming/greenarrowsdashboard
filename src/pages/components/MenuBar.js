import React from 'react'
import GALogo from '../../images/greenarrowslogocropped.png';
import {Link} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Emoji from './Emoji';



//<img src={GALogo} height="25" alt="logo" id="navBarLogo" class="d-inline-block align-middle"></img>
//🦉

export default function MenuBar(settings) {

  const { currentUser } = useAuth()

  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <nav class="navbar sticky-top" id="topOfPage">
    <Link to="/" style={{color:'inherit',textDecoration:'inherit'}}>
      <a href="www.dashowl.co.uk" class="navbar-brand menuBar">
          <Emoji symbol="🦉" label="owl" />
          {currentUser.displayName}</a></Link>
        <div class="nav-link-container" id="myTopnav">
          
          <Link to="/configure?0" class="icon"><i class="fa fa-bars"></i></Link>
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