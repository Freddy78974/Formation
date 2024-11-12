function fusion(arrStrOrNum1, arrStrOrNum2) {
    const result = {};

  for (const key in arrStrOrNum2) {
    if (arrStrOrNum2.hasOwnProperty(key)) {
      if (arrStrOrNum1.hasOwnProperty(key)) {
        if (Array.isArray(arrStrOrNum1[key]) && Array.isArray(arrStrOrNum2[key])) {
          result[key] = arrStrOrNum1[key].concat(arrStrOrNum2[key]);
        } else if (typeof arrStrOrNum1[key] === 'string' && typeof arrStrOrNum2[key] === 'string') {
          result[key] = arrStrOrNum1[key] + ' ' + arrStrOrNum2[key];
        } else if (typeof arrStrOrNum1[key] === 'number' && typeof arrStrOrNum2[key] === 'number') {
          result[key] = arrStrOrNum1[key] + arrStrOrNum2[key];
        } else if (typeof arrStrOrNum1[key] === 'object' && typeof arrStrOrNum2[key] === 'object') {
          result[key] = fusion(arrStrOrNum1[key], arrStrOrNum2[key]);
        } else {
          result[key] = arrStrOrNum2[key];
        }
      } else {
        result[key] = arrStrOrNum2[key];
      }
    }
  }

  for (const key in arrStrOrNum1) {
    if (arrStrOrNum1.hasOwnProperty(key) && !arrStrOrNum2.hasOwnProperty(key)) {
      result[key] = arrStrOrNum1[key];
    }
  }

  return result;
}
