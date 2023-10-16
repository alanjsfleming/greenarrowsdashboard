export default function elapsedTimeIntoString(elapsedTime) {
  const mins=Math.floor(elapsedTime/1000/60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
  const seconds=Math.round((elapsedTime/1000)%60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false})
  const string = `${mins}:${seconds}`
  return string
}