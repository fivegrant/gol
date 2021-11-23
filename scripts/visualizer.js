/**
 * visualizer.js - Draws cellular automata to the browser.
 */

import { emptyGrid, customGrid, step, flipCell, activeAt } from "/scripts/engine.js"

const ALIVE = 'rgb(0,0,200)';
const REVERSE_ALIVE = 'rgb(200,0,0)';
const DEAD = 'rgb(255,255,255)';
const CELLSIZE = 13;
var HISTORY = [];
var PAUSE = false;
var REVERSE = false;

const defaultGrid = await fetch("/layouts/default.txt")
                           .then(file => file.text());

// Create Keybindings
const detect = e => {
  switch(e.code){
    case("KeyS"):     // Pause
      PAUSE = !PAUSE;
      break;
    case("KeyA"):     // Move Backward
      REVERSE = true;
      break;
    case("KeyD"):     // Move Forward
      REVERSE = false;
      break;
    case("KeyW"):    // Step forward
      draw(true);
      break;
  }
}

const toggle = e => {
    if(PAUSE){
     const canvas = document.getElementById('grid')
     const pixelX = e.clientX - canvas.offsetLeft;
     const pixelY = e.clientY - canvas.offsetTop;
     const [x,y] = [Math.floor(pixelX / 13), Math.floor(pixelY / 13)];
     const time = HISTORY.length - 1;
     HISTORY[time] = flipCell(x, y, HISTORY[time])
     fill(HISTORY[time], canvas.getContext('2d'));
    }
};


const fill = (grid, ctx) => {
    for(var i = 0; i < grid.size[0]; i++){
      for(var j = 0; j < grid.size[1]; j++){
        if (activeAt(i,j, grid)){
          ctx.fillStyle = !REVERSE ? ALIVE : REVERSE_ALIVE;
        } else {
          ctx.fillStyle = DEAD;
        }
        ctx.fillRect(i * CELLSIZE, j * CELLSIZE, CELLSIZE, CELLSIZE);
      }
    }
}

const draw = (bypass = false) => {
  if(bypass || !PAUSE){
    var time = HISTORY.length - 1;
    const canvas = document.getElementById('grid');
    const ctx = canvas.getContext('2d');
    if(!REVERSE){
      HISTORY.push(step(HISTORY[time]));
      time++;
    } else if(time > 1) {
      HISTORY.pop();
      time--;
    } else {
      // Make sure not to travel back too far in time
      HISTORY.pop();
      PAUSE = true;
      REVERSE = false; 
      time=0
    }
    fill(HISTORY[time], ctx);
  }
}

const render = () => {
  HISTORY = [customGrid(defaultGrid)];
  const grid = HISTORY[0];

  var canvas = document.getElementById('grid');
  var ctx = canvas.getContext('2d');
  canvas.width = grid.size[0] * CELLSIZE;
  canvas.height = grid.size[1] * CELLSIZE;
  
  document.onkeydown = detect;
  canvas.onclick = toggle
  fill(grid,ctx);
  setInterval(draw,50);
}

// Wait to start rendering until DOM elements exist
while(document.getElementById('grid') === null){
  continue;
}

render();
