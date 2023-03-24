export const calcAverage = (arr: number[]) => {
  // sum of elements in array
  const sum = arr.reduce((a, v) => a + v);
  return Math.round(sum / arr.length);
};
