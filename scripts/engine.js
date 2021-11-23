/**
 * engine.js
 */


import { range, cartesian } from "/scripts/helpers.js"

function Grid(state) {
  this.state = state;
  if (!this.state.every(x => x.length === this.state[0].length)){
    return new Error("Improper Size!");
  }
  this.size = [this.state[0].length, this.state.length]; // x and y
}

const activeAt = (x, y, grid) => {
  return grid.state[y][x];
}

const alter = (x, y, value, grid) => {
  const altered = JSON.parse(JSON.stringify(grid)); 
  altered.state[y][x] = value;
  return altered
}

const outOfBounds = (x, y, grid) => {
  return x >= grid.size[0] || y >= grid.size[1] || x < 0 || y < 0;
}

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

const adjacent = (x, y, grid) => {
  // TODO: Make this less ugly
  const indices = cartesian([x - 1, x, x + 1],[y - 1, y, y + 1]);

  const isNotSelf = i => !(i[0] == x && i[1] == y);
  const inBounds = i => wrapAround(i[0], i[1], grid);

  const neighbors = indices.filter(isNotSelf).map(inBounds);
  const active = neighbors.map(i => activeAt(i[0], i[1], grid));
  return active.reduce((x,y) => x+y);
}

const adjust = (x, y, current, future) => {
 const activeCount = adjacent(x, y, current)
 if (activeCount == 3){
   return alter(x, y, true, future);
 } else if (activeCount == 2){
   return alter(x, y, activeAt(x,y,current), future);
 } else {
   return alter(x, y, false, future);
 }
}

const step = grid => {
  const remaining = cartesian(range(grid.size[0]), range(grid.size[1]));
  const apply = (grids, i) => [grids[0], adjust(i[0],i[1],grids[0],grids[1])];
  return remaining.reduce(apply, [grid, emptyGrid(grid.size[0],grid.size[1])])[1];
}

const emptyGrid = (x,y) => {
  const state = [];
  for(var i = 0; i < y; i++){
    state.push(Array(x).fill(false));
  }
  return new Grid(state);
}

const customGrid = layout => {
  const rows = layout.split('\n').filter(x => x != "");
  if (!rows.every(x => x.length === rows[0].length)){
    return new Error("String Config is not rectangular!");
  }
  const config = rows.map(x => x.split("").map(x => "0" !== x));
  return new Grid(config);
}

const flipCell = (x, y, grid) => alter(x, y, !activeAt(x, y, grid), grid);

export { emptyGrid, customGrid, step, flipCell, activeAt};