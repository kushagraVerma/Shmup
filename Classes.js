class Projectile{
  constructor(x,y,vx,vy,owner,type,size){
    this.pos = createVector(x,y);
    this.speed = createVector(vx,vy);
    this.owner = owner;
    this.type = type;
    this.size = size;
    this.normalMove = true;
  }
  collision(){
    if(this.owner === "player"){
      for(let e of enemies){
        if(dist(this.pos.x,this.pos.y,e.pos.x,e.pos.y)<e.hitRadius+this.size/2){
          return [true,enemies.indexOf(e)];
        }
      }
      return [false];
    }else if (this.owner === "enemy") {
      return [(dist(this.pos.x,this.pos.y,player.pos.x,player.pos.y)<player.hitRadius+this.size/2)];
    }
  }
  update(){
    if(this.normalMove){
      this.pos.add(this.speed);
    }else{
      this.move();
    }
  }
}

class Bullet extends Projectile{
  constructor(x,y,vx,vy,owner,size,dmg){
    super(x,y,vx,vy,owner,"bullet",size);
    this.damage = dmg;
  }
  display(){
    noStroke();
    fill(255);
    rect(this.pos.x-this.size/2,this.pos.y-this.size/2,this.size,this.size);
  }
}

class Bomb extends Projectile{
  constructor(x,y,vx,vy,owner,size,dmg,blastR){
    super(x,y,vx,vy,owner,"bomb",size);
    this.damage = dmg;
    this.blastRadius = blastR;
  }
  blast(){
    bomb.play();
    bomb.currentTime = 0;
    if(dist(this.pos.x,this.pos.y,player.pos.x,player.pos.y)<this.blastRadius+player.hitRadius){
      player.health-=this.damage;
    }
    for(let e of enemies){
      if(dist(this.pos.x,this.pos.y,e.pos.x,e.pos.y)<this.blastRadius+e.hitRadius){

        e.health-=this.damage;
      }
    }
    fill(255,69,0);
    ellipse(this.pos.x,this.pos.y,this.blastRadius,this.blastRadius);
    // noLoop();
  }
  display(){
    noStroke();
    fill(255);
    ellipse(this.pos.x,this.pos.y,this.size,this.size);
  }
}

class Missile extends Projectile{
  constructor(x,y,vx,vy,owner,size,dmg){
    super(x,y,vx,vy,owner,"missile",size);
    this.acc = createVector(0,0);
    this.damage = dmg;
    this.normalMove = false;
  }
  move(){
    if(this.owner === "player"){
      if(mouseIsPressed){
        let mousePos = createVector(mouseX,mouseY);
        if(p5.Vector.dist(this.pos,mousePos)>20){
          let target = p5.Vector.sub(this.pos,mousePos);
          this.acc.set(p5.Vector.div(target,-100));
          // this.acc.normalize();
          // this.speed.normalize();
          this.speed.add(this.acc);
          this.speed.limit(10);
          this.pos.add(this.speed);
          this.acc.mult(0);
        }else{
          this.acc.mult(0,0);
          this.speed.normalize();
          this.pos.set(mousePos.copy());
        }
      }else{
        this.pos.add(this.speed);
      }
    }else if(this.owner === "enemy"){
      if(p5.Vector.dist(this.pos,player.pos)>20){
        let target = p5.Vector.sub(this.pos,player.pos);
        this.acc.set(p5.Vector.div(target,-100));
        // this.acc.normalize();
        // this.speed.normalize();
        this.speed.add(this.acc);
        this.speed.limit(10);
        this.pos.add(this.speed);
        this.acc.mult(0);
      }else{
        this.acc.mult(0,0);
        this.speed.normalize();
        this.pos.set(player.pos.copy());
      }
    }
  }
  display(){
    // push();
    // translate(this.pos.x,this.pos.y);
    // rotate(a);
    noStroke();
    fill(255);
    ellipse(this.pos.x,this.pos.y,this.size,this.size);
    // pop();
  }
}

let PUtypes = ["SPD1","SPD2","SPD3",
"DMG1","DMG2",
"RLD1","RLD2","RLD3",
"HP1","HP2",
"SHLD1","SHLD2",
"BMB1","BMB2",
"MSL1",
"X1"];

let weighedPUtypes = ["SPD1","SPD1","SPD1","SPD1","SPD1","SPD1",
"RLD1","RLD1","RLD1","RLD1","RLD1","RLD1",
"DMG1","DMG1","DMG1","DMG1","DMG1","DMG1",
"HP1","HP1","HP1","HP1","HP1","HP1",
"SPD2","SPD2","SPD2","SPD2",
"RLD2","RLD2","RLD2","RLD2",
"DMG2","DMG2","DMG2","DMG2",
"HP2","HP2","HP2","HP2",
"SHLD1","SHLD1","SHLD1","SHLD1",
"SPD3","SPD3",
"RLD3","RLD3",
"BMB1","BMB1",
"SHLD2","SHLD2",
"BMB2",
"MSL1"];

weighedPUtypes = weighedPUtypes.concat(weighedPUtypes.concat(weighedPUtypes.concat(weighedPUtypes)));
weighedPUtypes.push("X1");

class PowerUp{
  constructor(x,type){
    this.pos = createVector(x,10);
    this.type = type;
    this.grabbed = false;
  }
  display(){
    noStroke();
    let l = PUtypes.length;
    colorMode(HSB,l);
    fill(PUtypes.indexOf(this.type),l,l);
    ellipse(this.pos.x,this.pos.y,30,30);
    colorMode(RGB,255);
    fill(0);
    textAlign(CENTER);
    textSize(10);
    let txt = this.type;
    let txt1 = txt.slice(0,this.type.length-1);
    text(txt1,this.pos.x,this.pos.y);
    text(this.type[this.type.length-1],this.pos.x,this.pos.y+8);
  }
  update(){
    this.collision();
    this.pos.y++;
  }
  collision(){
    if(dist(this.pos.x,this.pos.y,player.pos.x,player.pos.y)<20 && !keyIsDown(87)){
      if(this.type!=="HP1" && this.type!=="HP2" && this.type!=="SHLD1" && this.type!=="SHLD2"){
        // if(player.PUcooldown===0){
        this.grabbed = true;
        player.powerUp(this.type);
        player.PUcooldown = 600;
        colorMode(HSB,PUtypes.length);
        player.color = color(PUtypes.indexOf(this.type),PUtypes.length,PUtypes.length);
        colorMode(RGB,255);
        // }
      }else{
        this.grabbed = true;
        player.powerUp(this.type);
      }
    }
  }
}

class Player{
  constructor(){
    this.pos = createVector(width/2,height-20);
    // this.x = width/2;
    // this.y = height-20;
    this.damage = 5;
    this.speed = 3;
    this.health = 100;
    this.hitRadius = 5;
    this.reloadSpeed = 20;
    this.blastRadius = 30;
    this.cooldown = 0;
    this.PUcooldown = 0;
    this.color = color(255);
    this.weapon = "bullet";
    this.kills = {
      total : 0,
      minion : 0,
      tank : 0,
      bomber : 0,
      seeker : 0,
      boss : 0
    };
    this.shield = 0;
  }
  display(){
    noStroke();
    fill(this.color);
    quad(this.pos.x-5,this.pos.y-5,this.pos.x+5,this.pos.y-5,this.pos.x+10,this.pos.y+5,this.pos.x-10,this.pos.y+5);
    fill(0,255,0);
    rect(this.pos.x-10,this.pos.y+10,this.health/5,3);
    fill(0,190,255);
    rect(this.pos.x-10,this.pos.y+14,this.shield/5,3);

    if(this.PUcooldown<240 && this.PUcooldown>0 && this.PUcooldown%30>0 && this.PUcooldown%30<15){
      fill(255);
      quad(this.pos.x-5,this.pos.y-5,this.pos.x+5,this.pos.y-5,this.pos.x+10,this.pos.y+5,this.pos.x-10,this.pos.y+5);
    }
  }
  update(){
    this.move();
    if(this.cooldown>0){
      this.cooldown--;
    }
    if(this.PUcooldown>0){
      this.PUcooldown--;
    }else if(this.PUcooldown===0){
      this.reset();
    }
  }
  reset(){
    this.damage = 5;
    this.speed = 3;
    this.reloadSpeed = 20;
    this.color = color(255);
    this.weapon = "bullet";
    this.blastRadius = 30;
  }
  powerUp(type){
    if(type !== "HP1" && type !== "HP2"
    && type !== "BMB1" && type !== "BMB2"
    && type !== "MSL1" && type !== "SHLD1"
    && type!=="SHLD2"){
      this.reset();
    }
    if(type==="SPD1"){
      this.speed = 4;
    }else if(type==="SPD2"){
      this.speed = 6;
    }else if(type==="SPD3"){
      this.speed = 8;
    }else if(type==="DMG1"){
      this.damage = 8;
    }else if(type==="DMG2"){
      this.damage = 10;
    }else if(type==="RLD1"){
      this.reloadSpeed = 15;
    }else if(type==="RLD2"){
      this.reloadSpeed = 10;
    }else if(type==="RLD3"){
      this.reloadSpeed = 5;
    }else if(type==="HP1"){
      this.health += 25;
      if(this.health>100){
        this.health=100;
      }
    }else if(type==="HP2"){
      this.health +=50;
      if(this.health>100){
        this.health=100;
      }
    }else if(type==="BMB1"){
      this.weapon = "bomb";
    }else if(type==="BMB2"){
      this.weapon = "bomb";
      this.damage = 10;
      this.reloadSpeed = 40;
      this.blastRadius = 60;
    }else if(type==="MSL1") {
      this.weapon = "missile";
      this.reloadSpeed = 40;
      this.blastRadius = 60;
    }else if(type==="SHLD1"){
      this.shield += 25;
      if(this.shield>100){
        this.shield=100;
      }
    }else if(type==="SHLD2"){
      this.shield += 50;
      if(this.shield>100){
        this.shield=100;
      }
    }else if(type==="X1"){
      this.weapon = "destroyer";
      this.reloadSpeed = 100;
    }
    // if(type!=="HP1"&&type!=="HP2"){
    //   this.PUcooldown = 600;
    // }
  }
  hit(type,dmg){
    if(this.shield>0){
      let diff = this.shield-dmg*4/5;
      if(diff>=0){
        this.shield-=dmg*4/5;
        this.health-=dmg/5;
      }else{
        this.shield = 0;
        this.health+=diff;
      }
    }else{
      this.health-=dmg;
    }
  }
  move(){
    if(keyIsDown(68)) {
      this.pos.x+=this.speed;
      timeMoving++;
      if(this.pos.x>width-15){
        this.pos.x = 15;
      }
    }else if(keyIsDown(65)) {
      this.pos.x-=this.speed;
      timeMoving++;
      if(this.pos.x<15){
        this.pos.x = width-15;
      }
    }
    if(mouseIsPressed && this.cooldown===0){
      this.shoot();
    }
  }
  shoot(){
    this.cooldown = this.reloadSpeed;
    if(this.weapon === "bullet"){
      bullet_small.play();
      bullet_small.currentTime = 0;
      projectiles.push(new Bullet(this.pos.x,this.pos.y,0,-5,"player",4,this.damage));
    }else if(this.weapon === "bomb"){
      bomb_launch.play();
      bomb_launch.currentTime = 0;
      projectiles.push(new Bomb(this.pos.x,this.pos.y-10,0,-5,"player",6,this.damage+10,this.blastRadius));
    }else if(this.weapon === "missile"){
      missile_launch.play();
      missile_launch.currentTime = 0;
      projectiles.push(new Missile(this.pos.x,this.pos.y-10,0,-5,"player",10,this.damage+15));
    }else if(this.weapon === "destroyer"){
      bullet_big.play();
      bullet_big.currentTime = 0;
      for (let i = -35; i < 36; i++) {
        projectiles.push(new Bullet(this.pos.x,this.pos.y,i/8,-sqrt(sq(71)-sq(i))/22,"player",10,this.damage+25));
      }
    }
  }
}

class Enemy{
  constructor(x,y,hitR,type){
    this.pos = createVector(x,y);
    this.hitRadius = hitR;
    this.type = type;
  }
  hit(type,dmg){
    this.health-=dmg;
    if(this.type === "minion"){
        minion_hit.play();
        minion_hit.currentTime = 0;
    }else if(this.type === "tank"){
      tank_hit.play();
      tank_hit.currentTime = 0;
    }else if(this.type === "bomber"){
      bomber_hit.play();
      bomber_hit.currentTime = 0;
    }else if(this.type === "seeker"){
      tank_hit.play();
      tank_hit.currentTime = 0;
    }else if(this.type === "boss"){
      boss_hit.play();
      boss_hit.currentTime = 0;
    }
  }
}

class Minion extends Enemy{
  constructor(x,y,reload){
    super(x,y,3,"minion");
    this.health = 10;
    this.reloadSpeed = reload;
  }
  update(){
    this.shoot();
  }
  display(){
    noStroke();
    fill(255);
    rect(this.pos.x-3,this.pos.y-3,6,6);
    fill(255,0,0);
    rect(this.pos.x-3,this.pos.y-6,this.health/(10/6),2);
  }
  shoot(){
    if(frameCount%this.reloadSpeed===0){
      bullet_small2.play();
      bullet_small2.currentTime = 0;
      projectiles.push(new Bullet(this.pos.x,this.pos.y,0,4,"enemy",2,5));
    }
  }
}

class Tank extends Enemy{
  constructor(x,y,reload){
    super(x,y,8,"tank");
    this.health = 50;
    this.reloadSpeed = reload;
  }
  update(){
    this.shoot();
  }
  display(){
    noStroke();
    fill(255);
    rect(this.pos.x-8,this.pos.y-8,16,16);
    fill(255,0,0);
    rect(this.pos.x-8,this.pos.y-12,this.health/(50/16),2);
  }
  shoot(){
    if(frameCount%this.reloadSpeed===0){
      bullet_big.play();
      bullet_big.currentTime = 0;
      projectiles.push(new Bullet(this.pos.x,this.pos.y,0,6,"enemy",6,20));
    }
  }
}

class Bomber extends Enemy{
  constructor(x,y,reload){
    super(x,y,6,"bomber");
    this.health = 20;
    this.reloadSpeed = reload;
  }
  update(){
    this.shoot();
  }
  display(){
    noStroke();
    fill(255);
    rect(this.pos.x-6,this.pos.y-6,12,12);
    fill(255,0,0);
    rect(this.pos.x-6,this.pos.y-9,this.health/(20/12),2);
  }
  shoot(){
    if(frameCount%this.reloadSpeed===0){
      bomb_launch.play();
      bomb_launch.currentTime = 0;
      projectiles.push(new Bomb(this.pos.x,this.pos.y,0,4,"enemy",5,10,30));
    }
  }
}

class Seeker extends Enemy{
  constructor(x,y,reload){
    super(x,y,10,"seeker");
    this.health = 50;
    this.reloadSpeed = reload;
  }
  update(){
    this.shoot();
  }
  display(){
    noStroke();
    fill(255);
    rect(this.pos.x-10,this.pos.y-10,20,20);
    push();
      translate(this.pos.x,this.pos.y+3);
      rotate(atan(-(this.pos.x-player.pos.x)/(this.pos.y-player.pos.y)));
      rect(-5,0,10,20)
    pop();
    fill(255,0,0);
    rect(this.pos.x-10,this.pos.y-15,this.health/(50/20),2);
  }
  shoot(){
    if(frameCount%this.reloadSpeed===0){
      bullet_big.play();
      bullet_big.currentTime = 0;
      let div = sqrt(sq(player.pos.x-this.pos.x)+sq(player.pos.y-this.pos.y))/15;
      projectiles.push(new Bullet(this.pos.x,this.pos.y,(player.pos.x-this.pos.x)/div,(player.pos.y-this.pos.y)/div,"enemy",6,10));
    }
  }
}

class Boss extends Enemy{
  constructor(x,y){
    super(x,y,20,"boss");
    this.health = 500;
  }
  update(){
    this.shoot();
  }
  display(){
    noStroke();
    fill(255);
    rect(this.pos.x-20,this.pos.y-20,40,40);
    fill(255,0,0);
    rect(this.pos.x-20,this.pos.y-25,this.health/(500/40),4);
  }
  shoot(){
    if(frameCount%40===0){
      bullet_big.play();
      bullet_big.currentTime = 0;
      projectiles.push(new Bullet(this.pos.x,this.pos.y,0,3,"enemy",10,30));
    }else if(frameCount%100===0){
      bomb_launch.play();
      bomb.currentTime = 0;
      projectiles.push(new Bomb(this.pos.x-20,this.pos.y+20,-1,sqrt(24),"enemy",5,15,30));
      projectiles.push(new Bomb(this.pos.x-20,this.pos.y+20,0,5,"enemy",5,15,30));
      projectiles.push(new Bomb(this.pos.x+20,this.pos.y+20,0,5,"enemy",5,15,30));
      projectiles.push(new Bomb(this.pos.x+20,this.pos.y+20,1,sqrt(24),"enemy",5,15,30));
    }else if(frameCount%140===0){
      bullet_small.play();
      bullet_small.currentTime = 0;
      for(let i = -9; i<10; i++){
          projectiles.push(new Bullet(this.pos.x,this.pos.y+20,i/5,sqrt(sq(19)-sq(i))/5,"enemy",2,5));
      }
    }else if(frameCount%230===0){
      missile_launch.play();
      missile_launch.currentTime = 0;
      projectiles.push(new Missile(this.pos.x-20,this.pos.y+20,-4,4,"enemy",4,10));
      projectiles.push(new Missile(this.pos.x+20,this.pos.y+20,4,4,"enemy",4,10));
    }else if(frameCount%310===0){

    }
  }
}
