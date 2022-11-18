function deduplicatedConcat<T>(array1: T[], array2: T[], equator: (a: T, b: T)=>boolean): T[]{
  const resArr = [...array1];
  for(let i in array2){
    if(!array1.find(a => equator(a, array2[i]))){
      resArr.push(array2[i]);
    }
  }
  return resArr;
}

export {deduplicatedConcat};