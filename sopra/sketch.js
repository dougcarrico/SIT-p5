let teapot;
let minScroll = 1;
let scroll = 2;
let normalizedScroll = - scroll;
let rotX = 90;
let rotY = 43;
let rotZ = 0;
let count = 0;
let mic;
let recording = false;
let frequency = 0;
let micLevel = 0;
let rotAcel = .1;
let button;
let buttonWidth = 80;
let buttonHeight = 40;

function preload() {
  // Load model with normalise parameter set to true
  teapot = loadModel('assets/soma.obj', true);
}

function setup() {
  setAttributes('antialias', true);
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);

  button = createButton('MIC OFF');
  button.addClass('button');
  // button.style('padding', buttonVerticalPadding + "px " + buttonHorizontalPadding + "px " + buttonVerticalPadding + "px " + buttonHorizontalPadding + "px");
  button.style("text-align", "center");
  button.style('width', buttonWidth + 'px');
  button.style('height', buttonHeight + 'px');

  button.addClass('micOff');

  button.mousePressed(playButton);


}

function draw() {
  background(255);

  button.position(windowWidth/2 - button.width/2, windowHeight - 80);
  
  angleMode(DEGREES);
  colorMode(RGB, 255);
  background(255, 255, 255);
  normalizedScroll = - scroll   
  pointLight(255, 255, 255, width / 2, height / 2, 800);
  // lights();
  fill(255);


  if (recording){
  //debugger;  
  micLevel = mic.getLevel()*10;
  frequency = findNote();

    if(scroll < micLevel) {
      scroll += .1;
    }

    if( scroll > micLevel && scroll >= minScroll){
      scroll -=.05;
    }

  }

  push();
  scale(normalizedScroll); // Scaled to make model fit into canvas
  rotateX(rotX);
  rotateY(rotY);
  rotateZ(rotZ);
  noStroke();
  fill(23, 126, 230);
  ambientLight(200+frequency, 200+frequency, 200+frequency);
  model(teapot);
  pop();
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

function playButton() {
  if (!recording) {
    mic.start();
    recording = true;
    button.html("MIC ON")
    button.removeClass('micOff');
    button.addClass('micOn');

  } else {
    mic.stop();
    recording = false;
    button.html("MIC OFF")
    button.removeClass('micOn');
    button.addClass('micOff');
  }
}

function touchStarted() {
  getAudioContext().resume()
}

function findNote() {
  let nyquist = sampleRate() / 2; // 22050
  let spectrum = fft.analyze(); // array of amplitudes in bins
  let numberOfBins = spectrum.length;
  let maxAmp = 0;
  let largestBin;

  for (let i = 0; i < nyquist; i++) {
      let thisAmp = spectrum[i]; // amplitude of current bin
      if (thisAmp > maxAmp) {
          maxAmp = thisAmp;
          largestBin = i;
      }
  }
  let loudestFreq = largestBin * (nyquist / numberOfBins);
  return loudestFreq;
}
