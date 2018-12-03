var snake, apple, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue, 
    textStyle_Key, textStyle_Value;

var Game = {

    preload : function() {
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
        game.load.image('mouse', './assets/images/pixelMouse.png');
    },

    create : function() {

        snake = [];                     
        apple = {};
        mouse = {};                     
        squareSize = 15;                
        score = 0;                      
        speed = 0;                      
        updateDelay = 0;                
        direction = 'right';            
        new_direction = null;           
        addNew = false;                 

        game.stage.backgroundColor = '#228b22';

        cursors = game.input.keyboard.createCursorKeys();

        for(var i = 0; i < 10; i++){
            snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake');  
        }

        this.generateApple();

        this.generateMouse();

        textStyle_Key = { font: "bold 14px comic sans ms", fill: "#0000cd", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

    },

    update: function(){

    if (cursors.right.isDown && direction!='left')
    {
        new_direction = 'right';
    }
    else if (cursors.left.isDown && direction!='right')
    {
        new_direction = 'left';
    }
    else if (cursors.up.isDown && direction!='down')
    {
        new_direction = 'up';
    }
    else if (cursors.down.isDown && direction!='up')
    {
        new_direction = 'down';
    }

    speed = Math.min(10, Math.floor(score/5));

    speedTextValue.text = '' + speed;

    updateDelay++;

    if (updateDelay % (10 - speed) == 0) {

        var firstCell = snake[snake.length - 1],
            lastCell = snake.shift(),
            oldLastCellx = lastCell.x,
            oldLastCelly = lastCell.y;

        if(new_direction){
            direction = new_direction;
            new_direction = null;
        }
        
        if(direction == 'right'){

            lastCell.x = firstCell.x + 15;
            lastCell.y = firstCell.y;
        }
        else if(direction == 'left'){
            lastCell.x = firstCell.x - 15;
            lastCell.y = firstCell.y;
        }
        else if(direction == 'up'){
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y - 15;
        }
        else if(direction == 'down'){
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y + 15;
        }

        snake.push(lastCell);
        firstCell = lastCell;

        if(addNew){
            snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
            addNew = false;
        }

        this.appleCollision();

        this.selfCollision(firstCell);

        this.wallCollision(firstCell);

        this.mouseCollision();
    }
    },

    appleCollision: function(){

        for(var i = 0; i < snake.length; i++){
            if(snake[i].x == apple.x && snake[i].y == apple.y){
    
                addNew = true;
    
                apple.destroy();
    
                this.generateApple();
    
                score++;
    
                scoreTextValue.text = score.toString();
            }
        }
    },

    mouseCollision: function(){

        for(var i = 0; i < snake.length; i++){
            if(snake[i].x == mouse.x && snake[i].y == mouse.y){
    
                addNew = true;
    
                mouse.destroy();
    
                this.generateMouse();
    
                score = score + 5;
    
                scoreTextValue.text = score.toString();
            }
        }
    },

    selfCollision: function(head){

        for(var i = 0; i < snake.length - 1; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){
    
                game.state.start('Game_Over');
            }
        }
    },

    wallCollision: function(head) {
    
        if(head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0){
    
            game.state.start('Game_Over');
        }
    },

    generateApple: function(){

        var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;

        apple = game.add.sprite(randomX, randomY, 'apple');
    },

    generateMouse: function(){
        var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;

        mouse = game.add.sprite(randomX, randomY, 'mouse');
    }
};

var Game_Over = {
    
    preload: function(){

        game.load.image('gameover', './assets/images/gameover.png');
    },

    create: function(){

        this.add.button(0, 0, 'gameover', this.startGame, this);

        game.add.text(235, 350, "LAST SCORE", { font: "bold 16px sans-serif", fill: "#46c0f9", allign: "center"});
        game.add.text(350, 348, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
    },

    startGame: function(){

        this.state.start('Game');
    }
}