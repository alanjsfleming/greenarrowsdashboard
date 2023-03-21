import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'

export default function LapSummary(props) {

    const [lapData, setLapData] = useState([{num:1,aV1:12.1,aAH:3,aA:19,aSpeed:24},{num:2,aV1:11,aAH:4,aA:19,aSpeed:24},{num:3,aV1:10,aAH:3.5,aA:19,aSpeed:22},{num:4,aV1:10,aAH:3.5,aA:19,aSpeed:22}])
    const [manualLengthMode, setManualLengthMode] = useState(true)

    const [currentLapData, setCurrentLapData] = useState()

    const [runningData,setRunningData] = useState()

    useEffect(() => {
        try{
        setRunningData(props.settings.running_data)
        getCurrentLapData()
        } catch (error) {
            console.log(error)
        }

    },[props.settings])

    // Function that filters out the current lap data from the lapData array
    function getCurrentLapData(){
        const lapTime = "00:00:12"
   
        
        const AmpHours = Math.max(...runningData.map(data=>data.AH))
        setCurrentLapData(
            {   
                num:1,
                aV1:Math.round(calculateAverageValue(runningData.map(data=>data.V1))*10)/10,
                aAH:AmpHours,
                aA:Math.round(calculateAverageValue(runningData.map(data=>data.A))*10)/10,
                aSpeed:Math.round(calculateAverageValue(runningData.map(data=>data.Speed))*10)/10,
            })
      
    }

    function calculateAverageValue(array){
        let total = 0
        let count = 0
        array.forEach(function(item,index){
            total+=item;
            count++
        })
        return total/count
    }

    const LapComponent = () => (
        <table class="table table-striped text-center">
            <thead>
                <tr>
                    <th scope="col">Lap #</th>
                    <th scope="col">Time</th>
                    <th scope="col">AH</th>
                    <th scope="col">aV1  </th>
                    <th scope="col">aA</th>
                    <th scope="col">aSpeed (mph)</th>
                </tr>
            </thead>
            <tbody>
                <tr scope="row">
                    <th scope="col">Current</th>
                    <th scope="col">00:02:12</th>
                    <th scope="col">{currentLapData ? currentLapData.aAH : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aV1 : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aA : '-'}</th>
                    <th scope="col">20</th>
                </tr>

                <tr scope="row">
                    <th scope="col">Last</th>
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
        <div class="card-body car-summary-vis d-flex flex-column">
            <LapComponent />
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
    //{manualLengthMode && <small>(Manual Length Mode)</small>}
    // 