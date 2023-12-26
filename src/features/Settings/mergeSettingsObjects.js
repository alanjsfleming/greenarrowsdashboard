export default function mergeSettings(obj1,obj2) {
    // Object two will overwrite object one except for where values are null
    let cars1 = obj1.cars
    let cars2 = obj2.cars

    delete obj1.cars
    delete obj2.cars

    let mergedObject = mergeObjects(obj1,obj2);

    // Merge the cars arrays
    for (let i = 0; i < Math.max(cars1.length,cars2.length); i++) {
        if (i < cars1.length && i < cars2.length) {
            // Both cars1 and cars2 have a car at this index
            mergedObject.cars[i] = mergeObjects(cars1[i],cars2[i])
        } else if (i < cars2.length) {
            // Only cars2 has a car at this index, this is a new car!
            mergedObject.cars[i] = cars2[i]
        } else {
            // Only cars1 has a car at this index, this car has been deleted
            mergedObject.cars[i] = cars1[i]
        }
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