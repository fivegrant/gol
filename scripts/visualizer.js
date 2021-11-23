/**
 * visualizer.js - Draws cellular automata to the browser.
 */

import { emptyGrid, customGrid, step, flipCell, activeAt } from "/gol/scripts/engine.js"

// Configure
const ALIVE = 'rgb(0,0,200)';
const REVERSE_ALIVE = 'rgb(200,0,0)';
const DEAD = 'rgb(255,255,255)';
const CELLSIZE = 13;

// Declare state
var HISTORY = [];
var PAUSE = false;
var REVERSE = false;

const defaultGrid = await fetch("/gol/layouts/default.txt")
                           .then(file => file.text());

// Creates Keybindings
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

// Enables cell flipping with cursor
const toggle = e => {
   // Get the cursor coordinates relative to the canvas tag.
   const canvas = document.getElementById('grid')
   const pixelX = e.clientX - canvas.offsetLeft;
   const pixelY = e.clientY - canvas.offsetTop;

   // Figure out which cell the picked pixel lands in 
   const [x,y] = [Math.floor(pixelX / 13), Math.floor(pixelY / 13)];

   // Alter then redraw current state
   const time = HISTORY.length - 1;
   HISTORY[time] = flipCell(x, y, HISTORY[time]);
   fill(HISTORY[time], canvas.getContext('2d'));
};


// Paints a given board state to the screen.
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

// Steps forward one then draws
const draw = (bypass = false) => {
  if(bypass || !PAUSE){
    var time = HISTORY.length - 1;
    const canvas = document.getElementById('grid');
    const ctx = canvas.getContext('2d');
    if(!REVERSE){ // Move forward in time
      HISTORY.push(step(HISTORY[time]));
      time++;
    } else if(time > 1) { // Move backward in time
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

// Initializes canvas, then continously calls the `draw` function
const render = () => {
  HISTORY = [customGrid(defaultGrid)];
  const grid = HISTORY[0];

  var canvas = document.getElementById('grid');
  var ctx = canvas.getContext('2d');
  canvas.width = grid.size[0] * CELLSIZE;
  canvas.height = grid.size[1] * CELLSIZE;
  
  // Enable listeners
  document.onkeydown = detect;
  canvas.onclick = toggle

  fill(grid,ctx); // Draw initial state

  setInterval(draw,50);
}

// Wait to start rendering until DOM elements exist
while(document.getElementById('grid') === null){
  continue;
}

render();
