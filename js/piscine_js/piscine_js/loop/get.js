function get(src = {}, path) {
    let arr = path.split('.');
    let res;
    if (arr.length == 0) {
        res = '';
    } else if (arr.length == 1) {
        res = src[arr[0]];
    } else {
        let newObject = src[arr[0]];
        if (newObject == undefined) {
            return undefined
        }
        // console.log(newObject)
        for (let index = 1; index < arr.length; index++) {
            const element = arr[index];
            if (index == arr.length-1) {
                res = newObject[element];
            } else {
                newObject = newObject[element];
                if (newObject == undefined) {
                    return undefined
                }
            }
        }
    }
    return res;
}

// console.log(get({ nested: { key: 'value' } }, 'nested.key'))