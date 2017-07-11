/* Processing.JS sketch */
//game screen switch
var menu = true;
var wheel = false;
var instructions = false;
var playGame = false;
var stats = false;
//sound
var jumpSound = new buzz.sound("res/sound/jumpSound", {formats: ["ogg", "mp3"]});
var timeOverSound = new buzz.sound("res/sound/gameOverSound", {formats: ["ogg", "mp3"]});
void play(soundToPlay) {
                soundToPlay.play();
            }      
        
var buildings = [];
var cloudArray = [];
var coins = [];
var spikes = [];
var score = 0;
var cloudX = 0;
var doubleCloud = -150;
var moonX = 300;
var speed = 0;
var gravity = 6;
var moving = false;
var jumping = false;
var stop = false;
//coin animation stuff
var coinSize = 89;
var coinX = 1000;
var coinY = 170;
var start = coinSize*1.09;
var progress = start;
//bar animation
var whole = score;
var povertyLine;
var percent = 0.77;
var xPos;
var yPos;
var length;
var barCoins = [];
var finalScore = score * 0.77;
//timer
var timerColor = color(0, 255, 30);
var timerX = 890;
var timerY = 170;
var timerSize = 95;
//total coin goal
var goal = 50;
var win = false;
var grounded = true;
var CoinFall = function(coinX,coinY,coinSize,gravity,speed){
    this.coinX = coinX;
    this.coinY = coinY;
    this.coinSize = coinSize;
    this.speed = speed;
    this.gravity = gravity;
    this.draw = function() {
        fill(173, 156, 31);
        ellipse(this.coinX+this.coinSize/10,this.coinY+this.coinSize*0.06,this.coinSize,this.coinSize);
        fill(254,233,45);
        ellipse(this.coinX,this.coinY,this.coinSize,this.coinSize);
        fill(207, 184, 37);
        ellipse(this.coinX,this.coinY,this.coinSize*0.8,this.coinSize*0.8);
        fill(173, 156, 31);
        rect(this.coinX+this.coinSize*0.06,this.coinY+this.coinSize*0.32,this.coinSize*-0.2,this.coinSize*-0.6);
        fill(254,233,45);
        rect(this.coinX+this.coinSize*0.08,this.coinY+this.coinSize*0.32,this.coinSize*-0.1,this.coinSize*-0.6);
    };
    this.fall = function(){
        this.coinY += this.gravity;
        this.coinX += this.speed;
    };
};
var animate = function(){
    if(score > finalScore){
      score -= 0.25;
      barCoins.push(new CoinFall(xPos +(length*(score/whole))+random(-20,-10),yPos+25,30,random(3,4),random(-0.5,0.5)));
      barCoins.push(new CoinFall(xPos +(length*(score/whole))+random(-20,-10),yPos+25,30,random(3,4),random(-0.5,0.5)));
    }
    for(var i = 0; i < barCoins.length; i++){
            barCoins[i].draw();
            barCoins[i].fall();
    }
};
var count = 60, timer = setInterval(function() {
    $("#counter").html(count--);
    if(count == 0) clearInterval(timer);
}, 1000);

var Spikes = function(triangleYThree, triangleMove){
    this.triangleYThree = triangleYThree;
    this.triangleMove = triangleMove;
    
    this.draw = function() {
        noStroke();
        fill(150, 150, 150);
        triangle(this.triangleMove, this.triangleYThree, this.triangleMove+4, this.triangleYThree - 44, this.triangleMove+8, this.triangleYThree);
        triangle(this.triangleMove+8, this.triangleYThree, this.triangleMove+8+4, this.triangleYThree - 44, this.triangleMove+8+8, this.triangleYThree);
        triangle(this.triangleMove+8+8, this.triangleYThree, this.triangleMove+8+8+4, this.triangleYThree - 44, this.triangleMove+8+8+8, this.triangleYThree);
        triangle(this.triangleMove+8+8+8, this.triangleYThree, this.triangleMove+8+8+8+4, this.triangleYThree - 44, this.triangleMove+8+8+8+8, this.triangleYThree);
        triangle(this.triangleMove+8+8+8+8, this.triangleYThree, this.triangleMove+8+8+8+8+4, this.triangleYThree - 44, this.triangleMove+8+8+8+8+8, this.triangleYThree);
        triangle(this.triangleMove+8+8+8+8+8, this.triangleYThree, this.triangleMove+8+8+8+8+8+4, this.triangleYThree - 44, this.triangleMove+8+8+8+8+8+8, this.triangleYThree);
    };
    this.move = function(){
      this.triangleMove -= speed;
    };
};
var shadow = function(){
    fill(254,233,45,80);
    ellipse(coinX,coinY,coinSize,coinSize);
    fill(207, 184, 37,80);
    ellipse(coinX,coinY,coinSize*0.8,coinSize*0.8);
};
var coinFill = function(){
    fill(173, 156, 31);
    ellipse(coinX+coinSize/10,coinY+coinSize*0.06,coinSize,coinSize);
    fill(254,233,45);
    ellipse(coinX,coinY,coinSize,coinSize);
    fill(207, 184, 37);
    ellipse(coinX,coinY,coinSize*0.8,coinSize*0.8);
    fill(173, 156, 31);
    rect(coinX+coinSize*0.06,coinY+coinSize*0.32,coinSize*-0.2,coinSize*-0.6);
    fill(254,233,45);
    rect(coinX+coinSize*0.08,coinY+coinSize*0.32,coinSize*-0.1,coinSize*-0.6);
};
//end coin animation stuff
var jump = function(){
    if (gravity < 12) {
      gravity += 0.7;
   }
   else{
      jumping = false;
   }
};
var Player = function(x,y){
   this.x = x;
   this.y = y;
   this.draw = function(){
      fill(255,2,0);
      ellipse(this.x,this.y,50,100);
   };
   this.move = function(){
      this.y += gravity;
   };
};
var currentPlayer = new Player(110,100);
var Coin = function(coinX,coinY,coinSize) {
   this.coinX = coinX;
   this.coinY = coinY;
   this.coinSize = coinSize;
   this.draw = function() {
      noStroke();
      fill(173, 156, 31);
      ellipse(this.coinX,this.coinY,sin(frameCount * 3) * this.coinSize*1.2,this.coinSize*1.2);
      fill(254,233,45);
      ellipse(this.coinX,this.coinY,sin(frameCount * 3) * this.coinSize,this.coinSize);
      fill(207, 184, 37);
      ellipse(this.coinX,this.coinY,sin(frameCount * 3) * this.coinSize*0.8,this.coinSize*0.8);
      fill(173, 156, 31);
      rect(this.coinX+this.coinSize*0.06,this.coinY+this.coinSize*0.32,sin(frameCount * 3) * this.coinSize*-0.2,this.coinSize*-0.6);
      fill(254,233,45);
      rect(this.coinX+this.coinSize*0.04,this.coinY+this.coinSize*0.32,sin(frameCount * 3) * this.coinSize*-0.1,this.coinSize*-0.6);
   this.move = function(){
      this.coinX -= speed;
   }
   };
};
var Cloud = function(xPos,speed){
   this.xPos = xPos;
   this.speed = speed;
   this.draw = function(){
      fill(255, 255, 255,99);
      ellipse(this.xPos +93,50,50,50);
      ellipse(this.xPos +259,84,50,50);
      ellipse(this.xPos +231,88,40,40);
      ellipse(this.xPos +211,93,29,29);
      ellipse(this.xPos +286,89,40,40);
      ellipse(this.xPos +307,93,29,29);
      ellipse(this.xPos +69,55,40,40);
      ellipse(this.xPos +119,55,40,40);
      ellipse(this.xPos +46,59,29,29);
      ellipse(this.xPos +143,59,29,29);
   };
   this.move = function(){
      this.xPos += this.speed;
    
      if (this.xPos > width+50) {
        this.xPos = -190;
      }
   };
};
var Building = function(tall,xPos){
    this.tall = tall;
    this.xPos = xPos;
    this.drawBuild = function() {
        fill(0, 0, 0);
        rect(this.xPos,this.tall,100,height-this.tall);
        for(var i = 0; i < 32; i++){
            for(var j = 0; j < 4; j++){
                fill(143, 141, 120);
                rect(this.xPos +7+ (j*25),this.tall+10+(i*24), 8,13);
            }
        }
    };
    this.move = function() {
      this.xPos -= speed;
    };
};
var buildings = [];
var menuScreen = function(){
   background(255,5,255);
   text("Menu: Press space to play",100,100);
};

var randomWheel = function(){
   background(255,100,230);
   text("Random wheel!",100,100);
};

var instructionScreen = function(){
   background(100,255,255);
   text("Collect coins!",100,100);
};

var statScreen = function(){
   povertyLine = 300;
   percent = 0.77;
   xPos = 60;
   yPos = 100;
   length = 250;
   coins = [];
   
    background(123, 224, 163);
    noStroke();
    //avatar
    fill(77, 77, 77,90);
    rect(5,yPos+3,45,45,11);
    fill(64, 64, 64);
    ellipse(27,yPos+20,20,27);
    arc(27,yPos+47,35,28,180,360);
    
    fill(128, 122, 0,80);
    rect(xPos,yPos,250,50,16);
    if(stats){
        animate();
    }
    fill(255, 234, 0);
    rect(xPos,yPos,length*(score/whole),50,16);
    fill(255, 255, 255,140);
    rect(xPos+5,yPos+5,length*(score/whole)-10,13,16);
    fill(115, 75, 0);
    textSize(20);
    text(score *200 + " dollars",xPos+30,yPos+35);
    text(round((score/whole)*100) + " %",xPos + 273, yPos+30);
    text("'__' women earn " +percent*100+  " cents to a mans dollar",4,30);
};

var play = function(){
   background(6, 66, 63);
   //score animation stuff
   progress = start*((goal-score)/goal);
    fill(255, 255, 255);
    noStroke();
    if(win === true){
        strokeWeight(3);
        for(var i = 0; i < 360; i+=0.5){
            var noiseShine = noise(i*0.05);
            stroke(255,255,255,noiseShine*35-15);
            line(coinX,coinY,cos(i)*600,sin(i)*600);
        }
    }
    coinFill();
    fill(6, 66, 63);
    rect(coinX-coinSize,coinY-coinSize/1.9,coinSize*2,progress);
    shadow();
    if(win === false){
        fill(0,0,0);
        textSize(coinSize/2.8);
        text(round((score/goal)*100) + "%",coinX-coinSize/3.7,coinY+coinSize/7.7);
    }  
    fill(210, 217, 0);
    text("$" +score * 200,coinX-40,244);
   
    noStroke();
        //moon
    fill(255, 250, 148);
    ellipse(moonX,100,75,75);
    fill(6, 66, 63);
    ellipse(moonX + 20,100,75,75);
   if (jumping == true) {
      jump();
   }
    for(var i = 0; i < buildings.length; i++){
        if(buildings[i].xPos < -99 && moving == true){
            buildings.push(new Building(random(350,500),width));
            buildings.splice(i,1);
            var newCoin = round(random(0,10));
            if (newCoin == 2 || newCoin == 4 || newCoin == 6 || newCoin == 8 || newCoin == 10) {
               coins.push(new Coin(width+50,buildings[buildings.length-1].tall-30,30));
            }
            if (newCoin == 9) {
               spikes.push(new Spikes(buildings[buildings.length-1].tall,width+25));
            }
        }
        buildings[i].drawBuild();
        buildings[i].move();
    }
    for(var k = 0; k < cloudArray.length; k++){
      cloudArray[k].draw();
      cloudArray[k].move();
    }
    
    for(var y = 0; y < coins.length; y++){
      coins[y].draw();
      coins[y].move();
      if (currentPlayer.x < coins[y].coinX + 25 && currentPlayer.x > coins[y].coinX - 25 && currentPlayer.y > coins[y].coinY -50){
         coins.splice(y,1);
         score += 1;
         $("#score").html("score: "+ score);
      }
    }
    for(var y = 0; y < spikes.length; y++) {
      spikes[y].draw();
      spikes[y].move();
      if (currentPlayer.x > spikes[y].triangleMove && currentPlayer.x < spikes[y].triangleMove + 70 && currentPlayer.y > spikes[y].triangleYThree -70) {
         if (score > 0) {
               score -= 1;
         }
      barCoins.push(new CoinFall(currentPlayer.x,currentPlayer.y,25,5,-3));
      spikes.splice(y,1);
      }
    }
    for (var i = 0; i < barCoins.length; i++) {
      barCoins[i].draw();
      barCoins[i].fall();
      console.log(barCoins[i]);
      if (barCoins[i].coinY > 1000) {
         barCoins.splice(i,1);
      }
    }
    currentPlayer.draw();
    currentPlayer.move();
    
    for (var t = 0; t < buildings.length; t++) {
      if (currentPlayer.x > buildings[t].xPos && currentPlayer.x < buildings[t].xPos + 100) {
         if (currentPlayer.y > buildings[t+1].tall-42 && currentPlayer.x > buildings[t+1].xPos - 25) {
            stop = true;
            speed = 0;
         }
         if (currentPlayer.y < buildings[t+1].tall-30 && currentPlayer.x > buildings[t+1].xPos - 25) {
            stop = false;
         }
         if (currentPlayer.y > buildings[t].tall - 55) {
            currentPlayer.y = buildings[t].tall - 56;
            grounded = true;
         }
      }
    }
    if (moving == true && stop == false) {
      speed = 11;
    }
    //timer
    fill(0, 0, 0);
    ellipse(timerX,timerY,timerSize,timerSize);
    noStroke();
    fill(timerColor);
    arc(timerX,timerY,timerSize,timerSize,-0.5*PI + ((60 - count)/60)*2*PI,1.5*PI);
    fill(255, 255, 255);
    textSize(35);
    text(count,timerX-20,timerY+10);
    if(count > 30){
        timerColor = color(0, 255, 0);
    }
    else if(count > 15){
        timerColor = color(255, 221, 0);
    }
    else {
        timerColor = color(255, 0, 0);
    }
    if (count == 0) {
      playGame = false;
      finalScore = score * percent;
      whole = score;
      stats = true;
    }
};
void setup()
{
   size(1200,700);
   textFont(loadFont("courier"), 14);
   for(var i = 0; i < 13; i++){
            buildings.push(new Building(random(350,500),i*100));
            coins.push(new Coin(buildings[i].xPos+50,buildings[i].tall-30,30))
   }
   for(var j = 0; j<5; j++){
      cloudArray.push(new Cloud(random(-100,width),random(0.1,1)));
   }
};
void draw()
{
   if (menu == true) {
      menuScreen();
   }
   if (wheel == true) {
      console.log("RandomWheelfunction");
      randomWheel();
   }
   if (instructions == true) {
      instructionScreen();
   }
   if (playGame == true) {
      play();
   }
   if (stats == true) {
      statScreen();
   }
};
$("body").keydown(function(c){
   c.preventDefault();
   if (c.keyCode == 39) {
      moving = true;
   }
   if (c.keyCode == 32) {
       if (instructions == true) {
         instructions = false;
         playGame = true;
         count = 60;
      }
      if (wheel == true) {
         wheel = false;
         instructions = true;
      }
      if (menu == true) {
         menu = false;
         wheel = true;
         console.log("spacebar clicked");
      }
      if (playGame == true) {
         if (jumping == false) {
            jumping = true;
            if (grounded == true) {
               gravity = -14;
            }
            grounded = false;
         }
      }
   }
   if (c.keyCode == 40) {
      gravity = 12;
   }
});
$("body").keyup(function(c){
   if (c.keyCode == 39) {
      moving = false;
      speed = 0;
   }
});