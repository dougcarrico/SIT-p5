
let mic;
let fft;
let recording = false;
let micLevel = 0;
let frequency = 0; //the frequency in hertz

let palavras = ["SOMA", 
  "INTEGRAR",
  "COLABORAR",
  "SIMPLIFICAR",
];

let rPalavra; //declara variável da palavra randomica
let palavra; //declara variável da palavra
let quantLetra; // quantidade de letras disponíveis
let caracteres = []; // Declara a let do objeto Letras chamado caracteres
let cCount = 0; // contador de quantidade de letras criadas
let fontBold;
let fontRegular;
let fontLight;
let letra;
let maxDelayPalavra = 600;
let delayPalavra = 0; //Contador de delay da palavra
let palavraIndex;
let delayLetra = 0;
let maxDelayLetra = 5;
let mostraDados = false;
// let start;
let button;
let buttonWidth = 80;
let buttonHeight = 40;

function preload() {
  fontBold = loadFont("assets/OpenSans-Bold.ttf");
  fontRegular = loadFont("assets/OpenSans-Regular.ttf");
  fontLight = loadFont("assets/OpenSans-Light.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);

  button = createButton('Off');
  button.addClass('button');
  // button.style('padding', buttonVerticalPadding + "px " + buttonHorizontalPadding + "px " + buttonVerticalPadding + "px " + buttonHorizontalPadding + "px");
  button.style("text-align", "center");
  button.style('width', buttonWidth + 'px');
  button.style('height', buttonHeight + 'px');

  button.addClass('micOff');

  button.mousePressed(playButton);

  // start = new Botão(windowWidth/2, windowHeight - 80, 40, 40);

  quantLetra = int(width / 24); // Atribui a quantidade de letras possíveis na tela
  caracteres = new Array(quantLetra);

  rPalavra = palavras[int(random(0, palavras.length))]; //randomiza uma palavra do array de palavras
  palavra = rPalavra; //atribui a palavra da vez
  palavraIndex = palavra.length - 1;
}

function draw() {

  background(255);
  // start.show();

  button.position(windowWidth/2 - button.width/2, windowHeight - 80);
  
  if (recording) {
    micLevel = mic.getLevel() * 1000; //multiplica o valor de fAmp por 1000 e coloca em "amp"
    frequency = 1; //find note function
  } else {
    // micLevel = 0;
    // frequency = 0;
  }

  // Quando o contador chegar no tempo de delay, troca a palavra que cai
  if (delayPalavra == maxDelayPalavra) {
    changePalavra();
    palavraIndex = palavra.length - 1; // reseta o index da palavra

    delayPalavra = 0; //reseta o delayPalavra
  } else {

    delayPalavra++; //Adiciona 1 ao contador de delay da palavra
  }

  //Cria uma objeto que quando detecta amplitude maior que 1 começa a cair as letras
  if (delayLetra == maxDelayLetra) {

    delayLetra = 0; // reseta o delay de mostrar a letra

    setLetra(); // seta a letra a ser mostrada

    createLetra(); // Cria o objeto com a letra e peso de fonte
  } else {
    delayLetra++;
  }

  display(); // Mostra e move as letras na tela

  if (mostraDados) {
    showGUI();
  }

}


function changePalavra() {
  rPalavra = palavras[int(random(0, palavras.length))];
  if (rPalavra == palavra) {
    changePalavra();
  } else {
    palavra = rPalavra;
  }
}

function setLetra() {

  letra = palavra.charAt(palavraIndex);

  if (palavraIndex > 0) {
    palavraIndex--; // decrementa o index da palavra
  } else {
    palavraIndex = palavra.length - 1; // reseta o index da palavra
  }
}



function createLetra() {

  // Se a frequência for menor que 500hz, a fonte é bold
  if (frequency < 500) {
    caracteres[cCount] = new Letra(letra, fontBold);

    cCount++;
  }

  // Se a frequência for maior que 500hz e menor que 1500hz, a fonte é regular
  else if (frequency > 500 && frequency < 1500) {

    caracteres[cCount] = new Letra(letra, fontRegular);

    cCount++;
  }

  // Se a frequência for maior que 1500hz, a fonte é bold
  else if (frequency > 1500) {
    caracteres[cCount] = new Letra(letra, fontLight);
    cCount++;
  }

  if (cCount == quantLetra) {
    cCount = 0;
  }
}

// Mostra as letras na tela
function display() {

  for (let i = 0; i < quantLetra; i++) {
    if (caracteres[i] != null) {
      caracteres[i].move();
      caracteres[i].show();
    }
  }
}

//INFORMAÇÕES NA TELA
function showGUI() {

  textSize(20);
  fill(255, 0, 0);
  textFont(fontRegular, 20);
  text("Última letra:" + letra, width - 150, height - 50);
  //text("Contador:"+ cCount, width-150, height-20);

  //Canto inferior Esquerdo
  text("micLevel : " + micLevel, 10, height - 40);
  text("Freq: " + frequency + " hz", 10, height - 60);

  //Superior esquerdo
  text("FPS: " + frameRate, 10, 20);
  text("Delay: " + delayPalavra, 10, 40);
  text("DelayLetra: " + delayLetra, 10, 60);

  ////Inferior Centro
  textSize(30);
  text(palavra, (width / 2) - (textWidth(palavra)) / 2, height - 20);
}


function findNote() {
  let nyquist = sampleRate / 2; // 22050
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

function keyTyped() {
  if (key.toLowerCase() == 'i') {
    mostraDados = !mostraDados;
    // mostra as informações de controle na tela
  }

  if (key.toLowerCase() == "m") {
    if (!recording) {
      mic.start();
      recording = true;
    } else {
      mic.stop();
      recording = false;
    }

  }
}

function playButton() {
  if (!recording) {
    mic.start();
    recording = true;
    button.html("On")
    button.removeClass('micOff');
    button.addClass('micOn');

  } else {
    mic.stop();
    recording = false;
    button.html("Off")
    button.removeClass('micOn');
    button.addClass('micOff');
  }
}

// function mouseClicked() {

//  if(start.isOver) {

//   if (!recording) {
//     start.isActive = true;
//     mic.start();
//     recording = true;
//   } else {
//     start.isActive = false;
//     mic.stop();
//     recording = false;
//   }
//  }
// }

class Letra {
  // Construtor
  constructor(letraTemp, fonteTemp) {
    this.tamanho = 45;
    this.x = -10;
    this.y = height / 2;
    this.t = 0;
    this.letra;
    this.fonte;
    this.A = micLevel * 2; // amplitude da ondulação
    this.f; //frequência da ondulação
    this.ang = 0.0;
    this.g = int(frequency);
    this.letra = letraTemp;
    this.fonte = fonteTemp;
    this.setFreq();

  }

  show() {
    textFont(this.fonte);
    textSize(this.tamanho);

    fill(23, 126, 230);

    // Se a letra for "I" adiciona um espaço para arrumar o kerning
    if (letra == 'I' || letra == 'Í') {
      text(this.letra, this.x + 4, this.y);
    } else {
      text(this.letra, this.x, this.y);
    }
  }

  move() {

    this.x += 5;
    this.ang += 0.02;
    this.y = height / 2 - (this.A * (sin(this.ang * this.f))) ;
    this.t += 1 / frameRate;
  }

  setFreq() {

    if (frequency < 500) {
      this.f = 1 + frequency / 1000;
    }

    if (frequency > 500 && frequency < 1500) {
      this.f = 5 + frequency / 1000;
    }

    if (frequency > 1500) {
      this.f = 10 + frequency / 1000;
    }
  }
}

// class Botão {
//   constructor(tempX, tempY, tempWidth, tempHeight) {
//   this.x = tempX;
//   this.y = tempY;
//   this.width = tempWidth;
//   this.height = tempHeight;
//   this.isOver = false;
//   this.isActive = false;
//   this.translateX = - this.width/2;
//   this.translateY = - this.height/2;
//   this.newX = tempX + this.translateX;
//   this.newY = tempY + this.translateY;

//   }

//   show() {
//     this.hoverOn();
//     noStroke();

//     push();
//     translate(this.translateX, this.translateY);

//     if (this.isActive){
//       fill(216, 35, 35);
//       if(this.isOver){
//         fill(180, 35, 35);
//       }
//       rect(this.x, this.y, this.width, this.height);
//     }

//     if (!this.isActive){
//       fill(39, 155, 39);
//       if (this.isOver){
//         fill(39, 100, 39);
//       }
      
//       triangle(this.x + 5, this.y, this.x + 40, this.y + 20, this.x + 5, this.y + 40);
//     }
//     pop();   
//   }

//   hoverOn(){
//       if (((mouseX >= this.newX) && (mouseX <= this.newX+ this.width)) && ((mouseY>= this.newY) && (mouseY <= this.newY + this.height))  ){
//         this.isOver = true;
//       } else {
//         this.isOver = false;
//       }
//   }

// }