function forEach(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        const elem = func(arr[i], i, arr);
        console.log(arr[i]);
    }
}