/**
 * helpers.js
 */
const cartesian = (xs, ys) => {
  const prepends = y => xs.map(x => (y => [x,y])).map(f => f(y));
  return ys.map(prepends).flat();
}

const range = n => {
  return Array.from({length:n}, (_,index) => index);
}

export { range, cartesian };
