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

function preload() {
  // Load model with normalise parameter set to true
  teapot = loadModel('assets/soma.obj', true);
  font = loadFont('assets/Quicksand-Regular.otf');
}

function setup() {
  setAttributes('antialias', true);
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);

}

function draw() {
  background(255);
  
  angleMode(DEGREES);
  colorMode(RGB, 255);
  background(255, 255, 255);
  normalizedScroll = - scroll   
   pointLight(255, 255, 255, width / 2, height / 2, 800);
  // lights();
  fill(255);

  if (recording){
  debugger;  
  micLevel = mic.getLevel()*10;
  frequency = findNote();
  print(micLevel);


    if(scroll < micLevel) {
      scroll += .1;
    }

    if( scroll > micLevel && scroll >= minScroll){
      scroll -=.05;
    }

  }

  
  // textSize(32);
  // fill(0);
  // textFont(font);
  // text("frequency"+ rotAcel, -200,-200);
  // text("rotX: "+ rotX , -300, -300);
  // text("micLevel: "+ micLevel , -400, -400);
    
  
  

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
  
  

  // if (mouseIsPressed) {
  //   if (mouseButton == LEFT) {
  //     rotX += -(mouseX - pmouseX);
  //     rotY += -(mouseY - pmouseY);
  //   }
  //   if (mouseButton == CENTER) {
  //     rotZ += -(mouseX - pmouseX);
  //   }
  // }
  

}

// function mouseWheel(event) {
//   scroll -= event.delta / 100;
//   if (scroll <= 0.1) {
//     scroll = 0.1;
//   }
//   //uncomment to block page scrolling
//   return false;
// }

// function multiColors() {
//   colorMode(HSB);
//   fill(count, 100, 100);
//   count++;
//   if (count >= 360) {
//     count = 0;
//   }

// }

function keyTyped() {
  if (key == "r") {
    scroll = 2;
    rotX = 0;
    rotY = 90;
    rotZ = 42;
    count = 0;
  }

  if (key.toLowerCase() == "m"){
    if(!recording){
      mic.start();
      recording = true;
    } else {
      mic.stop();
      recording = false;
    }
    
  }
}

function touchStarted() {
  getAudioContext().resume()
}

// function findNote() {

//   fft.forward(mic.left);
//   for (let f=0; f<sampleRate/2; f++) { //analyses the amplitude of each frequency analysed, between 0 and 22050 hertz
//     max[f]=fft.getFreq(float(f)); //each index is correspondent to a frequency and contains the amplitude value
//   }
//   maximum=max(max);//get the maximum value of the max array in order to find the peak of volume

//   for (let i=0; i<max.length; i++) {// read each frequency in order to compare with the peak of volume
//     if (max[i] == maximum) {//if the value is equal to the amplitude of the peak, get the index of the array, which corresponds to the frequency
//       frequency= i;
//     }
//   }
//   //Creditos a: http://creativec0d3r.blogspot.com/2013/01/how-to-get-frequency-values-from-mic.html
// }

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
  let loudestFreq = largestBin * (nyquist / numberOfBins);;
  return loudestFreq;
}