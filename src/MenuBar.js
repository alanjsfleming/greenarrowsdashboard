import React from 'react'
import GALogo from './greenarrowslogocropped.png';


function openMenuFunction() {
  const x=document.getElementById("myTopnav");
  if (x.className==="nav-link-container") { 
    x.className +=" responsive"} 
  else {
    x.className = "nav-link-container";
  }
}


export default function MenuBar(settings) {
  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <nav class="navbar" id="topOfPage">
    <a href="#" class="navbar-brand menuBar">
          <img src={GALogo} height="25" alt="logo" id="navBarLogo" class="d-inline-block align-middle"></img>
          Green Arrows Dashboard</a>
        <div class="nav-link-container" id="myTopnav">
          <a href="#" class="menutabmove">GA1</a>
          <a href="#" class="menutabmove">GA2</a>
          <a href="#" class="icon" onClick={openMenuFunction}><i class="fa fa-bars"></i></a>
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
*/