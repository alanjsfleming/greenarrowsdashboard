import React, { useEffect,useState } from 'react'
import Emoji from './components/Emoji'

export default function Loading() {

    const [dots, setDots] = useState("")

    function animateDots() {
        let dots = document.getElementById("dots");
        if (dots.innerHTML.length > 3) {
            dots.innerHTML = "";
            setDots('restart')
        }
        else {
            dots.innerHTML += ".";
            setDots(dots.innerHTML)
        }
    }

    useEffect(() => {
    setTimeout(animateDots, 300);
    },[dots])



  return (
    <div class="loading">
        <Emoji symbol="🦉" label="owl"/>
        <br></br>
        <h1 class="fixed position-static">Loading</h1><h1 id="dots"></h1>
    </div>
    
  )
}
