I want this to have, this really nice animation, changes the pm and am format, with clouds and sun moving to represent it, I want to have this exactly but this is limited to a pill shaped button


I want to implement it on the clock

```
<button data-time="day" id="button-wrapper">
  <span id="button" onclick="toggleButton()"></span>
  <canvas id="stars"></canvas>
</button>

<label for="scale">Scale: <span id="scale-value">3</span>
  <input type="range" name="scale" id="scale" min="1" max="5" value="3" onchange="updateScale()">
</label>
```


```
:root {
  --ease: cubic-bezier(.4,-0.3,.6,1.3);
  --clr-background-day: #1b7fcc;
  --clr-background-night: #070b34;
  
  --clr-sun: #FCE570;
  --clr-sun-lgt: #ffffe3;
  
  --clr-moon: hsl(212, 13%, 75%);
  
  --button-width: 2.5em;
}

html {
  font-size: calc(20px * 3);
}

body {
  background-color: #bbb;
  height: 100dvh;
  transition: background-color 0.75s ease;
}

#button-wrapper {
  --x: 6px;
  --y: 10px;
  --spread: 8px;
  --offset: 0px;
  
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--clr-background-day);
  // background: linear-gradient(270deg, #1b7fcc, #71b2e3);
  width: 8em;
  height: 3em;
  border-radius: 2em;
  font-size: 1em;
  border: none;
  overflow: hidden;
  box-shadow: 
    var(--x) var(--y) var(--spread) var(--offset) rgb(0 0 0 / 0.15),
    var(--x) var(--y) var(--spread) var(--offset) rgb(0 0 0 / 0.25),
    inset var(--x) var(--y) var(--spread) var(--offset) rgb(255 255 255 / 0.35);
  isolation: isolate;
  transition: all 0.75s var(--ease);
  #button {
    position: absolute;
    left: 0.25em;
    right: auto;
    top: 50%;
    transform: translate(0, -50%);
    width: var(--button-width);
    height: var(--button-width);
    border-radius: 50%;
    background: radial-gradient(var(--clr-sun-lgt), transparent);
    background-color: var(--clr-sun);
    cursor: pointer;
    box-shadow: 
      0px 0px 0em 1em rgb(255 255 255 / 0.2),
      0px 0px 0em 2em rgb(255 255 255 / 0.2),
      0px 0px 0em 3em rgb(255 255 255 / 0.2),
      0 0 0.5em 0 #fff;
    transition: all 0.75s var(--ease);
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 60%;
      width: 25%;
      height: 25%;
      background-color: #c5c5c500;
      border-radius: 50%;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow:
        -0.95em -0.75em 0 0.1em #d5d5d500,
        0.1em -1em 0 -0.1em #d5d5d500;
    }
  }
  &::before {
    content: '';
    position: absolute;
    width: 2.5em;
    aspect-ratio: 1 / 1;
    background-color: #fff;
    border-radius: 50%;
    right: -0.25em;
    bottom: 0.4em;
    box-shadow:
      -1em 1em 0 -0.25em #fff,
      -2em 1.25em 0 -0.5em #fff,
      -3em 1.5em 0 -0.25em #fff,
      -4em 1.5em 0 -0.6em #fff,
      -5em 1.75em 0 -0.5em #fff;
    opacity: 0.5;
    transition: all 0.75s ease;
  }
  &::after {
    content: '';
    position: absolute;
    width: var(--button-width);
    height: var(--button-width);
    background-color: #fff;
    border-radius: 50%;
    right: -1em;
    bottom: 0em;
    box-shadow:
      -1em 1em 0 -0.25em #fff,
      -2em 1.25em 0 -0.5em #fff,
      -3em 1.5em 0 -0.25em #fff,
      -4em 1.5em 0 -0.6em #fff,
      -5em 1.75em 0 -0.5em #fff;
    transition: all 0.75s ease;
  }
  
  &[data-time="night"] {
    background-color: var(--clr-background-night);
    #button {
      background: radial-gradient(#eee, transparent);
      background-color: var(--clr-moon);
      left: calc(100% - 0.25em - var(--button-width));
      box-shadow: 
        0px 0px 0em 1em rgb(255 255 255 / 0.1),
        0px 0px 0em 2em rgb(255 255 255 / 0.1),
        0px 0px 0em 3em rgb(255 255 255 / 0.1),
        0 0 0.5em 0 #fff;
      &::after {
        transition-delay: 0.5s;
        background-color: #c5c5c5ff;
        box-shadow:
          -0.95em -0.75em 0 0.1em #d5d5d5ff,
          0.1em -1em 0 -0.1em #d5d5d5ff;
      }
    }
    &::before {
      right: -5em;
      bottom: -1em;
      scale: 2;
    }
    &::after {
      right: -5em;
      bottom: -2em;
      scale: 3;
    }
    
    canvas#stars {
      opacity: 1;
    }
  }
  
  canvas#stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0;
    transition: all 0.75s ease;
  }
}

label[for="scale"] {
  font-size: 24px;
  position: absolute;
  right: 32px;
  top: 16px;
}
```

```
console.clear();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const canvas = $('canvas#stars');
const ctx = canvas.getContext('2d');

resizeCanvas();

let stars = [];

class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 0;
    this.opacity = 1;
    this.growth = 0.1;
    this.isIncreasing = true;
  }
  update() {
    if (this.size > 2.5) {
      this.isIncreasing = false;
    }
    
    if (this.isIncreasing) {
      this.size += this.growth;
    } else {
      this.size -= this.growth * 0.5;
    }
    
    this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `#ffffff`;
    ctx.fill();
    ctx.closePath();
  }
}


class Cat {
  constructor(x, y) {
    this.image = new Image();
    this.image.src = returnCatInBase64();
    this.x = x;
    this.y = y;
    this.scale = 0.5;
    this.speed = 0.5;
  }
  update() {
    this.y -= this.speed;
    
    if (this.y < -200) {
      this.y = Math.random() * 200 + 200;
      const {x, y} = getRandomCatCoords();
      this.x = x
    }
    
    this.draw();
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale);
  }
}

const catCoords = getRandomCatCoords();
const cat = new Cat(catCoords.x, catCoords.y);

setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  stars.push(new Star(x, y));
}, 150)

const flicker = () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  stars.forEach((star, i) => {
    if (!star.isIncreasing && star.size < 0.25) {
      stars.splice(i, 1);
    }
    star.update();
  })
  
  cat.update();
  
  console.log(stars.length);
  
  requestAnimationFrame(flicker);
}
flicker();

function toggleButton() {
  const time = $('#button-wrapper').dataset.time;
  $('#button-wrapper').dataset.time = time === 'day' ? 'night' : 'day';
  if ($('#button-wrapper').dataset.time === 'night') {
    const {x, y} = getRandomCatCoords();
    cat.y = y;
    cat.x = x;
    document.body.style.backgroundColor = '#343434';
  } else {

    document.body.style.backgroundColor = '#bbb';
  }
}

function updateScale(e) {
  const scale = $('[name="scale"]').value;
  $('#scale-value').textContent = scale;
  document.documentElement.style = `font-size: ${16 * scale}px;`;
}

function getRandomCatCoords() {
  const x = Math.random() * (canvas.width * 0.6);
  const y = canvas.height + 100
  return {x, y}
}

function resizeCanvas() {
  canvas.width = $('#button-wrapper').getBoundingClientRect().width;
  canvas.height = $('#button-wrapper').getBoundingClientRect().height;
}



function returnCatInBase64() {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAADICAYAAAB70ba+AAAABGdBTUEAALGPC.....}
```


the sun and clouds should move in the clock, but the clock, but keep the current clock and have this as a new clock variant, I want to be able to change the clock vartiants later on.