function reverse(arr) {
    if (typeof arr === 'string') {
        arr = arr.split('');
        let start = 0;
        let end = arr.length - 1;
        while (start < end) {
            const temp = arr[start];
            arr[start] = arr[end];
            arr[end] = temp;
    
            start++;
            end--;
        }
        arr = arr.join('');
        // console.log('ok',arr)
    } 
    if (typeof arr === 'object') {
        let start = 0;
        let end = arr.length - 1;
        while (start < end) {
            const temp = arr[start];
            arr[start] = arr[end];
            arr[end] = temp;
            
            start++;
            end--;
        }
        // console.log('okkkkk',arr)
    }
    // console.log('arr',arr)
    
    return arr;
}

// console.log((reverse('pouet'), 'teuop'))