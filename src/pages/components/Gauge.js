import React, { useEffect, useRef } from 'react'

// make this correct and use props
export default function Gauge(data,upper,lower,title) {
    
    const gaugeElement = useRef();
    

    
    function setGaugeValue(gauge,data,lower,upper) {         
        gaugeElement.current.querySelector(".gauge-fill").style.transform = `rotate(${(data.data-data.lower)/(data.upper-data.lower)/2}turn)`;
        gaugeElement.current.querySelector(".gauge-cover").textContent = `${data.data}`;
    }

    // This doesnt make sense
    useEffect(() => {
        setGaugeValue(gaugeElement.current,data,upper,lower)
    },[data])


  return (
    <>
    <div class="gauge-holder">
        <div class="gauge" id={title} ref={gaugeElement}>
            <div class="gauge-body">
                <div class="gauge-fill"></div>
                <div class="gauge-cover">
                </div>  
            </div>
        </div>
    </div>
    </>
  )
}


