function deduplicatedConcat<T>(
  array1: T[],
  array2: T[],
  equator: (a: T, b: T) => boolean,
): T[] {
  const resArr = [...array1];
  for (const e2 of array2) {
    if (!array1.find(e1 => equator(e1, e2))) {
      resArr.push(e2);
    }
  }
  return resArr;
}

export {deduplicatedConcat};
