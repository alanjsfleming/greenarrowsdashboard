export default function handleGetDweet(thingName) {
    const fetchURL = `https://dweet.io/get/latest/dweet/for/${thingName}`;
    fetch (fetchURL)
    .then((reponse)=> reponse.json())
    .then((data) => {
        const telemetryPacket = data.with[0].content;
        const time = data.with[0].created;
        telemetryPacket.timestamp = time;
        return telemetryPacket;
    })
    .catch((error) => {
        throw new Error(error);
    });
}
