// Get Latest Dweet for a Thing
export default function handleGetDweet(thingName) {
    const fetchURL = `https://dweet.io/get/latest/dweet/for/${thingName}`;
    fetch (fetchURL)
    .then((reponse)=> reponse.json())
    .then((data) => {
        return createTelemetryDataPoint(data.with[0]);
    })
    .catch((error) => {
        throw new Error(error);
    });
}

// Get all dweets for a Thing
export function handleGetDweets(thingName) {
    const fetchURL = `https://dweet.io/get/dweets/for/${thingName}`
    fetch (fetchURL)
    .then((response) => response.json())
    .then((data) => {
        const telemetryPackets = data.with // array of dweets
        const telemetryDataPoints = telemetryPackets.map((packet) => {
            return createTelemetryDataPoint(packet);
        }
        )
        return telemetryDataPoints;
    })
}

// Create a telemetry data point from a dweet by taking the content and adding the timestamp from created
function createTelemetryDataPoint(dataPacket) {
    const telemetryDataPoint = dataPacket.content;
    telemetryDataPoint.timestamp = dataPacket.created;
    return telemetryDataPoint;
}

