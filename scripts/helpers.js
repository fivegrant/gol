/**
 * helpers.js
 *
 * Note: JS does not support tail recursion so I had
 * to use `for` loops instead.
 */

const pairEqual = (a,b) => {
  return a[0] == b[0] && a[1] == b[1]
}

const pairExists = (x, y, array) => {
  for(const coord of array){
    if(pairEqual([x,y], coord)) {
      return true;
      }
  }
  return false;
}

const uniquePairs = (array) => {
  var result = [];
  for(const coord of array){
    if(!pairExists(coord[0], coord[1], result)){
      result.push(coord)
    }
  }
  return result;
}

const cartesian = (xs, ys) => {
  const prepends = y => xs.map(x => (y => [x,y])).map(f => f(y));
  return ys.map(prepends).flat();
}

const range = n => {
  return Array.from({length:n}, (_,index) => index);
}

export { pairEqual, pairExists, uniquePairs, cartesian, range };
