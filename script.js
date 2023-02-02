let gameWrapper = document.getElementsByClassName("game")[0];
let cvs = document.getElementsByTagName("canvas")[0];
let ctx = cvs.getContext('2d');

// Setting Height & Width
let loaded = false;
let pgSize = {
      height: window.innerHeight,
      width: window.innerWidth
};

function resizing() {
      let ratio = 403 / 343;
      pgSize = {
            height: window.innerHeight,
            width: window.innerWidth
      };
      if (pgSize.height < pgSize.width) {
            let tempH = pgSize.height * 0.85;
            cvs.height = tempH;
            cvs.width = tempH * ratio;
            gameWrapper.style.width = tempH * ratio + "px";
            gameWrapper.style.height = "100vh";
            if (loaded) {
                  for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) grid[i][j].distances();
                  for (let i = 0; i < plyrArr.length; i++) {
                        plyrArr[i].resized();
                  };
            }
      } else if (pgSize.width < pgSize.height) {
            let tempW = pgSize.width * 0.85;
            cvs.height = tempW / ratio;
            cvs.width = tempW;
            gameWrapper.style.width = tempW + "px";
            gameWrapper.style.height = (tempW / ratio) + (tempW / (1039 / 87)) * 2 + "px";
            if (loaded) {
                  for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) grid[i][j].distances();
                  for (let i = 0; i < plyrArr.length; i++) {
                        plyrArr[i].resized();
                  };
            }
      }
      loaded = true;
}
resizing();

window.addEventListener("resize", resizing);

// The "GO!" Animation


// let i = 0;

// setInterval(() => {
//       ctx.clearRect(0, 0, cvs.height, cvs.width);
//       ctx.fillRect(0, 0, cvs.width, cvs.height);
//       ctx.drawImage(imgs[i % 28], 0, 0);
//       i++;
// }, 1 / 30 * 1000);


// load images

let imageCount = 0;
let totImages = 0;
let images = {
      goAnime: [],
      blastAnime: []
};

for (let i = 0; i <= 31; i++) {
      let image = new Image();
      if (i <= 27) {
            image.src = `./resources/go/${i}.png`;
            images.goAnime.push(image);
      } else if (i == 28) {
            image.src = './resources/block.png';
            images.block = image;
      } else if (i == 29) {
            image.src = './resources/active-block.png';
            images.activeBlock = image;
      } else if (i == 30) {
            image.src = './resources/back.png';
            images.background = image;
      } else if (i == 31) {
            image.src = './resources/eyes.svg';
            images.eyes = image;
      }
      totImages++;
      image.addEventListener("load", () => imageCount++);
}

for (let i = 0; i < 8; i++) {
      let image = new Image();
      image.src = `./resources/blast/${i}.png`;
      images.blastAnime.push(image);
      totImages++;
      image.addEventListener("load", () => imageCount++);
}

// let play = true
// // play audio
// window.addEventListener("load", () => {
//       if (play) {
//             document.getElementsByTagName("audio")[0].play();
//             play = false;
//       }
// });

function clickSound() {
      let sound = new Audio();
      sound.src = "./resources/audio/click.mp3";
      sound.play();
}

// moving screens
let screen = document.getElementsByClassName("screen");

let startBtn = document.getElementsByClassName("start")[0];
startBtn.addEventListener("click", () => {
      clickSound();
      screen[0].style.opacity = 0;
      setTimeout(() => screen[0].style.display = "none", 150);
});

class Player {
      constructor(name, color, x, y, angle) {
            this.name = name;
            this.color = color;
            this.x = x;
            this.y = y;
            this.px = x / cvs.width * 100;
            this.py = y / cvs.height * 100;
            this.angle = angle;
            this.headSize = 25 / 686 * cvs.height;
            this.speed = 5;
            this.movement = [0, 0, 0, 0];
      }

      draw() {
            if (this.angle >= 360) this.angle %= 360;
            ctx.beginPath();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.lineWidth = 1;
            ctx.arc(0, 0, this.headSize, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(images.eyes, -this.headSize * 5 / 8, -this.headSize * 5 / 8, this.headSize * 5 / 4, this.headSize * 5 / 8);
            ctx.rotate(-this.angle * Math.PI / 180);
            ctx.translate(-this.x, -this.y);
            ctx.closePath();
      }

      move(event) {
            switch (event) {
                  case "up":
                        if (!this.movement[0]) {
                              let up = setInterval(() => {
                                    if (this.movement[0]) {
                                          this.y--;
                                          this.direction();
                                          // if (this.angle < 180 && this.angle >= 0) {
                                          //       this.angle--;
                                          // } else if (this.angle >= 180 && this.angle <= 360) {
                                          //       this.angle++;
                                          // }
                                          this.collisionDetection();
                                    } else clearInterval(up);
                              }, this.speed);
                        }
                        break;
                  case "left":
                        if (!this.movement[1]) {
                              let left = setInterval(() => {
                                    if (this.movement[1]) {
                                          this.x--;
                                          this.direction();
                                          // if (this.angle >= 0) {
                                          //       if (this.angle > 270 && this.angle <= 360 || this.angle <= 90 && this.angle >= 0) {
                                          //             this.angle--;
                                          //       } else if (this.angle > 90) {
                                          //             this.angle++;
                                          //       }
                                          // } else if (this.angle < 0) {
                                          //       this.angle = 360 - Math.abs(this.angle);
                                          // }
                                          this.collisionDetection();
                                    } else clearInterval(left);
                              }, this.speed);
                        }
                        break;
                  case "down":
                        if (!this.movement[2]) {
                              let down = setInterval(() => {
                                    if (this.movement[2]) {
                                          this.y++;
                                          this.direction();
                                          // if (this.angle >= 0 && this.angle <= 180) {
                                          //       this.angle++;
                                          // } else if (this.angle > 180 && this.angle <= 360) {
                                          //       this.angle--;
                                          // }
                                          this.collisionDetection();
                                    } else clearInterval(down);
                              }, this.speed);
                        }
                        break;
                  case "right":
                        if (!this.movement[3]) {
                              let right = setInterval(() => {
                                    if (this.movement[3]) {
                                          this.x++;
                                          this.direction();
                                          // if (this.angle >= 0) {
                                          //       if (this.angle <= 270 && this.angle >= 90) {
                                          //             this.angle--;
                                          //       } else if (this.angle >= 0 && this.angle <= 90 || this.angle <= 360 && this.angle > 270) {
                                          //             this.angle++;
                                          //       }
                                          // } else if (this.angle < 0) {
                                          //       this.angle = 360 - Math.abs(this.angle);
                                          // }
                                          this.collisionDetection();
                                    } else clearInterval(right);
                              }, this.speed);
                        }
                        break;
                  default:
                        console.log("Not Possible");
                        break;
            }
            this.updatePercentages();
      }

      direction() {
            console.log(this.movement);
            if (this.movement[0] && this.movement[1]) {
                  this.angle = 315;
            } else if (this.movement[1] && this.movement[2]) {
                  this.angle = 225;
            } else if (this.movement[2] && this.movement[3]) {
                  this.angle = 135;
            } else if (this.movement[0] && this.movement[3]) {
                  this.angle = 45;
            } else if (this.movement[0]) {
                  this.angle = 0;
            } else if (this.movement[1]) {
                  this.angle = 270;
            } else if (this.movement[2]) {
                  this.angle = 180;
            } else if (this.movement[3]) {
                  this.angle = 90;
            }
      }

      resized() {
            this.headSize = 25 / 686 * cvs.height;
            this.x = this.px / 100 * cvs.width;
            this.y = this.py / 100 * cvs.height;
      }

      updatePercentages() {
            this.px = this.x / cvs.width * 100;
            this.py = this.y / cvs.height * 100;
      }

      collisionDetection() {
            // console.log(`${this.angle}`);
            for (let i = 0; i < plyrArr.length; i++) {
                  if (plyrArr[i].name != this.name) {
                        let [x1, y1, x2, y2] = [plyrArr[i].x, plyrArr[i].y, this.x, this.y];
                        let dx = x2 - x1;
                        let dy = y2 - y1;
                        let dc = Math.sqrt(dx ** 2 + dy ** 2);
                        if (dc <= this.headSize * 2) {
                              let y = -Math.cos(this.angle * 180 / Math.PI) * this.speed * 1.5;
                              let x = -Math.sin(this.angle * 180 / Math.PI) * this.speed * 1.5;
                              console.log(`x: ${x}, y: ${y}`);
                              plyrArr[i].x += x;
                              plyrArr[i].y += y;
                        }
                  }
            }
      }

      movedByCollision() {

      }
}

let numPlyrs = 2;
let plyrArr = [];
let detPlyrs = [
      {
            name: "red",
            color: "#fb0d01",
            pos: [(cvs.width / 6) / 2, (cvs.height / 5) / 2],
            angle: 135,
            keys: [87, 65, 83, 68]
      },
      {
            name: "blue",
            color: "#01baf9",
            pos: [(cvs.width / 6 * 5) + ((cvs.width / 6) / 2), (cvs.height / 5 * 4) + ((cvs.height / 5) / 2)],
            angle: 315,
            keys: [38, 37, 40, 39]
      },
      {
            name: "green",
            color: "#32ec08",
            pos: [(cvs.width / 6) / 2, (cvs.height / 5 * 4) + ((cvs.height / 5) / 2)],
            angle: 45,
            keys: [73, 74, 75, 76]
      },
      {
            name: "yellow",
            color: "#fed001",
            pos: [(cvs.width / 6 * 5) + ((cvs.width / 6) / 2), (cvs.height / 5) / 2],
            angle: 225,
            keys: [104, 100, 101, 102]
      }
];
let started = {
      started: false,
      goAnime: false
};

let plyrSlectBtns = document.getElementsByClassName("choice");
let backBtn = document.getElementsByClassName("back-btn")[0];
backBtn.addEventListener("click", () => {
      clickSound();
      screen[0].style.display = "block";
      setTimeout(() => screen[0].style.opacity = 1, 150);
});

for (let i = 1; i < plyrSlectBtns.length; i++) {
      plyrSlectBtns[i].addEventListener("click", () => {
            clickSound();
            numPlyrs = parseInt(plyrSlectBtns[i].innerHTML);
            for (let i = 0; i < numPlyrs; i++) {
                  plyrArr.push(new Player(detPlyrs[i].name, detPlyrs[i].color, detPlyrs[i].pos[0], detPlyrs[i].pos[1], detPlyrs[i].angle));
            }
            started.started = true;
            if (imageCount == 39) {
                  screen[1].style.opacity = 0;
                  screen[2].style.opacity = 0;
                  setTimeout(() => {
                        screen[1].style.display = "none";
                        screen[2].style.display = "none";
                  }, 150);
            } else {
                  screen[1].style.opacity = 0;
                  setTimeout(() => screen[1].style.display = "none", 150);
                  let waitinInterval = setInterval(() => {
                        console.log(imageCount);
                        if (started.started && imageCount == totImages) {
                              console.log("done");
                              screen[2].style.opacity = 0;
                              setTimeout(() => screen[2].style.display = "none", 150);
                              clearInterval(waitinInterval);
                        }
                  }, 10);
            }
      });
}

//  _____
// |  ___|
// | |
// |_|            THE GAME
//                                _
//                               | |
//                            ___| |
//                           |_____|

let grid = [];

class Cell {
      constructor(pos) {
            this.posX = pos.x;
            this.posY = pos.y;
            this.state = "norm";
      }

      distances() {
            this.dx = cvs.width / 6 * this.posX;
            this.dy = cvs.height / 5 * this.posY;
      }
}

function rowsAndColumns() {
      let row = [];
      for (let i = 0; i < 5; i++) {
            row = [];
            for (let j = 0; j < 6; j++) {
                  let cell = new Cell({ y: i, x: j });
                  cell.distances();
                  row.push(cell);
            }
            grid.push(row);
      }
}
rowsAndColumns();

function drawCells() {
      let l = 100 / 686 * cvs.height;
      let mX = 17 / 806 * cvs.width;
      let mY = 19 / 686 * cvs.height;
      for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                  let block;
                  grid[i][j].state == "norm" ? block = images.block : block = images.activeBlock;
                  ctx.drawImage(block, mX + grid[i][j].dx, mY + grid[i][j].dy, l, l);
            }
      }
}

function animate() {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(images.background, 0, 0, cvs.width, cvs.height);
      drawCells();
      for (let i = 0; i < plyrArr.length; i++) {
            plyrArr[i].draw();
      }
      if (started.started && imageCount == totImages) {
            // play go animation
            // select blocks to explode
            // then move
      }
      requestAnimationFrame(animate);
}
animate();

// Moving Players
window.addEventListener("keydown", (eve) => {
      for (let i = 0; i < plyrArr.length; i++) {
            for (let j = 0; j < detPlyrs[0].keys.length; j++) {
                  if (detPlyrs[i].keys[j] == eve.keyCode) {
                        switch (j) {
                              case 0:
                                    plyrArr[i].move("up");
                                    plyrArr[i].movement[0] = 1;
                                    break;
                              case 1:
                                    plyrArr[i].move("left");
                                    plyrArr[i].movement[1] = 1;
                                    break;
                              case 2:
                                    plyrArr[i].move("down");
                                    plyrArr[i].movement[2] = 1;
                                    break;
                              case 3:
                                    plyrArr[i].move("right");
                                    plyrArr[i].movement[3] = 1;
                                    break;
                              default:
                                    console.error("Not Possible");
                                    break;
                        }
                  }
            }
      }
});

window.addEventListener("keyup", eve => {
      for (let i = 0; i < plyrArr.length; i++) {
            for (let j = 0; j < detPlyrs[0].keys.length; j++) {
                  if (detPlyrs[i].keys[j] == eve.keyCode) {
                        switch (j) {
                              case 0:
                                    plyrArr[i].movement[0] = 0;
                                    break;
                              case 1:
                                    plyrArr[i].movement[1] = 0;
                                    break;
                              case 2:
                                    plyrArr[i].movement[2] = 0;
                                    break;
                              case 3:
                                    plyrArr[i].movement[3] = 0;
                                    break;
                              default:
                                    console.error("Not Possible");
                                    break;
                        }
                  }
            }
      }
});

// var poly = [15, 15, 100, 50, 10, 90];
// ctx.fillStyle = '#f00';

// ctx.beginPath();
// ctx.moveTo(poly[0], poly[1]);
// for (let item = 2; item < poly.length - 1; item += 2) {
//       ctx.lineTo(poly[item], poly[item + 1]);
// }

// ctx.closePath();
// ctx.fill();