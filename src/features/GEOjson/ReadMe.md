Convert the running data to GEOjson 

https://leafletjs.com/reference.html#polyline

So get the runningData array, choose the key that will be overlayed. 

Divide it into the lap array.

So i will now have the key numbers and the lap arrays,

Now i need to get the shape of the line.

Divide it up into circles? now theres X points which should describe the shape of the track.

For each point, calculate the average value of the datapoints which are inside this circle.

Find Max and Min, get gradient of colours and thresholds, 

Split into lines of different colours,

Will need to overlap so 

x1 -> x2 (red) and then x2 -> x3 (blue) and x3 -> x4 -> x5 ->x6 (red) and then x6 -> x7 (blue) thing.

And then render that. update as the running_data array changes live updates. just need to recalculate the average, and every lap, recheck the track shape.