import * as _ from 'https://pagecdn.io/lib/underscore/1.13.1/underscore-esm-min.js';

const cartesian = (xs, ys) => {
  const prepends = y => _.map(_.map(xs, x => (y => [x,y])), f => f(y));
  return _.flatten(_.map(ys, prepends), 1);
}

function Grid(state) {
  this.state = state;
  if (!_.every(this.state, x => x.length === this.state[0].length)){
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

const adjacent = (x, y, grid) => {
  // TODO: Make this less ugly
  const indices = cartesian([x - 1, x, x + 1],[y - 1, y, y + 1]);

  const isNotSelf = i => !(i[0] == x && i[1] == y);
  const inBounds = i => !outOfBounds(i[0],i[1],grid);

  const neighbors = indices.filter(i => inBounds(i) && isNotSelf(i));
  const active = neighbors.map(i => activeAt(i[0],i[1],grid));
  return active.reduce((x,y)=>x+y);
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
  const remaining = cartesian(_.range(grid.size[0]), _.range(grid.size[1]));
  const apply = (grids, i) => [grids[0], adjust(i[0],i[1],grids[0],grids[1])];
  return _.reduce(remaining, apply, [grid, emptyGrid(grid.size[0],grid.size[1])])[1];
}

const emptyGrid = (x,y) => {
  const state = [];
  for(var i = 0; i < y; i++){
    state.push(Array(x).fill(false));
  }
  return new Grid(state);
}

const customGrid = layout => {
  const rows = _.filter(layout.split('\n'), x => x != "");
  if (!_.every(rows, x => _.isEqual(x.length, rows[0].length))){
    return new Error("String Config is not rectangular!");
  }
  const config = rows.map(x => x.split("").map(x => "0" !== x));
  return new Grid(config);
}



export { emptyGrid, customGrid, step, alter, activeAt};
