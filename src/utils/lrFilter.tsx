type LRResult<T> = {
  truthy: T[],
  falsey: T[],
}

function LRFilter<T>(array: T[], predicate: (element: T)=>boolean):LRResult<T> {
  const left = [];
  const right = [];
  for( const e of array){
    if(predicate(e)){
      left.push(e);
    }else {
      right.push(e)
    }
  }
  return {truthy: left, falsey: right};
}

export {LRFilter};