
$(document).ready(function(){

  
    /** @type {HTMLCanvasElement} */
    
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    
    let bearArr = [];
    let bugArr = []; // limit to 6 bugs at a time?
    
    let gameFrame = 0;
    let staggerFrames = 10;
    
    let oldTimeStamp = 0;
    let secondsPassed = 0; 
    
    //variable to store whether the player is facing left or right
    let directionLeft = false;
    let spacePressed = false;  
    let score = 0; 
    
    let player;
    let colSprite;
    let playerSprite; 
    
    let sounds = {
        swish: new Howl({
            src: [
                '../sounds/swish.wav'
            ],
            loop: false,
            volume: 1
            
        }),
        catch: new Howl({
            src: [
                '../sounds/catch.wav'
            ],
            loop: false,
            volume: 1
        }),
        minus: new Howl({
            src: [
                '../sounds/minus.wav'
            ],
            loop: false,
            volume: 0.8
        }),
        bgMusic: new Howl({
            src: [
                '../sounds/goldfish-111655.mp3'
            ],
            loop: true,
            volume: 0.5
        }),
        timeUp: new Howl({
            src: [
                '../sounds/timesUp.mp3'
            ],
            loop: false,
            volume: 1
        })
    }; 
    
    
    
    //Bear Class
    // Create the player
    class Bear
    {
        constructor(x, y, maxFrame, spriteWidth, spriteHeight, fileName){
            this.x =   x;
            this.y =   y;
            
            this.image = new Image();
            this.image.src = `../images/${fileName}.png`; 
         
            this.frame = 0;
            this.maxFrame = maxFrame;
            this.spriteWidth = spriteWidth;
            this.spriteHeight = spriteHeight;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight; 
            
            
        }
        update(){
            ctx.clearRect(0,0,canvas.width, canvas.height);
            if(gameFrame % staggerFrames === 0){
                if(this.frame < this.maxFrame -1){
                    this.frame++; 
                }
                else{
                    this.frame = 0; 
                }
            }
            
            
        }
        draw(){
    
            ctx.drawImage(this.image, this.frame* this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height); 
        }
       
    }
    
    
    
    //Bug Class
    //Create bugs
    class Bug {
        constructor(){
            this.x = Math.random() * 700; // between x = 0 to x = 700 of canvas 
            this.y = Math.random() * (600 - 525) + 525; // between y = 525 and y = 600 of canvas 
            this.radius = 6;
            this.color = 'yellow';
            this.markedForDeletion = false;
            this.secSinceBirth = 0; 
        }
        update(){
            ctx.clearRect(0,0,canvas.width, canvas.height); 
            // mark for deletion bugs that are above top of canvas
            if(this.y < 0) this.markedForDeletion = true;
       
        }
        draw(){
            
            ctx.beginPath();
            ctx.strokeStyle = 'orange';
            ctx.lineWidth = 0.5;
            ctx.fillStyle = this.color; 
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2 );
            ctx.fill(); 
            ctx.stroke(); 
        }
    }
    
    
    
    //Collision Sprite Class
    // Create collision sprites
    class CollisionSprite {
        constructor(x, y, width, height, color){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color; 
        }
        update(){
            ctx.clearRect(0,0,canvas.width, canvas.height); 
        }
        draw(){
           ctx.strokeStyle = this.color; 
           ctx.lineWidth = 4; 
           ctx.strokeRect(this.x, this.y, this.width,this.height);
        }
    }
    
    
    
    //Store sprite location in an array
    function storeLocation(bear, targetArray){
        let frames = {
            loc: []
        }
        for(let j = 0; j < bear.maxFrame; j++){
            let positionX = j * bear.spriteWidth;
            let positionY = 0;
            frames.loc.push({x:positionX, y: positionY}); 
        }
        targetArray.push(frames); 
    }
    
    
    
    //Initalize player, net collision sprite and player collision sprite
    function init(){
    // create the player 
    player = new Bear(canvas.width/2, canvas.height/2,  8, 160, 200, 'idleNet'); 
    storeLocation(player, bearArr);
    
    //set up collision box for net catching
    colSprite = new CollisionSprite(player.x, player.y + 100, 70, 70, 'rgba(138,43,226, 0)'); 
    
    //set up collision sprite around player 
    playerSprite = new CollisionSprite(player.x + 50, player.y + 60, 55, 100, 'rgba(255, 240, 0, 0)'); 
    }
    
    
    
    function intersect(colSpriteX, colSpriteY, colSpriteW, colSpriteH, objX, objY, objW, objH){
        objW += objX; // total length of obstacle
        colSpriteW += colSpriteX;
        if(objX > colSpriteW || colSpriteX > objW) return false;
    
        objH += objY; // total height
        colSpriteH += colSpriteY;
        if(objY > colSpriteH || colSpriteY > objH) return false;
    
        return true; 
    }
    
    
    
    function drawScore(){
        ctx.font = "30px Arial";
    
        ctx.fillStyle = 'orange';
        ctx.fillText('Score: ' + score, 10, 42); 
       
       
        ctx.fillStyle = 'yellow';
        ctx.fillText('Score: ' + score, 10, 40); // location of draw the last two args x and y
    }
    
    
    
    function drawMinusOne(color){
        ctx.font = "25px Arial";
    
        ctx.fillStyle = color;
        ctx.fillText('-1', player.x, player.y - 3); 
    
    
    }
    
    
    
    // reset the bear back to idle animation
    function resetToIdle(){
        player.maxFrame = 8; 
        player.spriteWidth = 160;
        player.spriteHeight = 200; 
        player.width = 160;
        player.height = 200; 
        player.image.src = '../images/idleNet.png'; 
    }
    
    
    
    // reset the properties of the bear for the walk animation
    function resetWalk(){
        player.maxFrame = 4; 
        player.spriteWidth = 550;
        player.spriteHeight = 440; 
        player.width = 550/2.5;
        player.height = 440/2.5; 
    }
    
    
    
    // function to decide the action of the bear depending on the key pressed down 
    function doKeyDown(event){
        switch(event.keyCode){
            case 37: 
            //Left Arrow
            directionLeft = true; 
            resetWalk(); 
            player.image.src = '../images/leftV6.png'; 
            if(player.x > 0){
                player.x -=10;
              
            }
            else{
                player.x = 0;  
            }
            colSprite.x = player.x; 
            playerSprite.x = player.x + 50; 
            break;
            case 38:
                //Up Arrow
                
                if(player.y > 180)
                player.y -= 10;
                else{
                    player.y = 180; 
                }
                colSprite.y = player.y + 100; 
                playerSprite.y = player.y + 60; 
                break;
            case 39:
                    // Right Arrow
                    directionLeft = false; 
                    resetWalk(); 
                    player.image.src = '../images/rightV6.png'; 
                    if(player.x < 650){
                        player.x += 10;
                    }
                    else{
                        player.x = 650; 
                    }
                    colSprite.x = player.x; 
                    playerSprite.x = player.x + 50; 
                    break;
           case 40: 
            // Down Arrow
                    
            if(player.y < 350){
             player.y += 10;
            }
            else{
                player.y = 350; 
            }
            colSprite.y = player.y + 100; 
            playerSprite.y = player.y + 60; 
            break;
            case 32:
                //spacebar
                {   spacePressed = true;   
                    checkPlayerDirection(directionLeft); 
                    sounds.swish.play(); 
                    
                }
            break;  
            }
        }
        
    
    
    // function to check the player direction and deterime which catch animation should be played
    function checkPlayerDirection(directionLeft){
            if(directionLeft === false){
                player.maxFrame = 5; 
                player.spriteWidth = 230;
                player.spriteHeight = 220; 
                player.width = 230;
                player.height = 220; 
                player.image.src = '../images/rightNetV6.png'; 
            }
            else{
                player.maxFrame = 5; 
                player.spriteWidth = 230;
                player.spriteHeight = 220; 
                player.width = 230;
                player.height = 220; 
                player.image.src = '../images/leftNetV6.png'; 
            }
        }
    
    
    
    //move the bear around playable area with arrow keys
    window.addEventListener("keydown", function(e){
          
            doKeyDown(e);
    })
       
    
    
    //reset bear back to idle state 
    window.addEventListener("keyup", function(e){
          
           spacePressed = false; 
            resetToIdle(); 
    })
    
    
    
    let gameTimeSec = 0; 
    let setTime; 
    
    
    //Control the bug growth time 
    function countdown(){
       gameTimeSec++; 
       
       //increase time since birth of bug, initial is 0 sec
       [...bugArr].forEach(function(object){
        object.secSinceBirth++;
        });
    }
    
    
    
    setTime = setInterval(countdown, 1000); 
    let tempColor;
    
    
    
    // limit bugs to appear, only 5 bugs at a time 
    function bugAppear(){
        if(bugArr.length < 5){
            return bugArr.push(new Bug());
        }
    
    }
    
    
    
    //change color from yellow to red in a duration of 3 seconds 
    // bug radius change from 6px to 20px within 5 sec, therefore increments of (20-6)/5 = 2.8px every second 
    // bug flies after 4 seconds 
    function bugCycle(bugArr){
    
        for(let bug of bugArr){
            if(bug.secSinceBirth <= 1 ){
                //color change
                tempColor = ctx.createRadialGradient(bug.x, bug.y,1.5, bug.x, bug.y, 3); 
                tempColor.addColorStop(1,'yellow');
                tempColor.addColorStop(1, 'yellow'); 
                bug.color = tempColor; 
    
                //radius change
                bug.radius = 6; 
            }
            else if(bug.secSinceBirth >1 && bug.secSinceBirth <= 2){
                //color change
                tempColor = ctx.createRadialGradient(bug.x, bug.y, 1.5, bug.x, bug.y, 3); 
                tempColor.addColorStop(0.9 , 'yellow');
                tempColor.addColorStop(0.1, 'red'); 
                bug.color = tempColor; 
    
                 //radius change
                 bug.radius = 8.8; 
                 
            }
            else if(bug.secSinceBirth > 2 && bug.secSinceBirth <= 3){
                //color change
                tempColor = ctx.createRadialGradient(bug.x, bug.y,1.5, bug.x, bug.y,3); 
                tempColor.addColorStop(0.1 , 'yellow');
                tempColor.addColorStop(0.9, 'red'); 
                bug.color = tempColor; 
    
                 //radius change
                 bug.radius = 11.6; 
                 
            }
            else if(bug.secSinceBirth > 3 && bug.secSinceBirth <= 4){
                //color change
                tempColor = ctx.createRadialGradient(bug.x, bug.y, 1.5, bug.x, bug.y, 3); 
                tempColor.addColorStop(0 , 'red');
                tempColor.addColorStop(1, 'red'); 
                bug.color = tempColor; 
    
                 //radius change
                 bug.radius = 14.4; 
                 
            }
            else if(bug.secSinceBirth > 4 && bug.secSinceBirth < 5){
                //radius change
                bug.radius = 17.2 ;
               //start flying
                bug.y -= 1.2; 
                
            }
            // The bug should start flying after 4 sec, then it must cross the playable area within 6 sec, therefore tested with < 11 ( 4+ 6 = 10)
            // Tested for the appropriate bug.y value with the conditional --> if(bug.secSinceBirth > 4 && bug.secSinceBirth < 11)
            // the was result was it stopped flying above the playable area
            
            else if (bug.secSinceBirth >= 5){
                //radius change
                bug.radius = 20; 
                //start flying
                bug.y -= 1.2; 
                
            }
            
        }
    
    }
    
    
    
    //Turn background music on
    document.querySelector('.onMusic').addEventListener("click", function(){
       
        if(!sounds.bgMusic.playing()){
            sounds.bgMusic.play(); 
        }
    
        $('.onMusic').addClass("d-none"); 
        $('.offMusic').removeClass("d-none"); 
    })
    
    
    
    //Turn background music on
    document.querySelector('.offMusic').addEventListener("click", function(){
       
        if(sounds.bgMusic.playing()){
            sounds.bgMusic.pause(); 
        }
    
        $('.offMusic').addClass("d-none"); 
        $('.onMusic').removeClass("d-none"); 
    })
    
    
    
    // Loudness Controls
    document.querySelector('#audio').addEventListener('change', function(){
        
        let inputSound = parseFloat(document.getElementById('audio').value)/100;
    
        if(inputSound < 0.2){
            inputSound = 0; 
        }    
    
        sounds.bgMusic.volume(inputSound); 
        sounds.catch.volume(inputSound); 
        sounds.minus.volume(inputSound); 
        sounds.swish.volume(inputSound); 
    })
    
    
    /* TimeOut controls*/
    let timeUser = document.getElementById('timeInput').value;
    let interimTime = 0; 
    
    
    
    function drawTime(timeString){
        ctx.font = "30px Arial";
        
        ctx.fillStyle = 'orange';
        ctx.fillText(timeString, 700, 42); 
        
        
        ctx.fillStyle = 'yellow';
        ctx.fillText(timeString, 700, 40); // location of draw the last two args x and y
    } 
    
    
    
    function padTo2Digits(number){
        return number.toString().padStart(2,'0');
    }
    
    
    
    function convertMsToMins(milliseconds){
        let seconds = Math.floor(milliseconds/1000);
        let minutes = Math.floor(seconds/60);
        
        seconds= seconds % 60;
        minutes = minutes % 60;
        
        return`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`; 
    }
    
    
    let timerOn;
    // decrease countdown timer by 1 sec every second 
    function decreaseTimer(){
        if(timeUser > 0 && timerOn){
            setTimeout(decreaseTimer, 1000);
            timeUser--;
            drawTime(convertMsToMins(timeUser)); 
        }
        else{
            timerOn = false; 
            
        }
    }
    
    
    
    // change the time input by user
    $('#timeInput').change(function(){
        timeUser = document.getElementById('timeInput').value;
        
    })
    
    
    
    /*Main Menu */
    //Draw menu at start of canvas load 
    drawMenu();
    
    
    
    function drawMenu() {
        
        //draw main menu
        let menuImg = new Image();
        menuImg.setAttribute("id", "menuImg");
        menuImg.src = "images/MainMenu.png";
        menuImg.onload = function () {
            ctx.drawImage(menuImg, 180, 40, 450, 330);
        }
         
    }
    
    
    
    //Draw the Restart Menu
    function drawRestart(){
        ctx.clearRect(0,0,canvas.width, canvas.height); 
        drawMenu();
        drawTimeUp();
        $('.btnRestart').removeClass("hide"); 
        $('.btnPlay').addClass("hide"); 
        $("#timeInput").val('240000'); 
        $("#timeInput[value='240000']").attr("selected", "selected"); 
        timeUser = document.getElementById('timeInput').value;
        $('.btnSelectTime').show();
        sounds.bgMusic.stop();
       
    }
    
    
    
    $('.btnPlay').click(function(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        init();  
        timerOn = true; 
        score = 0; 
        $('.btnPlay').addClass("hide");
        $('.btnSelectTime').hide(); 
        sounds.bgMusic.play(); 
        animateMove(0);   
        
    })
    
    
    
    $('.btnRestart').click(function(){
        timerOn = true;
        bugArr = []; 
        score = 0; 
        $('.btnRestart').addClass("hide");
        $('.btnSelectTime').hide(); 
        ctx.clearRect(0,0,canvas.width, canvas.height);
        sounds.bgMusic.play(); 
        init();
        animateMove(0); 
    })
    
    
    
    /*Draw Time's up */
    function drawTimeUp(){
        ctx.font = "50px Arial";
        
        ctx.fillStyle = 'orange';
        ctx.fillText(`Time's Up!\nScore:${score}`, 180, 450); 
        
        
        ctx.fillStyle = 'yellow';
        ctx.fillText(`Time's Up!\nScore:${score}`, 180, 450);
    }
    
    
    
    //function to refresh and initialize the animation 
    function animateMove(timestamp){
        
        
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        
        bugAppear(); 
        bugCycle(bugArr); 
        colSprite.x = (directionLeft) ? player.x :  player.x + 150;
        
        
        [...bugArr,player, colSprite, playerSprite].forEach(function(object){
            object.update();
        }); 
        
        [...bugArr, player, colSprite, playerSprite].forEach(function(object){
            object.draw();
        }); 
        drawScore();
        
        
        //Decrease the timer by 1 throughout the game 
        if(timerOn){
            decreaseTimer(); 
        }
        else{
            drawTime(convertMsToMins(timeUser)); 
        }
        
        
        
        //remove bugs that are marked for deletion 
        bugArr = bugArr.filter(object => !object.markedForDeletion); 
        let hit = false; 
        //To check if bug hits the bear
        let bearHit = false; 
        let drawMinus = false; 
        
        //To check if bug is caught by the bear 
        // spacePressed = true and collision between net hit box and bug is true 
        bugArr.forEach(function(object){
            let result = intersect(colSprite.x, colSprite.y, colSprite.width, colSprite.height, object.x, object.y, object.radius*2, object.radius*2);
            let resultBear = intersect(playerSprite.x, playerSprite.y, playerSprite.width, playerSprite.height, object.x, object.y, object.radius*2, object.radius*2);
    
            if(spacePressed === true && result){
                hit = true; 
                object.markedForDeletion = true;
            }
            
            if(spacePressed !== true && !result && resultBear ){
                bearHit = true;
                drawMinus = true; 
                object.markedForDeletion = true;
            }
            
            // remove caught bug from display by removing it from the bugArr
            bugArr = bugArr.filter(object => !object.markedForDeletion); 
        })
        
        
        
        // To distribute only one point per hit
        if(hit){
            spacePressed = false; 
            hit = false; 
            score = score + 1; 
            
            sounds.catch.play(); 
            
        };
        
        if(drawMinus){
            for(let i = 0; i < 1000; i++){
                drawMinusOne('red');
            }
            drawMinus = false; 
        }
        
        // minus point by 1 is bear is hit with a bug
        // play an unhappy sound when bear is hit with a bug
        if(bearHit){
            
            if(score != 0){
                score = score - 1;
            }
            
            bearHit = false;
            
            sounds.minus.play();    
            
        }
        
        gameFrame++;
        
      
        
        if(timerOn)
        {
            requestAnimationFrame(animateMove);
        }
        else{
           
            ctx.clearRect(0,0,canvas.width, canvas.height);
            clearInterval(countdown); 
            drawRestart(); 
           
        }
        
    }
    
    /*Prevent auto scroll with arrow keys */
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

})