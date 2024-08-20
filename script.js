document.getElementById('btn').addEventListener('click', function() {
    document.getElementById('bx').style.display = 'none';
});


const canvas = document.getElementById('canvas');
const contxt = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Ball {
    constructor(position, velocity, redius) {
        this.position = position;
        this.velocity = velocity;
        this.redius = redius;
    }
    updateTheGame = () =>{
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    DrawTheGame = () => {
        contxt.beginPath();
        contxt.fillStyle = "#C1D8C3";
        contxt.strokeStyle = "#C1D8C3";
        contxt.arc(this.position.x, this.position.y, this.redius, 0, Math.PI * 2);
        contxt.fill();
        contxt.stroke();
    }
}

class Bars
{
    constructor(position, velocity, width, height, color) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.score = 0;
        this.color = color;
    }
    UpdatePaddle = () => {
        if(keyPressed[KEY_UP])
            this.position.y -= this.velocity.y;
        if(keyPressed[KEY_DOWN])
            this.position.y += this.velocity.y;
    }
    DrawPaddle = () => {
        contxt.fillStyle = this.color;
        contxt.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    get_half_width = () => {
        return this.width / 2;
    }
    get_half_height = () => {
        return this.height / 2;
    }
    get_pad_center = () => {
        return {
            x: this.position.x + this.get_half_width(),
            y: this.position.y + this.get_half_height()
        };
    }
}

const keyPressed = [];
const KEY_UP = 38;
const KEY_DOWN = 40;

window.addEventListener('keydown', function (e){
    keyPressed[e.keyCode] = true;
});
window.addEventListener('keyup', function (e){
    keyPressed[e.keyCode] = false;
});

const ball = new Ball({x: 200, y: 200}, {x: 10, y: 10}, 15);
const leftPad = new Bars({x: 0, y: 50}, {x: 10, y: 10}, 20, 160, "#6A9C89");
const rightPad = new Bars({x: canvas.width-20, y: 50}, {x: 9, y: 9}, 20, 160, "#6A9C89");

function repositionBall(ball)
{
    if(ball.velocity.x > 0)
    {
        ball.position.x = canvas.width - 160;
        ball.position.y = (Math.random() * (canvas.height - 100)) + 100;
    }
    else if(ball.velocity.x < 0)
    {
        ball.position.x = 160;
        ball.position.y = (Math.random() * (canvas.height - 100)) + 100;
    }
    ball.velocity.x *= -1;
    ball.velocity.y *= -1;
}

function scoreBoard(ball, leftPad, rightPad)
{
    if(ball.position.x <= 0)
    {
        rightPad.score+=1;
        document.getElementById('p2').innerHTML = rightPad.score;
        repositionBall(ball);
    }
    else if(ball.position.x >= canvas.width)
    {
        leftPad.score+=1;
        document.getElementById('p1').innerHTML = leftPad.score;
        repositionBall(ball);
    }
}

function poorAIPlayer(ball, bar)
{
    if(ball.velocity.x >= 0)
    {
        if(ball.position.y > bar.position.y)
            bar.position.y += bar.velocity.y;
        else if(ball.position.y < bar.position.y)
            bar.position.y -= bar.velocity.y;
    }
}

function ballBarCollision(Ball, Bars)
{
    let dx = Math.abs(Ball.position.x - Bars.get_pad_center(Bars).x);
    let dy = Math.abs(Ball.position.y - Bars.get_pad_center(Bars).y);

    if(dx <= (Ball.redius + Bars.get_half_width()) && dy <= (ball.redius + Bars.get_half_height()))
        Ball.velocity.x *= -1;
}

function TopNButtomCollision(ball)
{
    if(ball.position.y + ball.redius >= canvas.height)
        ball.velocity.y *= -1;
    if(ball.position.y - ball.redius <= 0)
        ball.velocity.y *= -1;
}

function paddleCollision(Bars)
{
    if(Bars.position.y <= 0)
        Bars.position.y = 0;
    else if(Bars.position.y +  Bars.height >= canvas.height)
        Bars.position.y = canvas.height - Bars.height;
}

function updategame()
{
    ball.updateTheGame();
    leftPad.UpdatePaddle();

    TopNButtomCollision(ball);
    paddleCollision(leftPad);
    paddleCollision(rightPad);

    ballBarCollision(ball, leftPad);
    ballBarCollision(ball, rightPad);

    poorAIPlayer(ball, rightPad);
    scoreBoard(ball, leftPad, rightPad);
}

function ExecuteTheGameLoop()
{
    contxt.fillStyle = "rgba(100, 0, 255, 0.2)";
    contxt.fillRect(0, 0, canvas.width/2, canvas.height);
    contxt.fillStyle = "rgba(0, 100, 255, 0.2)"
    contxt.fillRect(canvas.width/2, 0, canvas.width/2, canvas.height);
    window.requestAnimationFrame(ExecuteTheGameLoop);
    updategame();
    ball.DrawTheGame();
    leftPad.DrawPaddle();
    rightPad.DrawPaddle();
}
