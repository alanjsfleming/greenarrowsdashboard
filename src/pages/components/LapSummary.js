import React,{useState} from 'react'
import { Link } from 'react-router-dom'

export default function LapSummary(props) {

    const [lapData, setLapData] = useState([{num:1,aV1:12.1,aAH:3,aA:19,aSpeed:24},{num:2,aV1:11,aAH:4,aA:19,aSpeed:24},{num:3,aV1:10,aAH:3.5,aA:19,aSpeed:22},{num:4,aV1:10,aAH:3.5,aA:19,aSpeed:22}])
    const [manualLengthMode, setManualLengthMode] = useState(true)

    const [currentLapData, setCurrentLapData] = useState()



    const LapComponent = () => (
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Time</th>
                    <th scope="col">AH</th>
                    <th scope="col">V1  </th>
                    <th scope="col">A</th>
                    <th scope="col">Speed (mph)</th>
                </tr>
            </thead>
            <tbody>
                <tr scope="row">
                    <th scope="col">Current</th>
                    <th scope="col">00:02:12</th>
                    <th scope="col">3</th>
                    <th scope="col">12.1</th>
                    <th scope="col">19.0</th>
                    <th scope="col">20</th>
                </tr>
        
                {lapData.map(lap=>(
                    <tr>
                        <th scope="row">{lap.num}</th>
                        <td>00:00:00</td>
                        <td>{lap.aAH}</td>
                        <td>{lap.aV1}</td>
                        <td>{lap.aA}</td>
                        <td>{lap.aSpeed}</td>
                        
                    </tr>
                ))}
            </tbody>
    
        </table>
    )

  return (
    <div class="card car-summary">
        <div class="card-header text-center">
            <h3>Laps</h3>
        </div>
        <div class="card-body car-summary-vis">
            <LapComponent/>
        </div>
        

    </div>
  )
}

/*
 {props.lapData.map(lap => (
    
         
            <div class="row">
                <h5 class="col">{lap.num}</h5>
                <h5>00:00:00</h5>
                <h5>{lap.aAH}</h5>
                <h5>{lap.aV1}</h5>
                <h5>{lap.aSpeed}</h5>
            </div>
        
    ))}
    */