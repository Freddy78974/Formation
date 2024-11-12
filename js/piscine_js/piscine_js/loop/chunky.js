function chunk(array, inter) {
    const result = [];
    for (let i = 0; i < array.length; i += inter) {
      result.push(array.slice(i, i + inter));
    }
    return result;
}

// console.log(chunk([1,2,3,4,5,6,7,8,9,10,11,12,13], 2))