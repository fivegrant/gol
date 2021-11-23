# Game of Life (GOL)

## Usage
- **S Key:** Pause
- **A Key:** Move Backward
    - Once the beginning state is reached, the simulation
      is switched forward and paused.
- **D Key:** Move Forward
- **W Key:** Step Forward
- **Mouse Click**: Flip Cell
    - Note that each cell must be flipped individually. Flipping
      cells is most effective when the simulation is paused.

### Running GOL
The project is a static site so any http server that serves
the `index.html` will do. I use and personally recommend 
[simple-http-server](https://github.com/TheWaWaR/simple-http-server).
If you are using **simple-http-server**,
just run (in the root directory of this project):
```
simple-http-server -i
```

## Sources 

- This project was created for Jim Mahoney's [Coding Workshop](https://cs.bennington.college/courses/fall2021/coding/home)
  class from the Fall of 2021.

- I was able to remove my dependency on [Underscore.js](https://underscorejs.org/)
  using a few tips from 
  [You Don't Need Lodash/Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore) 
  (primarily for the replacement of the range function).
