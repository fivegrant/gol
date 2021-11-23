/**
 * engine.js - Handles logic for cellular automata.
 */


import { pairEqual, pairExists, uniquePairs, range, cartesian } from "/gol/scripts/helpers.js"

// Initialize function object
function Grid(state) {
  if (!state.every(x => x.length === state[0].length)){
    return new Error("Improper Shape!");
  }
  this.size = [state[0].length, state.length]; // x and y
  this.state = cartesian(range(this.size[0]), range(this.size[1])).filter( 
    a => state[a[1]][a[0]] == "1");
}

// Check if a cell is alive
const activeAt = (x, y, grid) => {
  return pairExists(x, y, grid.state); 
}

// Change the status of a single cell
const alter = (x, y, value, grid) => {
  if(activeAt(x,y,grid) == value){
    return grid;
  } 
  else { 
    const altered = JSON.parse(JSON.stringify(grid)); 
    altered.state = !value ? altered.state.filter(b => !pairEqual([x,y],b))
                           : altered.state.concat([[x,y]])
    return altered;
  }
}

const outOfBounds = (x, y, grid) => {
  return x >= grid.size[0] || y >= grid.size[1] || x < 0 || y < 0;
}

// Rewrites coordinates if they are out of bounds
const wrapAround = (x,y, grid) => {
  if(outOfBounds(x,y,grid)){
    const correct = [x,y];
    if (x < 0){
      correct[0] = grid.size[0] - 1;
    } else if (x > grid.size[0] - 1){
      correct[0] = 0
    }
    if (y < 0){
      correct[1] = grid.size[1] - 1;
    } else if (y > grid.size[1] - 1){
      correct[1] = 0
    }
    return correct;
  } else {
    return [x,y];
  }
}

// Provides a list of all neighboring cell coordinates
const neighbors = (x, y, grid) => {
  const indices = cartesian([x - 1, x, x + 1],[y - 1, y, y + 1]);
  const isNotSelf = i => !(i[0] == x && i[1] == y);
  const inBounds = i => wrapAround(i[0], i[1], grid);
  return indices.filter(isNotSelf).map(inBounds);
}

// Indicates the amount of living neighbors 
const next = (x, y, grid) => {
  const adjacent = neighbors(x, y, grid);
  const active = adjacent.map(i => activeAt(i[0], i[1], grid));
  return active.reduce((x,y) => x+y);
}

/* Plots the cell corresponding on the future grid given information
 * given information about the current grid.
 */
const adjust = (x, y, current, future) => {
 const activeCount = next(x, y, current)
 if (activeCount == 3){
   return alter(x, y, true, future);
 } else if (activeCount == 2){
   return alter(x, y, activeAt(x,y,current), future);
 } else {
   return alter(x, y, false, future);
 }
}

// Provides the next grid.
const step = grid => {
  const possible = grid.state.concat(grid.state.map(
     a => neighbors(a[0],a[1],grid)).flat())
  const remaining = uniquePairs(possible);
  const apply = (grids, i) => [grids[0], adjust(i[0], i[1], grids[0], grids[1])];
  return remaining.reduce(  apply, 
                            [grid, emptyGrid(
			             grid.size[0],grid.size[1]
			 	   )
			    ]
			 )[1]; // Only return the grid, not the empty grid list
}

// Creates an empty grid.
const emptyGrid = (x,y) => {
  const state = [];
  for(var i = 0; i < y; i++){
    state.push(Array(x).fill(false));
  }
  return new Grid(state);
}

/** Takes a string where the rows are separated by newlines
  * and columns are separated by spaces.
  */
const customGrid = layout => {
  const rows = layout.split('\n').filter(x => x != "");
  if (!rows.every(x => x.length === rows[0].length)){
    return new Error("String Config is not rectangular!");
  }
  const config = rows.map(x => x.split("").map(x => "0" !== x));
  return new Grid(config);
}

// Toggles the status of a cell
const flipCell = (x, y, grid) => alter(x, y, !activeAt(x, y, grid), grid);

export { emptyGrid, customGrid, step, flipCell, activeAt};
