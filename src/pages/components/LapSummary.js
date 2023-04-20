import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import ContentLocked from './ContentLocked'

export default function LapSummary(props) {

    const [lapData, setLapData] = useState([])
    const [manualLengthMode, setManualLengthMode] = useState(true)

    const [currentLapData, setCurrentLapData] = useState()
    const [currentLapNum, setCurrentLapNum] = useState()
    const [runningData,setRunningData] = useState([])

    // Determine if user is allowed to access this content
    const [allowedPermissions, setAllowedPermissions] = useState(false)    
    useEffect(() => {
        try {
            if (props.settings.role === 'pro' || props.settings.role === 'standard') {
                setAllowedPermissions(true)
            }
        } catch(error) {
            console.log(error)
        }
    },[props.settings])

    // VCq7rqiEK4qbGd7qZ4C0 GA1 



    useEffect(() => {
        try{
        (props.settings.running_data) && setRunningData(props.settings.running_data)
        setCurrentLapNum(calculateCurrentLapNum());
        getCurrentLapData();
        } catch (error) {
            console.log(error);
        }
        console.log(currentLapNum)
    },[props.settings])

    function elapsedTimeIntoString(elapsedTime) {
        const mins=Math.floor(elapsedTime/1000/60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const seconds=Math.round((elapsedTime/1000)%60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
        const string = `${mins}:${seconds}`
        
        return string
      }

    // Use effect to call calculateAllLapData when the currentLapNum changes
    useEffect(() => {
        try{
            calculateAllLapData(filterSeparateLaps());
        } catch (error) {
            console.log(error);
        }
    },[currentLapNum])

    // FIX THIS
    // Function filter separate laps, which finds the indexes of the first and last data point of each lap and filters into n number of laps separate arrays
    function filterSeparateLaps() {
        // For each lap, find the first and last index of the lap
        let lapDataArrays = []
        for (var i = 0; i < currentLapNum; i++) {
            // Automatic lap mode
            if (!props.settings.manualLapMode) {
                const firstIndex = runningData.findIndex(data=>data.Lap===i)
                const lastIndex = runningData.findLastIndex(data=>data.Lap===i)
                // Filter the runningData array into n number of arrays, each containing the data for each lap
                lapDataArrays.push(runningData.slice(firstIndex,lastIndex+1))

            // Manual Lap Mode
            } else {
                const firstDist = i*props.settings.trackLength
                const lastDist = (i+1)*props.settings.trackLength
                // Filter the runningData array into n number of arrays, each containing the data for each lap
                lapDataArrays.push(runningData.filter(function(data) {
                    return data.Distance >= firstDist && data.Distance < lastDist
                    }
                ))
            }
            console.log(lapDataArrays)
        }
        return lapDataArrays
    }


    // It is trying to access undefined values in the lapDataArrays, add a check to see if the value is undefined before accessing
    function calculateAllLapData(lapDataArrays) {
        // For each lap, find the average of V1, A, and Speed
        const averages = lapDataArrays.map((lapDataArray,index) => {
            console.log(lapDataArrays)
            return {
                num:index+1,
                time:((lapDataArray.at(-1)?.timestamp) && (lapDataArray[0]?.timestamp)) ? elapsedTimeIntoString(lapDataArray.at(-1).timestamp-lapDataArray[0].timestamp) : "-",
                AH:((lapDataArray.at(-1)?.AH) && (lapDataArray[0]?.AH)) ? Math.round((lapDataArray.at(-1).AH-lapDataArray[0].AH)*10)/10 : "-",
                aV1:Math.round(calculateAverageValue(lapDataArray.map(data=>data.V1))*10)/10,
                aA:Math.round(calculateAverageValue(lapDataArray.map(data=>data.A))*10)/10,
                aSpd:Math.round(calculateAverageValue(lapDataArray.map(data=>data.Speed))*10)/10
            }
        }) 
        // Return an array of objects, each containing the average data for each lap
        setLapData(averages)
    }

    function calculateCurrentLapNum() {
        
        if (props.settings.manualLapMode) {
            return runningData.at(-1).Distance/props.settings.trackLength
            
        } else {
            return runningData.at(-1).Lap
        }
    }

    // Function that filters out the current lap data from the lapData array
    function getCurrentLapData(){
        const lapTime = "00:00:12"
        
        
        const AmpHours = Math.max(...runningData.map(data=>data.AH))
        setCurrentLapData(
            {   
                num:1,
                aV1:Math.round(calculateAverageValue(runningData.map(data=>data.V1))*10)/10,
                AH:AmpHours,
                aA:Math.round(calculateAverageValue(runningData.map(data=>data.A))*10)/10,
                aSpd:Math.round(calculateAverageValue(runningData.map(data=>data.Speed))*10)/10,
                
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
                {runningData && (<tr scope="row">
                    <th scope="col">Current</th>
                    <th scope="col">{}</th>
                    <th scope="col">{currentLapData ? currentLapData.AH : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aV1 : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aA : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aSpd : '-'}</th>
                </tr>)}

                {lapData[0] && (<tr scope="row">
                    <th scope="col">Last</th>
                    <th scope="col">{lapData[0] ? lapData.at(-1).time : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-1).AH : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-1).aV1 : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-1).aA : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-1).aSpd : '-'}</th>
                </tr>)}
        
                {lapData.length>0 ? lapData.map((lap,index)=>(
                    <tr>
                        <th scope="row">{lap.num}</th>
                        <td>{lap.time}</td>
                        <td>{lap.AH}</td>
                        <td>{lap.aV1}</td>
                        <td>{lap.aA}</td>
                        <td>{lap.aSpeed}</td>
                        
                    </tr>
                )) : <tr>
                        <th colSpan="6" scope="row">No Data...</th>   
                    </tr>}
            </tbody>
    
        </table>
    )

  return (
    <div class="card car-summary mb-3">
        <div class="card-header text-center">
            <h3>Laps ({currentLapNum ? JSON.stringify(currentLapNum) : '-'})</h3>
            <div>
                <p>Distance: {(runningData.length>0) ? runningData.at(-1).Distance : '-'} </p>
            </div>
        </div>
        <div class="card-body car-summary-vis d-flex flex-column">
            {allowedPermissions ? <LapComponent />
            : 
            <ContentLocked />
            }
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

    ///useEffect(() => {
    ///    try{
      ///      calculateAllLapData(filterSeparateLaps())
       // } catch (error) {
        //    console.log(error)
       // }
    //},[currentLapNum])