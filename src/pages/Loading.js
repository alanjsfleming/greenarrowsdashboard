import React, { useEffect } from 'react'
import Emoji from './components/Emoji'

export default function Loading() {

    function animateDots() {
        let dots = document.getElementById("dots");
        if (dots.innerHTML.length > 3)
            dots.innerHTML = "";
        else
            dots.innerHTML += ".";
    }

    useEffect(() => {
    setInterval(animateDots, 300);
    },[])

  return (
    <div class="loading">
        <Emoji symbol="🦉" label="owl"/>
        <br></br>
        <h1 class="fixed position-static">Loading</h1><h1 id="dots"></h1>
    </div>
    
  )
}
