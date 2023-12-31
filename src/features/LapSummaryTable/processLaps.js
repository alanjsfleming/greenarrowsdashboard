// Take in the running_data as an input and return the lap arrays as an output

// Another export function which takes the lap arrays and a Key as an input and returns the GEOJson
// LineString array as an output with all the colours set up. With the colour gradient on the lines.

// The Laps will be filtered by either the running_data.Lap, the distance travelled by the starting_line_latLng

// Track Width is basically the distance in m which can be used to make sure the car has passed the starting line
    // Also used in the GEOJson to group the average points thing.
export function processRunningDataIntoLapArrays(running_data,track_length,starting_line_latLng,track_width) {
    let lap_data_arrays = []

    // If starting_line_latLng is null then we will use the existing methods to filter the running_data
    if (starting_line_latLng === null) {
        for (var i=0; i < calculateCurrentLapNum(running_data); i++) {
            // Automatic eChook Lap mode 
            if (!manual_lap_mode) {
                const first_index = running_data.findIndex(data=>data.Lap===i)
                const last_index = running_data.findLastIndex(data=>data.Lap===i)
                // Filter the running_data array into n number of arrays, each containing the data for each lap
                lap_data_arrays.push(running_data.slice(first_index,last_index+1))
            } else {
            const first_dist = i*track_length
            const last_dist = (i+1)*track_length
            // Filter the running_data array into n number of arrays, each containing the data for each lap
            lap_data_arrays.push(running_data.filter(function(data) {
                return data.Distance >= first_dist && data.Distance < last_dist
                }))
            }
        }
        return lap_data_arrays
    }
    // If starting_line_latLng has a value then we will calculate the lap arrays using the starting_line_latLng
    // Set up loop
    const running_data_length = running_data.length

    // Set up the loop conditions
    let lap_index = 0;
    let currentlyPassingStartingLine = false
    for (var i = 0; i < running_data_length; i++) {
        // If the car is passing the starting line and we are not currently passing the starting line
        const current_coords = [running_data[i]["Latitude (deg)"],running_data[i]["Longitude (deg)"]]
        if (calculateHaversineDistance(current_coords,starting_line_latLng) > track_width && !currentlyPassingStartingLine) {
            currentlyPassingStartingLine = true
            lap_index++
            lap_data_arrays.push([])
        } else if (running_data[i].Distance < track_width && currentlyPassingStartingLine) {
            currentlyPassingStartingLine = false
        }
        lap_data_arrays[lap_index].push(running_data[i])
    }
    return lap_data_arrays
}

// This is used if the laps are calculated on Distance or the Lap number
function calculateCurrentLapNum(running_data,manual_lap_mode,track_length) {
    if (manual_lap_mode) {
        return running_data.at(-1).Distance/track_length
    } else {
        return running_data.at(-1).Lap
    }
}

// Calculate the distance between the current location and the starting line LatLng
function calculateHaversineDistance(coord1, coord2) {
    // coords are [lat,lon]
    const R = 6371e3; // metres
    const lat1Rad = toRadians(coord1[0]);
    const lat2Rad = toRadians(coord2[0]);
    const deltaLatRad = toRadians(coord2[0] - coord1[0]);
    const deltaLonRad = toRadians(coord2[1] - coord1[1]);
  
    const a = Math.sin(deltaLatRad/2) * Math.sin(deltaLatRad/2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLonRad/2) * Math.sin(deltaLonRad/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    const distance = R * c; // in metres
    return distance;
}

export function createGEOJsonLineSegmentsFromLapArraysAndKey(running_data,key,track_shape) {
    // Colours are a gradient of blue to red, where white is in the middle and represents the average value.
    
    // Calculate the average value for each data point that is in the track shape
    const track_shape_length = track_shape.length
    const data_length = data.length
    const average_values = []

    // For each point in running data, find its corresponding element in track_shape, add it to the average_values array at index of the track_shape element
    for (var i = 0; i < data_length; i++) {
        const current_coords = [running_data[i]["Latitude (deg)"],running_data[i]["Longitude (deg)"]]
        for (var j = 0; j < track_shape_length; j++) {
            if (calculateHaversineDistance(current_coords,track_shape[j]) < track_width) {
                average_values[j].push(running_data[i][key]);
            }
        }
    }
    
    // Calculate the average value for each element in the average_values array
    let average_values_length = average_values.length
    for (var i = 0; i < average_values_length; i++) {
        average_values[i] = average_values[i].reduce((a,b) => a + b, 0) / average_values[i].length
    }

    // Calculate the min and max values of the average_values array
    const min_value = Math.min(...average_values)
    const max_value = Math.max(...average_values)

    // Calculate the colour for each element in the average_values array
    const colour_values = []
    average_values_length = average_values.length
    for (var i = 0; i < average_values_length; i++) {
        const colour_value = Math.round((average_values[i]-min_value)/(max_value-min_value)*255)
        colour_values.push(colour_value)
    }

    // Create the GEOJson LineString array
    const line_segments = []
    for (var i = 0; i < track_shape_length; i++) {
        if (i === track_shape_length-1) {
            break
        }
        const line_segment = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [track_shape[i],track_shape[i+1]]
            },
            "properties": {
                "color": `rgb(${colour_values[i]},${colour_values[i]},255)`
            }
        }
        line_segments.push(line_segment)
    }

    return line_segments
}

// This function takes in the lap data arrays and the key and returns the values we are interested in
function getValuesFromRunningDataAndKey(running_data,key) {
    const data = []
    // Fill data with the values we are interested in
    const running_data_length = running_data.length
    for (var i = 0; i < running_data_length; i++) {
        data.push(running_data[i][key])
    }
    return data;
}

// This function takes in the running_data and returns the shape of the track
function getTrackShape(running_data,track_width) {
    // The shape is an array of coordinates of circles of diameter track_width which can be used to draw the track
    // The first circle is the starting line
    const track_shape = []
    const running_data_length = running_data.length
    for (var i = 0; i < running_data_length; i++) {
        // If this circle overlaps the previous circle then we will not add it to the shape
        if (i > 0) {
            const previous_circle = track_shape.at(-1)
            const current_circle = [running_data[i]["Latitude (deg)"],running_data[i]["Longitude (deg)"]]
            if (calculateHaversineDistance(previous_circle,current_circle) < track_width) {
                continue
            }
        }
        track_shape.push([running_data[i]["Latitude (deg)"],running_data[i]["Longitude (deg)"]])
    }
    return track_shape
}