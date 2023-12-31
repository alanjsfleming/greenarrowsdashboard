Split running_data into each lap, its currently based on distance. 

So i have an array of coordinates. 

chat gpt is suggesting this, I would need to get the user to input the start or finish line tho

can do that with map onClick

so a state for setting the startline, and then when onClick if setting = true then set startline to [latLng]



```javascript
data = []

function calculateDistance(coord1, coord2) {
    // Use Haversine formula or any other method to calculate the distance between two coordinates
    // This is a placeholder function, you’ll need to implement the actual distance calculation
}

function processLaps(coordinates, startFinishLine, distanceThreshold) {
    const laps = [];
    let currentLap = [];
    let lapCompleted = false;

    coordinates.forEach((coord, index) => {
        // Calculate the distance from the current coordinate to the start/finish line
        const distance = calculateDistance(coord, startFinishLine);

        if (distance <= distanceThreshold) {
            if (lapCompleted) {
                // We have crossed the start/finish line and already have some coordinates for the new lap
                laps.push(currentLap);
                currentLap = [coord];
                lapCompleted = false;
            } else {
                // This is the first coordinate of the first lap or the car is still too close to the start line
                currentLap.push(coord);
            }
        } else {
            currentLap.push(coord);
            lapCompleted = true; // The car has moved away from the start/finish line
        }
    });

    // Push the last lap if the race ends without crossing the start/finish line again
    if (currentLap.length > 0) {
        laps.push(currentLap);
    }

    return laps;
}

// Usage
const coordinates = [
    // Array of coordinates the car sends
];

const startFinishLine = {
    // The coordinate of the start/finish line
};

const distanceThreshold = 10; // Distance threshold to determine lap completion

const lapData = processLaps(coordinates, startFinishLine, distanceThreshold);

```

