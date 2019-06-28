let teapot;
let scroll = 2;
let normalizedScroll = - scroll;
let rotX = 0;
let rotY = 90;
let rotZ = 42;
let count = 0;

function preload() {
  // Load model with normalise parameter set to true
  teapot = loadModel('https://raw.githubusercontent.com/dougcarrico/SIT-p5/master/navega/assets/SOMA.obj', true);
}

function setup() {
  setAttributes('antialias', true);
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
}

function draw() {
  background(255);
  
  angleMode(DEGREES);
  colorMode(RGB, 255);
  background(255, 255, 255);
  normalizedScroll = - scroll
  
  // ambientLight(200, 200, 200);
  // pointLight(255, 255, 255, width / 2, height / 2, 800);
  lights();
  fill(255);
  
  push();
  scale(normalizedScroll); // Scaled to make model fit into canvas
  rotateX(rotY);
  rotateY(rotZ);
  rotateZ(rotX);
  noStroke();
  fill(23, 126, 230);
  model(teapot);
  pop();
  

  if (mouseIsPressed) {
    if (mouseButton == LEFT) {
      rotX += -(mouseX - pmouseX);
      rotY += -(mouseY - pmouseY);
    }
    if (mouseButton == CENTER) {
      rotZ += -(mouseX - pmouseX);
    }
  }
  

}

function mouseWheel(event) {
  scroll -= event.delta / 100;
  if (scroll <= 0.1) {
    scroll = 0.1;
  }
  //uncomment to block page scrolling
  return false;
}

function multiColors() {
  colorMode(HSB);
  fill(count, 100, 100);
  count++;
  if (count >= 360) {
    count = 0;
  }

}

function keyTyped() {
  if (key == "r") {
    scroll = 2;
    rotX = 0;
    rotY = 90;
    rotZ = 42;
    count = 0;
  }
}
