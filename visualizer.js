import { emptyGrid, customGrid, step, alter, activeAt } from "/engine.js"

const ALIVE = 'rgb(0,0,200)';
const DEAD = 'rgb(255,255,255)';
const CELLSIZE = 20;
var HISTORY = [];
var PAUSE = false;
var REVERSE = false;
var TIME = null;

const defaultGrid = await fetch("/default.txt")
                           .then(file => file.text());

// Create Keybindings
const detect = e => {
  switch(e.code){
    case("Space"):
      PAUSE = !PAUSE;
      break;
    case("KeyZ"):
      REVERSE = true;
      break;
    case("KeyX"):
      REVERSE = false;
      break;
  }
}
document.onkeydown = detect;


const draw = () => {
  // Make sure not to travel back to far in time
  if(TIME < 0){PAUSE = true; REVERSE = false; TIME = 0;}; 

  if(!PAUSE){
    const grid = HISTORY[TIME];
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
    if(!REVERSE){
      if(TIME == HISTORY.length - 1){
        HISTORY.push(step(grid));
        TIME = HISTORY.length - 1;
      } else {
        TIME++
      }
    } else {
      TIME--;
    }
  }
}


const render = () => {
  HISTORY = [customGrid(defaultGrid)];
  const grid = HISTORY[0];
  TIME = 0;

  var canvas = document.getElementById('grid');
  var ctx = canvas.getContext('2d');
  canvas.width = grid.size[0] * CELLSIZE;
  canvas.height = grid.size[1] * CELLSIZE;
  
  setInterval(draw,50);
}

render();
