/**************************************
 * Shadows of Seven
 * Created on Saturday, September 12th, 2015
 * Made by Indie and his awesome partners
 * 
 * Thanks to KCF for the boilerplate, KCF.JS for some visual effects, and a lot of the game mechanics and physics engine. Check out his programs here: https://www.khanacademy.org/profile/kingcodefish/
 * Thanks to Emory for the original Disaster Studios idea. Check out his programs here: https://www.khanacademy.org/profile/DisasterStudios2/ 
 * 
 * Want to join ____________? Simply go here: https://www.khanacademy.org/computer-programming/indies-collaboration-team/6679584874561536
 * 
 */

/* --- GLOBAL VARIABLES --- */
var gameStateNumber = 0;
var keys = [];
var mouseOverButton = "";
var txtColor1 = 0;
var txtColorFin = 255;
var time = 0;
var waitDelay = 255;
var textScroller = "";
var textFill = "";
var textEff = 0;
var canMoveLeft = true;
var canMoveRight = true;
var canJump = true;
var canFall = true;

/* --- KCF.JS --- Minified Version --- */
var poly=function(array){beginShape();for(var i=0;i<array.length;i++){vertex(array[i][0],array[i][1]);}
endShape();};var rectGradient=function(x,y,width,height,from,to){for(var i=0;i<width;i++){stroke(lerpColor(from,to,i / width));line(x+i,y,x+i,y+height);}};var ellipseGradient=function(x,y,width,height,from,to,type,endGrad){if(type==="falloff"){ellipseMode(CENTER);noStroke();var gradientBars=endGrad-width;for(var i=0;i<gradientBars;i++){var sectionWidth=(gradientBars-i)+width;fill(lerpColor(from,to,i / gradientBars));ellipse(x,y,sectionWidth+width,sectionWidth+height);}}else if(type==="linear"){for(var i=0;i<1;i+=0.001){var sx=lerp(x,x+width*2,i);var c=lerpColor(from,to,i);stroke(c);line(sx,y+height*sqrt(1-sq(2*i-1)),sx,y-height*sqrt(1-sq(2*i-1)));}}};var font=function(font,size,api,fill,align){if(api===undefined){textFont(createFont(font),size);}};

/* --- BUTTON FUNCTION --- */
var button = function(x, y, wid, hei, radius, tex, textSi, textFill, hoverTextFill, fi, hoverFi, stro, stroWei, hoverStro, hoverStroWei) {
    if(abs(x - mouseX) <= wid / 2 && abs(y - mouseY) <= hei / 2) {
        if(mouseIsPressed) {
            mouseOverButton = tex;
        }
        fill(hoverFi);
        stroke(hoverStro);
        strokeWeight(hoverStroWei);
    } else {
        fill(fi);
        stroke(stro);
        strokeWeight(stroWei);
    }
    rectMode(CENTER);
    rect(x, y, wid, hei, radius);
    if(abs(x - mouseX) <= wid / 2 && abs(y - mouseY) <= hei / 2) {
        fill(hoverTextFill);
    } else {
        fill(textFill);
    }
    textAlign(CENTER, CENTER);
    textSize(textSi);
    text(tex, x, y);
};

/* --- HOME SCREEN BACKDROP --- */
var homeScreenDrop = function(homeScrBackground) {
    background(255, 183, 0);

    var startColor = color(153, 23, 0);
    var endColor = color(204, 163, 0);
    var lineWidth = 4;
    strokeWeight(lineWidth);
    for (var i = 0; i <= height; i += lineWidth) {
        stroke(lerpColor(startColor, endColor, i / height));
        line(0, i, height, i);
    }

    noStroke();

    pushMatrix();
    translate(25, 47);
    fill(240, 240, 19);
    rect(20, 20, 87, 87);
    fill(239, 250, 85);
    rect(27, 27, 75, 75);
    fill(252, 252, 156);
    rect(39, 38, 50, 50);
    popMatrix();


    pushMatrix();
    translate(1, 142);
    noStroke();
    fill(89, 89, 89);
    rect(-3, 202, 402, 61);
    fill(89, 89, 89);
    rect(-2, 204, 53, -60);
    rect(55, 202, 42, -126);
    rect(102, 226, 42, -126);
    rect(140, 265, 64, -72);
    rect(154, 223, 50, -189);
    rect(55, 190, 42, -126);
    rect(81, 230, 42, -48);
    rect(207, 213, 54, -165);
    rect(268, 206, 42, -126);
    rect(300, 221, 50, -96);
    rect(255, 262, 42, -79);
    rect(365, 228, 42, -126);
    popMatrix();

};

/* --- OBSTACLES --- */
var blocks = [];
var Block = function(x, y) {
    this.x = x; 
    this.y = y;
};
Block.prototype.draw = function() {
    rectMode(CENTER);
    noStroke();
    fill(0, 0, 0);
    rect(this.x, this.y, 30, 30);
};
var addBlock = function(x, y) {
    blocks.push(new Block(x, y));
};
var drawBlocks = function() {
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].draw();
    }
};

/* --- NINJAS --- */
var ninjaPos = {
    x: 200, 
    y: 200
};
var Ninja = function(ninjaType, x, y, size, rot, speedMarks) {
    this.ninjaType = ninjaType;
    this.x = x;
    this.y = y;
    this.xv = 0;
    this.yv = 0;
    this.moveSpeed = 5;
    this.size = size;
    this.rot = rot;
    this.speedMarks = speedMarks;
};
Ninja.prototype.update = function() {
    if(canFall) {
        this.yv+=this.moveSpeed;
    }
    if(canMoveLeft && keys[LEFT] === true) {
        this.xv-=this.moveSpeed;
    }
    if(canMoveRight && keys[RIGHT] === true) {
        this.xv+=this.moveSpeed;
    }
    ninjaPos.x += this.xv;
    ninjaPos.y += this.yv;
    this.collideWith();
};
Ninja.prototype.display = function() {
    switch(this.ninjaType) {
        case 1:
            rectMode(CENTER);
            noStroke();
            pushMatrix();
                translate(this.x, this.y);
                scale(this.size / 100);
                rotate(this.rot);
                fill(0, 0, 0);
                rect(0, 0, 60, 60, 10);
                fill(255, 255, 255);
                ellipse(-12, -2, 10, 10);
                ellipse(12, -2, 10, 10);
                fill(255, 0, 0);
                rect(0, -20, 60, 10);
                fill(255, 0, 0);
                triangle(-45, -38, -30, -20, -35, 5);
            popMatrix();
            if(this.speedMarks) {
                pushMatrix();
                    translate(this.x, this.y);
                    scale(this.size / 100);
                    rotate(this.rot);
                    fill(255, 255, 255);
                    rect(-80, -20, 60, 3);
                    rect(-88, 0, 45, 3);
                    rect(-80, 20, 60, 3);
                popMatrix();
            }
            break;
    }
};
Ninja.prototype.collideWith = function() {
    for(var i = 0; i < blocks.length; i++) {
        var o = blocks[i];
        if(ninjaPos.x - o.x <= 30 && ninjaPos.x - o.x >= 0 && abs(ninjaPos.y - o.y) <= 29) {
            canMoveLeft = false;
        } else {
            canMoveLeft = true;
        }
        if(o.x - ninjaPos.x <= 15 && o.x - ninjaPos.x >= 0 && abs(ninjaPos.y - o.y) <= 29) {
            canMoveRight = false;
        } else {
            canMoveRight = true;
        }
        if(o.y - ninjaPos.y <= 30 && o.y - ninjaPos.y >= 0 && abs(ninjaPos.x - o.x) <= 30) {
            canFall = false;
        } else {
            canFall = true;
        }
        if( this.y + 15 > o.y && this.y < o.y + 15 && this.x + 15 > o.x && this.x < o.x + 15) {
            // BOTTOM
            if(this.yv > 0) {
                this.yv = 0;
                canFall = false;
                this.y = o.y-15;
            }
            // TOP
            if(this.yv < 0) {
                this.yv = 0;
                canFall = true;
                this.y = o.y + 15;
            }
            // RIGHT
            if(this.xv > 0) {
                this.xv = 0;
                this.x = o.x - 15;
            }
            // LEFT
            if(this.xv < 0) {
                this.xv = 0;
                this.x = o.x + 15;
            }
        }
    }
};
var menuNinja = new Ninja(1, 135, 265, 100, 11, true);

/* --- SLIDES --- */
var menu = function() {
    textFont(createFont("Tahoma Bold"));
    rectMode(CORNER);
    background(0, 200, 200);
    noStroke();
    homeScreenDrop();
    fill(255, 255, 255);
    pushMatrix();
        translate(50, 120);
        rotate(-30);
        textSize(20 + sin(frameCount* 15) * 1.5);
        fill(255, 140, 140);
        text("WITH\nLOGO!!", 0, 0);
    popMatrix();
    fill(255, 0, 0, 125);
    rect(95, 26, 298, 124);
    textSize(45);
    fill(0, 0, 0);
    text("Shadows Of\nSeven", 242, 88);
    fill(255, 255, 255);
    text("Shadows Of\nSeven", 245, 86);
    fill(255, 255, 255);
    stroke(0, 0, 0);
    rect(6, 164, 390, 30);
    textSize(20);
    fill(0, 0, 0);
    text("A GAME by Indie Productions", 201, 178);
    button(320, 250, 130, 33, 10, "Play", 24, color(0, 0, 0), color(82, 82, 82), color(255, 255, 255), color(200, 200, 200, 100), color(0, 0, 0, 100), 2, color(0, 0, 0, 100), 2);
    button(320, 290, 130, 33, 10, "Options", 24, color(0, 0, 0), color(82, 82, 82), color(255, 255, 255), color(200, 200, 200, 100), color(0, 0, 0, 100), 2, color(0, 0, 0, 100), 2);
    button(320, 330, 130, 33, 10, "Credits", 24, color(0, 0, 0), color(82, 82, 82), color(255, 255, 255), color(200, 200, 200, 100), color(0, 0, 0, 100), 2, color(0, 0, 0, 100), 2);
    menuNinja.display();
    rectMode(CORNER);
    fill(0, 0, 0, 100);
    pushMatrix();
        translate(1, 267);
        triangle(0, 14, -2, 1038, 412, 103);
    popMatrix();
    pushMatrix();
        translate(-52, -54);
        triangle(52, 142, 457, 55, 50, 50);
    popMatrix();
}; // Draw the main menu screen in here, this is an example menu
var help = function() {
    rectMode(CORNER);
    homeScreenDrop();
    
    fill(0, 0, 0, 70);
    rect(0, 0, 400, 400);
    
    textSize(100);
    fill(0);
    text("Help", 194, 55);
    fill(255);
    text("Help", 201, 50);
    
    textSize(30);
    text("Write Text Here", 201, 201);
    
    button(70, 370, 130, 33, 10, "Back", 24, color(0, 0, 0), color(82, 82, 82), color(255, 255, 255), color(200, 200, 200, 100), color(0, 0, 0, 100), 2, color(0, 0, 0, 100), 2);
};
var credits = function() {
    rectMode(CORNER);
    homeScreenDrop();
    
    fill(0, 0, 0, 70);
    rect(0, 0, 400, 400);
    
    textSize(100);
    fill(0);
    text("Credits", 195, 54);
    fill(255);
    text("Credits", 201, 50);
    
    textSize(20);
    text("Thanks to my collab team for helping\nme design the game. Here is a list\nof the people who did:\nSatisifed Soul, KCF, codeWizard, Elijah,\nEmory, KingKhan007, Ignatio,\nJavaLava, Julian, Muhib Hussain,\nRobot, and Fazbear! \n\nEveryone else is listed on the collab\nsite.", 201, 220);
    
    button(70, 370, 130, 33, 10, "Back", 24, color(0, 0, 0), color(82, 82, 82), color(255, 255, 255), color(200, 200, 200, 100), color(0, 0, 0, 100), 2, color(0, 0, 0, 100), 2);
};
var intro = function() {
    var xx = -40,
        yy = 318;
    txtColor1++;
    time++;
    background(0, 0, 0);
    fill(txtColor1);
    textSize(30);
    text("You wake up to find \nyourself in a cell...", 201, 48);
    if(time > 250){
        fill(255, 255, 255);
        text("\"Where am I?\"", 201, 205);
    }
    if(time > 400){
        background(168, 168, 168);
        for (var j = 0; j < 14; j++) {
            for (var i = 0; i < 12; i++) {
                fill(158, 158, 158);
                rect(i*36, j*30, 33, 26);
            }
        }
        fill(0, 0, 0);
        noStroke();
        pushMatrix();
            rotate(0);
            scale(0.7, 0.7);
            translate(204, 267);
            rect(158, 202, 60, 60, 10);
            fill(255, 255, 255);
            ellipse(174, 230, 10, 10);
            ellipse(199, 230, 10, 10);
            fill(255, 0, 0);
            rect(158, 208, 60, 10);
            fill(255, 0, 0);
            translate(56, 142);
            triangle(97, 98, 102, 73, 88, 56);
        popMatrix();
            fill(0, 0, 0);
            rect(228, 280, 12, 106);
            rect(280, 280, 12, 106);
            rect(332, 280, 12, 106);
            rect(387, 280, 12, 106);
            fill(97, 97, 97);
            rect(0, 371, 400, 30);
            rect(228, 264, 175, 20);
        pushMatrix();
            translate(0, -118);
            fill(255, 255, 255);
            rect(260, 342, 40, 40, 10);
            fill(0, 0, 0);
            ellipse(280, 358, 20, 20);
            fill(0, 0, 0);
            rect(228, 280, 12, 106);
            rect(280, 280, 12, 106);
            rect(332, 280, 12, 106);
            rect(387, 280, 12, 106);
            fill(97, 97, 97);
            rect(228, 264, 175, 20);
        popMatrix();
    }
    if(time > 500){
        fill(255, 255, 255);
        textSize(20);
        text("Hey, new blood. Let's get out of here.\nThe city is under attack and no guards\nare here. Come on!", 201, 84);
        pushMatrix();
        rotate(-36);
        rect(30, 186, 5, 131);
        popMatrix();
    }   
    if(time > 700){
        xx+=200;
        fill(0, 0, 0);
        rect(xx, yy, 40, 40, 10);
        fill(255, 0, 0);
        rect(xx, yy+22, 11, 18);
        rect(xx+29, yy+22, 11, 18);
        fill(255, 255, 255);
        ellipse(xx+10, yy+10, 10, 10);
        ellipse(xx+29, yy+10, 10, 10);
        fill(255, 255, 255);
        text("Hey, you two, stay \nhere, I'm going to \nthe bathroom.", xx+-57, 274);
    }
    if(time > 900){
        rectMode(CORNER);
        background(168, 168, 168);
        for (var j = 0; j < 14; j++) {
            for (var i = 0; i < 12; i++) {
                fill(158, 158, 158);
                rect(i*36, j*30, 33, 26);
            }
        }
        fill(0, 0, 0);
        noStroke();
        pushMatrix();
            rotate(0);
            scale(0.7, 0.7);
            translate(204, 267);
            rect(158, 202, 60, 60, 10);
            fill(255, 255, 255);
            ellipse(174, 230, 10, 10);
            ellipse(199, 230, 10, 10);
            fill(255, 0, 0);
            rect(158, 208, 60, 10);
            fill(255, 0, 0);
            translate(56, 142);
            triangle(97, 98, 102, 73, 88, 56);
        popMatrix();
            fill(0, 0, 0);
            rect(228, 280, 12, 106);
            rect(280, 280, 12, 106);
            rect(332, 280, 12, 106);
            rect(387, 280, 12, 106);
            fill(97, 97, 97);
            rect(0, 371, 400, 30);
            rect(228, 264, 175, 20);
        pushMatrix();
            translate(0, -118);
            fill(255, 255, 255);
            rect(260, 342, 40, 40, 10);
            fill(0, 0, 0);
            ellipse(280, 358, 20, 20);
            fill(0, 0, 0);
            rect(228, 280, 12, 106);
            rect(280, 280, 12, 106);
            rect(332, 280, 12, 106);
            rect(387, 280, 12, 106);
            fill(97, 97, 97);
            rect(228, 264, 175, 20);
        popMatrix();
    }
    if(time > 1000){
        fill(255, 255, 255);
        textSize(20);
        text("Told ya. Now lemme just open this\nlock. ", 201, 84);
        pushMatrix();
        rotate(-36);
        rect(30, 186, 5, 131);
        popMatrix();
    }   
    if(time > 1100){
        text("There we go!", 105, 228);
        
        fill(0, 0, 0, time - 1200);
        rect(0, 0, 400, 400);
    }
    if(time > 1455) {
        gameStateNumber = 4;
        time = 0;
    }
};
var level01 = function() {
    time++;
    rectMode(CENTER);
    background(82, 82, 82);
    noStroke();
    
    var ninja1 = new Ninja(1, ninjaPos.x, ninjaPos.y, 50, 0);
    ninja1.update();
    ninja1.display();
    
    // Blocks
    addBlock(200, 250);
    addBlock(230, 250);
    addBlock(170, 250);
    drawBlocks();
    
    textFill = "Physics Engine Test";
    if(textScroller.length !== textFill.length && frameCount % 3 === 0 && time ) {
        textScroller += textFill[textEff];
    }
    fill(255, 255, 255);
    textSize(30);
    text(textScroller, 200, 100);
    
    rectMode(CORNER);
    fill(0, 0, 0, -time + 255);
    rect(0, 0, 400, 400);
    
    if(textEff !== textFill.length && frameCount % 3 === 0) {
        textEff++;
    }
}; // Draw the first level in here

/* --- INPUT --- */
keyPressed = function() {
    keys[keyCode] = true;
    keys[key.toString().toUpperCase()] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
    keys[key.toString().toUpperCase()] = false;
};
mouseReleased = function() {
    switch(mouseOverButton) {
        case "Play":
            gameStateNumber = 3;
            break;
        case "Options":
            gameStateNumber = 1;
            break;
        case "Credits":
            gameStateNumber = 2;
            break;
        case "Back":
            gameStateNumber = 0;
            break;
    }
};

/* --- DRAW --- */
draw = function() {
    frameRate(60);
    switch(gameStateNumber) {
        case 0: // When gameStateNumber equals 0, draw the menu, this is by default
            menu();
            break;
        case 1:
            help();
            break;
        case 2:
            credits();
            break;
        case 3: // When gameStateNumber equals 3, draw the first level
            intro();
            break;
        case 4:
            level01();
            break;
    }
};
