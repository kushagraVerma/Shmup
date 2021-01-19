// document.body.style.backgroundColor = "red";

let player;
let projectiles = [];
let enemies = [];
let powerUps = [];
let events = [];
let timeMoving = 0;
let paused = true;

let bullet_small = new Audio("Sounds/bullet_small.mp3");
bullet_small.volume = 0.5;
bullet_small.playbackRate = 1.2;
let bullet_big = new Audio("Sounds/bullet_big.mp3");
bullet_big.volume = 0.1;
bullet_big.playbackRate = 3;
let bullet_small2 = new Audio("Sounds/bullet_small2.mp3");
bullet_small2.volume = 0.4;
bullet_small2.playbackRate = 1.5;
let bomb_launch = new Audio("Sounds/bomb_launch.mp3");
bomb_launch.volume = 0.5;
bomb_launch.playbackRate = 1;
let bomb = new Audio("Sounds/bomb.mp3");
bomb.volume = 1;
bomb.playbackRate = 1;
let missile_launch = new Audio("Sounds/missile_launch.mp3");
missile_launch.volume = 0.5;
missile_launch.playbackRate = 1;
let player_hit = new Audio("Sounds/player_hit.mp3");
player_hit.volume = 1;
player_hit.playbackRate = 1;
let minion_hit = new Audio("Sounds/minion_hit.mp3");
minion_hit.volume = 1;
minion_hit.playbackRate = 1;
let tank_hit = new Audio("Sounds/tank_hit.mp3");
tank_hit.volume = 0.5;
tank_hit.playbackRate = 1;
let bomber_hit = new Audio("Sounds/bomber_hit.mp3");
bomber_hit.volume = 1;
bomber_hit.playbackRate = 1;
let boss_hit = new Audio("Sounds/boss_hit.mp3");
boss_hit.volume = 1;
boss_hit.playbackRate = 1;
let game_over = new Audio("Sounds/game_over.mp3");
game_over.volume = 1;
game_over.playbackRate = 0.8;

function setup() {
  createCanvas(window.innerWidth*97/100,window.innerHeight*97/100);
  // createCanvas(600,600);
  background(0);
  player = new Player();
  for(let i = 0; i<10; i++){
    // enemies.push(new Minion(20+i*width/10,50,90));
      enemies.push(new Minion(20+floor(random(width-40)),floor(random(40,60)),floor(random(70,120))));
  }
  for(let i = 0; i<2; i++){
    enemies.push(new Tank(20+floor(random(width-40)),floor(random(40,100)),floor(random(40,60))));
  }
  let para = document.createElement("P");
  para.innerHTML = "<i>Press and hold 'esc' to begin</i><br><br><br>"+
  "<u>OBJECTIVE</u><br>"+
  "<b>Destroy as many enemies as possible, as quickly you can. Keep moving!</b><br><br>"+
  "<u>CONTROLS</u><br>"+
  "<b>A and D:</b> Move left and right<br>"+
  "<b>W:</b> Ignore power up<br>"+
  "<b>Mouse:</b> Click to shoot, aim missile with cursor<br>"+
  "<b>Esc:</b> Press and hold to pause/unpause<br><br>"+
  "<u>PLAYER:</u><br>"+
  "<b>Max health:</b> 100HP<br>"+
  "<b>Max shield:</b> 100HP<br>"+
  "<b>Default damage:</b> 5<br>"+
  "<b>Default speed:</b> 180px/s<br>"+
  "<b>Default reload cooldown:</b> 0.33s<br>"+
  "<b>Default weapon:</b> Bullet<br>"+
  "<b>Projectile speed:</b> 300px/s<br>"+
  "<b>Default blast radius (for bombs):</b> 30px<br><br>"+
  "<u>ENEMIES</u><br>"+
  "<b>Minion:</b> Small, more reload cooldown (1 bullet in 0.83-2s), less health (10HP), shoots slow, small bullets (240px/s, 5 damage)<br>"+
  "<b>Tank:</b> Large, less reload cooldown (1 bullet in 1.16-1.66s), more health (50HP), shoots large bullets (speed depends on distance from player, 20 damage)<br>"+
  "<b>Bomber:</b> Medium, medium reload cooldown (1 bomb in 0.83-1.15s), medium health (20HP), shoots slow bombs (240px/s, 10 damage, 30px blast radius)<br>"+
  "<b>Seeker:</b> Large, more reload cooldown (1 bullet in 0.67-1s), more health (50HP), shoots fast, large bullets in player's direction(360px/s, 10 damage)<br>"+
  "<b>Boss:</b> Huge, 1 huge slow bullet every 0.67s (180px/s, 30 damage), a spray of 4 fast bombs every 1.67s (300px/s, 15 damage, 30px blast radius), a spray of 19 small slow bullets every 2.33s (228px/s, 5 damage), 2 fast missiles every 3.83s (10 damage, 10px blast radius), a lot of health (500HP)<br><br>"+
  "<u>WEAPONS</u><br>"+
  "<b>Bullet:</b> Damage, size and speed depend on owner<br>"+
  "<b>Bomb:</b> Damage, size, speed and blast radius depend on owner, with 10 base damage for player<br>"+
  "<b>Missile:</b> Damage, size and speed depend on owner, with 15 base damage for player, follows mouse<br>"+
  "<b>Destroyer:</b> Damage, size and speed depend on owner, with 25 base damage for player<br><br>"+
  "<u>POWER UPS</u><br>"+
  "Last 10s each<br>"+
  "<b>SPD1:</b> Increases speed to 240px/s<br>"+
  "<b>SPD2:</b> Increases speed to 360px/s<br>"+
  "<b>SPD3:</b> Increases speed to 480px/s<br>"+
  "<b>DMG1:</b> Increases damage to 8<br>"+
  "<b>DMG2:</b> Increases damage to 10<br>"+
  "<b>RLD1:</b> Decreases reload cooldown to 0.25s<br>"+
  "<b>RLD2:</b> Decreases reload cooldown to 0.17s<br>"+
  "<b>RLD3:</b> Decreases reload cooldown to 0.08s<br>"+
  "<b>HP1:</b> Increases health by 25HP<br>"+
  "<b>HP2:</b> Increases health by 50HP<br>"+
  "<b>SHLD1:</b> Increases shield by 25HP<br>"+
  "<b>SHLD2:</b> Increases shield by 50HP<br>"+
  "<b>BMB1:</b> Changes weapon to bomb, retains damage, reload cooldown and blast radius<br>"+
  "<b>BMB2:</b> Changes weapon to bomb, increases damage to 10, increases reload cooldown to 0.67s, increases blast radius to 60px<br>"+
  "<b>MSL1:</b> Changes weapon to missile, retains damage, increases reload cooldown to 0.67s, increases blast radius to 60px<br>"+
  "<b>X1:</b> Changes weapon to destroyer, retains damage, increases reload cooldown to 1.67s<br>";
  para.style = "color:#55ff55;font-family:Calibri;font-size:20px";
  document.body.appendChild(para);
}

function draw() {
  background(0);
  if(keyIsDown(27) && frameCount%5===0){
    paused = paused? false : true;
  }
  if(enemies.length>0){
    if(enemies.length<player.kills.total/5 && random(100)<1 && !paused && enemies[0].type!=="boss"){
      let rand = random(10);
      if(rand<3.5){
        enemies.push(new Minion(20+floor(random(width-40)),floor(random(60,80)),floor(50,90)));
      }else if(rand<6){
        enemies.push(new Tank(20+floor(random(width-40)),floor(random(80,140)),floor(random(40,50))));
      }else if(rand<8){
        enemies.push(new Seeker(20+floor(random(width-40)),floor(random(80,140)),floor(random(70,100))));
      }else{
        enemies.push(new Bomber(20+floor(random(width-40)),floor(random(60,100)),floor(random(50,70))));
      }
      let rnd = random(100);
      if(rnd<50){
        weighedPUtypes.push("HP2");
      }else if(rnd<60){
        weighedPUtypes.push("BMB2");
      }else if(rnd<80){
        weighedPUtypes.push("MSL1");
      }else if(rnd<90){
        weighedPUtypes.push("X1");
      }else{
        weighedPUtypes.push("SHLD2");
      }
    }
  }else{
    enemies.push(new Boss(width/2,100));
  }

  if(frameCount%floor(random(120,480))===0 && !paused){
    powerUps.push(new PowerUp(20+floor(random(width-40)),weighedPUtypes[floor(random(weighedPUtypes.length))]));
  }
  for(let p = powerUps.length-1; p>=0; p--){
    if(!paused) {
      powerUps[p].update();
    }
    powerUps[p].display();
    if(powerUps[p].pos.y>height||powerUps[p].grabbed){
      powerUps.splice(p,1);
    }
  }
  if(!paused){
    player.update();
  }
  if(player.health<0){
    game_over.play();
    player.health = 0;
    player.display();

    noStroke();
    fill(255,0,0,100);
    rect(-1,-1,width+2,height+2);

    textSize(40);
    textAlign(CENTER);
    fill(255,255,0,100);
    text("YOU DIED",width/2,height/2-100);

    textSize(20);
    let aliveT = floor(frameCount/6)/10;
    let movingT = floor(timeMoving/6)/10;
    text("Time Alive: "+aliveT+"s",width/2,height/2-50);
    text("Time Moving: "+movingT+"s",width/2,height/2-10);
    text("Total Enemies Killed: "+player.kills.total,width/2,height/2+30);

    textSize(15);
    text("Minions Killed: "+player.kills.minion,width/2,height/2+50);
    text("Tanks Killed: "+player.kills.tank,width/2,height/2+70);
    text("Bombers Killed: "+player.kills.bomber,width/2,height/2+90);
    text("Seekers Killed: "+player.kills.seeker,width/2,height/2+110);
    text("Bosses Killed: "+player.kills.boss,width/2,height/2+130);

    let score = floor(movingT*(player.kills.minion+player.kills.tank*5+player.kills.bomber*3+player.kills.seeker*5+player.kills.boss*10)*100/aliveT)/10;
    textSize(30);
    text("Score: "+score,width/2,height/2+180)
    noLoop();
  }
  player.display();

  for(let e = enemies.length-1; e>=0; e--){
    if(!paused){
      enemies[e].update();
    }
    enemies[e].display();
    if(enemies[e].health<=0){
      player.kills[enemies[e].type]++;
      if(enemies[e].type==="boss"){
        for(let i = 0; i<10; i++){
          enemies.push(new Minion(20+floor(random(width-40)),floor(random(60,80)),floor(50,90)));
        }
      }
      enemies.splice(e,1);
      player.kills.total++;
    }
  }

  for(let p = projectiles.length-1; p>=0; p--){
    let P = projectiles[p];
    if(!paused){
      P.update();
    }
    P.display();
    let pColl = P.collision();
    if(pColl[0] && !paused){
      if(P.type==="bullet"){
        if(P.owner==="player"){
          enemies[pColl[1]].hit(P.type,P.damage);
        }else if(projectiles[p].owner==="enemy"){
          player_hit.play();
          player_hit.currentTime = 0;
          player.hit(P.type,P.damage);
        }
      }else if(P.type==="bomb"){
        P.blast();
      }else if(P.type==="missile"){
        let b = new Bomb(P.pos.x,P.pos.y,0,-4,"player",6,P.damage,10);
        b.blast();
      }
      projectiles.splice(p,1);
      break;
    }
    if((projectiles[p].pos.y<0 && projectiles[p].speed.y<=0)||
    (projectiles[p].pos.y>height && projectiles[p].pos.y>=0)||
    (projectiles[p].pos.x<0 && projectiles[p].speed.x<=0)||
    (projectiles[p].pos.x>width && projectiles[p].pos.x>=0)){
      projectiles.splice(p,1);
    }
  }

  // for(let e of events){
  //   e(frameCount);
  // }

  if(paused){
    fill(255);
    rectMode(CENTER);
    rect(width/2-50,height/2,50,200);
    rect(width/2+50,height/2,50,200);
    rectMode(CORNER);
  }
  // if(frameRate()<30){
  //   console.log(frameRate());
  // }
}
