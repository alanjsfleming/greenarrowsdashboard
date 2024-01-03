import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import ContentLocked from '../../layouts/ContentLocked'
import { getMembershipStatus } from '../../stripe/getMembershipStatus.ts'
import { useAuth } from '../../contexts/AuthContext'
import app from '../../firebase'

export default function LapSummary(props) {

    const [lapData, setLapData] = useState([])

    const { currentUser } = useAuth()

    const [manualLengthMode, setManualLengthMode] = useState(true)

    const [currentLapData, setCurrentLapData] = useState()
    const [currentLapNum, setCurrentLapNum] = useState()

    // Determine if user is allowed to access this content
    const [isMember, setIsMember] = useState(false)    
    
    useEffect(()=>{
        const checkMember = async () => {
          const newMembershipStatus = currentUser
            ? await getMembershipStatus(app)
            : false;
            setIsMember(newMembershipStatus);
        };
        checkMember();
    },[app,currentUser?.uid])

    // VCq7rqiEK4qbGd7qZ4C0 GA1 


    // change this to use props.runningData
    useEffect(() => {
        console.log("attempt")
        try{
            console.log(props.runningData)
            setCurrentLapNum(calculateCurrentLapNum(props.runningData));
            getCurrentLapData(props.runningData);
            calculateAllLapData(filterSeparateLaps(props.runningData))
            console.log(props.runningData)
        } catch (error) {
            console.log(error);
        }
    },[props.runningData])

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
            
        }
    },[currentLapNum])

    // FIX THIS
    // Function filter separate laps, which finds the indexes of the first and last data point of each lap and filters into n number of laps separate arrays
    function filterSeparateLaps() {
        // For each lap, find the first and last index of the lap
       
        let lapDataArrays = []
        for (var i = 0; i < calculateCurrentLapNum(props.runningData); i++) {
            console.log(lapDataArrays)
            // Automatic lap mode
            if (!props.settings.manualLapMode) {
                const firstIndex = props.runningData.findIndex(data=>data.Lap===i)
                const lastIndex = props.runningData.findLastIndex(data=>data.Lap===i)
                // Filter the runningData array into n number of arrays, each containing the data for each lap
                lapDataArrays.push(props.runningData.slice(firstIndex,lastIndex+1))

            // Manual Lap Mode
            } else {
                const firstDist = i*props.settings.trackLength
                const lastDist = (i+1)*props.settings.trackLength
                // Filter the runningData array into n number of arrays, each containing the data for each lap
                lapDataArrays.push(props.runningData.filter(function(data) {
                    return data.Distance >= firstDist && data.Distance < lastDist
                    }
                ))
            }
        }
        console.log(lapDataArrays)
        return lapDataArrays
    }


    // It is trying to access undefined values in the lapDataArrays, add a check to see if the value is undefined before accessing
    function calculateAllLapData(lapDataArrays) {
        // For each lap, find the average of V1, A, and Speed
        console.log(lapDataArrays)
        const averages = lapDataArrays.map((lapDataArray,index) => {
            console.log(lapDataArrays)
            return {
                num:index+1,
                time:((lapDataArray.at(-1)?.timestamp) && (lapDataArray[0]?.timestamp)) ? elapsedTimeIntoString(lapDataArray.at(-1).timestamp-lapDataArray[0].timestamp) : "-",
                AH:((lapDataArray.at(-1)?.AH) && (lapDataArray[0]?.AH)) ? Math.round((lapDataArray.at(-1).AH-lapDataArray[0].AH)*10)/10 : "-",
                aV1:Math.round(calculateAverageValue(lapDataArray.map(data=>data.V1))*10)/10,
                aA:Math.round(calculateAverageValue(lapDataArray.map(data=>data.A))*10)/10,
                aSpd:Math.round(calculateAverageValue(lapDataArray.map(data=>data.Spd))*10)/10
            }
        }) 
        // Return an array of objects, each containing the average data for each lap
        console.log(averages)
        setLapData(averages)
    }

    function calculateCurrentLapNum(runningData) {
        console.log(runningData.at(-1))
        console.log(props.settings)
        console.log(props.settings.manualLapMode)

        if (props.settings.manualLapMode) {
            console.log("returning lap:",runningData.at(-1).Distance/props.settings.trackLength)
            return runningData.at(-1).Distance/props.settings.trackLength
        } else {
            console.log("returning lap:",runningData.at(-1).Lap)
            return runningData.at(-1).Lap
        }
    }

    // Function that filters out the current lap data from the lapData array
    function getCurrentLapData(runningData){
        const lapTime = "00:00:12"
        
        
        const AmpHours = Math.max(...runningData.map(data=>data.AH))
        setCurrentLapData(
            {   
                num:1,
                aV1:Math.round(calculateAverageValue(runningData.map(data=>data.V1))*10)/10,
                AH:AmpHours,
                aA:Math.round(calculateAverageValue(runningData.map(data=>data.A))*10)/10,
                aSpd:Math.round(calculateAverageValue(runningData.map(data=>data.Spd))*10)/10,
                
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
                {props.runningData && (<tr scope="row">
                    <th scope="col">Overall</th>
                    <th scope="col">{}</th>
                    <th scope="col">{currentLapData ? currentLapData.AH : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aV1 : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aA : '-'}</th>
                    <th scope="col">{currentLapData ? currentLapData.aSpd : '-'}</th>
                </tr>)}
                

                {lapData[1] && (<tr scope="row">
                    <th scope="col">Last</th>
                    <th scope="col">{lapData[0] ? lapData.at(-2).time : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-2).AH : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-2).aV1 : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-2).aA : '-'}</th>
                    <th scope="col">{lapData[0] ? lapData.at(-2).aSpd : '-'}</th>
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
    <>
    <div class="card car-summary mb-3">
        <div class="card-header text-center">
            <h3>Laps ({currentLapNum ? JSON.stringify(currentLapNum) : '-'})</h3>
            <div>
                <p>Distance: {(props.runningData.length>0) ? props.runningData.at(-1).Distance : '-'} </p>
            </div>
        </div>
        <div class="card-body car-summary-vis d-flex flex-column">
            {isMember ? <LapComponent />
            : 
            <ContentLocked />
            }
        </div>
    </div>
    </>
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