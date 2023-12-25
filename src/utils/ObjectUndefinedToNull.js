// function which takes an object as an input, and returns a new object with all the undefined values replaced with null

function ObjectUndefinedToNull(obj) {
    let newObj = {};
    for (let key in obj) {
        if (obj[key] === undefined) {
        newObj[key] = null;
        } else {
        newObj[key] = obj[key];
        }
    }
    return newObj;
}

export default ObjectUndefinedToNull;