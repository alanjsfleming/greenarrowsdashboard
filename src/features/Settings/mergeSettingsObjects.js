export default function mergeSettings(obj1,obj2) {
    // Object two will overwrite object one except for where values are null
    let cars1 = obj1.cars
    let cars2 = obj2.cars

    delete obj1.cars
    delete obj2.cars

    let mergedObject = mergeObjects(obj1,obj2);

    // Merge the cars arrays
    for (let i = 0; i < cars1.length; i++) {
        mergedObject.cars[i] = mergeObjects(cars1[i],cars2[i])
    }
    
    return mergedObject;
}

function mergeObjects(obj1,obj2) {
    // Go through obj2 and remove any key value pairs that have value of ""
    for (const [key, value] of Object.entries(obj2)) {
        if (value === "") {
            delete obj2[key]
        }
    }
    // Merge the two objects
    return {...obj1,...obj2}
}