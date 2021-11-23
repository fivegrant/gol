/**
 * helpers.js - Assists with coordinate pair operations.
 *
 * Note: JS does not support tail recursion so I had
 * to use `for` loops instead.
 */

// Checks if pairs are equal
const pairEqual = (a,b) => {
  return a[0] == b[0] && a[1] == b[1]
}

// Checks if pairs are in a given list of coordinates
const pairExists = (x, y, array) => {
  for(const coord of array){
    if(pairEqual([x,y], coord)) {
      return true;
      }
  }
  return false;
}

// Strips duplicate coordinates from array
const uniquePairs = (array) => {
  var result = [];
  for(const coord of array){
    if(!pairExists(coord[0], coord[1], result)){
      result.push(coord)
    }
  }
  return result;
}

// Creates the cartesian product of two arrays
const cartesian = (xs, ys) => {
  const prepends = y => xs.map(x => (y => [x,y])).map(f => f(y));
  return ys.map(prepends).flat();
}

// Provides an array with numbers increasing all the way up to n.
const range = n => {
  return Array.from({length:n}, (_,index) => index);
}

export { pairEqual, pairExists, uniquePairs, cartesian, range };
