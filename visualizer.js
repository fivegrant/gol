import { emptyGrid, customGrid, step, alter, activeAt } from "/engine.js"

const ALIVE = 'rgb(0,0,200)';
const DEAD = 'rgb(255,255,255)';
const CELLSIZE = 20;
var CURRENT = emptyGrid(1,1)

const defaultGrid = await fetch("/default.txt")
                           .then(file => file.text());

const draw = () => {
  const grid = CURRENT;
  const ctx = document.getElementById('grid').getContext('2d');
  for(var i = 0; i < grid.size[0]; i++){
    for(var j = 0; j < grid.size[1]; j++){
      if (activeAt(i,j, grid)){ //should use grid.cell instead
        ctx.fillStyle = ALIVE;
      } else {
        ctx.fillStyle = DEAD;
      }
      ctx.fillRect(i * CELLSIZE, j * CELLSIZE, CELLSIZE, CELLSIZE);
    }
  }
  CURRENT = step(grid);
}


const render = () => {
  CURRENT = customGrid(defaultGrid);
  const grid = CURRENT;

  var canvas = document.getElementById('grid');
  var ctx = canvas.getContext('2d');
  canvas.width = grid.size[0] * CELLSIZE;
  canvas.height = grid.size[1] * CELLSIZE;
  
  setInterval(draw,50);
}

render();
