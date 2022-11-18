type LRResult<T> = {
  truthy: T[],
  falsey: T[],
}

function LRFilter<T>(array: T[], predicate: (element: T)=>boolean):LRResult<T> {
  const left = [];
  const right = [];
  for( let i in array){
    if(predicate(array[i])){
      left.push(array[i]);
    }else {
      right.push(array[i])
    }
  }
  return {truthy: left, falsey: right};
}

export {LRFilter};