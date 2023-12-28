import React, { useEffect,useState } from 'react'

export default function DataLastReceived({time}) {
    // elapsed time < 10s = lightblue
    // 10 < elapsed time < 30s = yellow
    // elapsed time > 30s = red and change text to say ">30"
    // dataLastReceived-red
    // dataLastReceived-yellow
    // dataLastReceived-lightblue

    const [color,setColor] = useState("dataLastReceived-red")
    const [iconColor,setIconColor] = useState(["#DC3544","danger"])
    const [elapsedTime,setElapsedTime] = useState('over 30')

    useEffect(() => {
        const interval = setInterval(() => {
        const temporaryElapsed = Math.round((Date.now()-Date.parse(time))/1000)
        if ( temporaryElapsed< 10000) {
            setElapsedTime(temporaryElapsed)
            setColor(["#2ca2b8","info"])
        } else if (temporaryElapsed < 30000) {
            setElapsedTime(temporaryElapsed)
            setColor(["#fcc108","warning"])
        } else {
            setElapsedTime('over 30')
            setColor(["#DC3544","danger"])
        }} , 1000)
    }, [time])

    // Change color based on elapsed time

    
  return (
    <div className={"w-75 m-auto px-1 d-flex justify-content-around border rounded "+color[0]+" "+"border-"+color[1]}>
        <div>
            <i class="fa fa-cloud-download" style={{color:color[0]}}></i> 
            <small style={{color:color[0]}}> Latest data {elapsedTime}s ago</small>
        </div>
    </div>
  )
}
