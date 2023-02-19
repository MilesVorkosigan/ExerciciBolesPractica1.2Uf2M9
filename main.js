// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const numboles = 25; //treballarem incialment amb poques después ficarem les 25 demanades

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// funció per generar un número aleatori entre 2 valors
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// funció per generar un color aleatori
function randomRGB() {
  //@TODO3: Retornar un color aleatori rgb (exemple: rgb(valor,valor,valor) o #a1b2c3). Es pot aprofitar la funció random()
  var r = random(0, 255);
  var g = random(0, 255);
  var b = random(0, 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}

class Bola {
  constructor(x, y, velX, velY, color, tamany) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.tamany = tamany;
  }

  dibuixar() {
    //@TODO 1: Dibuixar una circumferència. Per fer-ho utilitzarem la funció "arc()" a la posició x,y de radi "tamany".
    // L'arc ha de començar a 0 i acabar en (2*Pi) per a que formi un cercle
    //funció arc() valor.arc(x,y,radi,posicio incial(0), posicio radi 2*MATH.PI, true false direcció horaria)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.tamany, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    //@TODO5: A cada execució:
    //posició x de la bola incrementa tants píxels com la velocitat X
    //posició y de la bola incrementa tants píxels com la velocitat Y
    //D'aquesta manera la bola avançara X pixels (segons la velocitat x) i Y pixels (segons la velocitat y)
    this.x += this.velX;
    this.y += this.velY;
    //@TODO6: Hem d'evitar que les boles sortin del frame.
    // Hem de fer-les rebotar quan arribin i toquin la paret del canvas
    // Per a que rebotin:
    //   si ho fan a la paret dreta o esquerra, la velocitat x canvia de direcció (Per exemple, si té velocitat X positiva, passa aquesta a negativa. O si és negativa, passa a positiva)
    //   si ho fan a la paret d'adalt o abaix, la velocitat y canvia de direcció (Per exemple, si té velocitat Y positiva, passa aquesta a negativa.  O si és negativa, passa a positiva)
    // S'ha de tenir en compte el tamany de la bola. Aquesta ha de rebotar quan la superfície de la bola toqui la paret.
    if (this.x > canvas.width - this.tamany || this.x < this.tamany) {
      this.velX = -this.velX;
      //fem per evitaR que col·lisions entre boles ens porti les boles fora de límit
      if (this.x + this.tamany > canvas.width) {
        this.x = canvas.width - this.tamany;
      } else if (this.x < this.tamany) {
        this.x = this.tamany;
      }
    }
    if (this.y > canvas.height - this.tamany || this.y < this.tamany) {
      this.velY = -this.velY;
      if (this.y + this.tamany > canvas.height) {
        this.y = canvas.height - this.tamany;
      } else if (this.y < this.tamany) {
        this.y = this.tamany;
      }
    }
  }

  collisio(segonaBola) {
    //@TODO8:
    //Mirem la bola actual amb cadascuna de les boles per veure si es toquen. Si es toquen, el color de les 2 boles es canvien per un color aleatori nou.
    //
    //la distància entre dos punts és d=√((x_2-x_1)²+(y_2-y_1)²)
    //Si aquesta distancia és menor que la suma dels tamanys de les boles => llavors es toquen: canviem els colors de manera aleatòria de les 2 boles
    let distancia = Math.sqrt(
      Math.pow(this.x - segonaBola.x, 2) + Math.pow(this.y - segonaBola.y, 2)
    );
    let distanciaRadi = this.tamany + segonaBola.tamany;
    //Per calcular les velocitats per no complicar el codi considerem les boles tenen mateixa masa 1 i que el moviment és elàstic
    //Obtenim la seguent formula física de la velocitat velocidadAFinalX = ((masa - (radioA / radioB) * masa) * velocidadAx + (1 + (radioA / radioB)) * masa * velocidadBx) / (masa + masa);que és la que farem servir
    if (distancia < distanciaRadi) {
      this.velX = -this.velX;
      this.velY = -this.velY;
      segonaBola.velX = -segonaBola.velX;
      segonaBola.velY = -segonaBola.velY;
      this.color = randomRGB();
      segonaBola.color = randomRGB();
    }
  }
}

//CREACIÓ DE BOLES
const boles = [];

while (boles.length < numboles) {
  //tamany de la bola en pixels
  const tamany = random(10, 20);
  const velMaxNeg = -7;
  const velMaxPos = 7;

  //@TODO 2:
  //Els valors s'han de canviar
  //      x úmero aleatori entre (el tamany de la bola) i (l'amplada de la finestra - tamany de la bola). Així forcem que la bola no sobrepassi la finestra al dibuxar-la
  //      y: número aleatori entre el (el tamany de la bola) i (l'alçada de la finestra - tamany de la bola). Així forcem que la bola no sobrepassi la finestra al dibuxar-la
  //      velocitat x: número aleatori entre -7 i 7
  //      velocitat y: número aleatori entre -7 i 7
  //      color: color aleatori (utilitzar funció randomRGB)
  //      tamany: tamany
  //
  //paràmetres de bola: pos x, pos y, velX, velY, color, tamany
  let a = random(tamany, canvas.width - tamany);
  let b = random(tamany, canvas.height - tamany);
  let vx = random(velMaxNeg, velMaxPos);
  let vy = random(velMaxNeg, velMaxPos);
  //let color = randomRGB();
  let color = randomRGB();
  let radi = tamany;
  let bola = new Bola(a, b, vx, vy, color, radi);
  boles.push(bola);
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const bola of boles) {
    bola.dibuixar();

    //@TODO4: activar update
    bola.update();

    //@TODO7: activar collisio

    // bola.collisio(); farem comprobació de totes les boles si alguna colisiona en la que tenim
    for (const segonaBola of boles) {
      if (bola != segonaBola) {
        bola.collisio(segonaBola);
      }
    }
  }

  //funció que executa loop a cada frame d'una animació.
  requestAnimationFrame(loop);
}
loop();
