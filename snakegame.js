var canvas=document.getElementById("snake");
var ctx=canvas.getContext("2d");
const box=32;
const ground=new Image();
ground.src="ground.png";
var foodimg=new Image();
foodimg.src="food1.png";
var smileimg=new Image();
smileimg.src="smile.png";

var dead = new Audio();
var eat = new Audio();
var left = new Audio();
var right = new Audio();
var down = new Audio();
var up = new Audio();

dead.src="dead.mp3";
eat.src="eat.mp3";
left.src="left.mp3";
right.src="right.mp3";
up.src="up.mp3";
down.src="down.mp3";

var snake=[];
snake[0]={
	x : 1*box,
	y : 3*box
}

var obstacles=[];

var matrix;

var score=0;

var dir;

let foodpos;

var delay=300;

function initmatrix(){
	matrix=new Array(15);
	for(var i=0;i<15;i++){
		matrix[i]=new Array(17);
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<18;j++){
			matrix[i][j]=false;
		}
	}
	matrix[0][0]=true;
}


function addObstacles(){
	var n=Math.floor(Math.random()*5+ 3);
	for(var i=0;i<n;i++){
		let temp1={
			x : Math.floor(Math.random()*12+2)*box,
			y : Math.floor(Math.random()*13+4)*box
		}
		let temp2={
			x : (temp1.x/box+1)*box,
			y : temp1.y
		}
		let temp3={
			x : ((temp1.x)/box+1)*box,
			y : (temp1.y/box+1)*box
		}
		let temp4={
			x : temp1.x,
			y : (temp1.y/box+1)*box
		}
		var x=Math.floor(Math.random()*4+ 1);
		if(x==4){
			obstacles.push(temp1);
			obstacles.push(temp2);
			obstacles.push(temp4);
			obstacles.push(temp3);
			matrix[temp1.y/box -3][temp1.x/box-1]=true;
			matrix[temp2.y/box -3][temp2.x/box-1]=true;
			matrix[temp3.y/box -3][temp3.x/box-1]=true;
			matrix[temp4.y/box -3][temp4.x/box-1]=true;
		}
		else if(x==3){
			obstacles.push(temp1);
			obstacles.push(temp2);
			obstacles.push(temp4);
			matrix[temp1.y/box -3][temp1.x/box-1]=true;
			matrix[temp2.y/box -3][temp2.x/box-1]=true;
			matrix[temp4.y/box -3][temp4.x/box-1]=true;
		}
		else if(x==2){
			obstacles.push(temp1);
			obstacles.push(temp2);
			matrix[temp1.y/box -3][temp1.x/box-1]=true;
			matrix[temp2.y/box -3][temp2.x/box-1]=true;
		}else if(x==1){
			obstacles.push(temp1);
			matrix[temp1.y/box -3][temp1.x/box-1]=true;
		}
	}
	var vec=[];
	for(var i=0;i<15 ;i++){
		for(var j=0;j<17;j++){
			if(matrix[i][j] == false){
				var pos={
					x : j,
					y : i
				}
				vec.push(pos);
			}
		}
	}
	var p=Math.floor(Math.random()*vec.length);
	foodpos={
		x : (vec[p].x+1)*box,
		y : (vec[p].y+3)*box
	}
}


function checkfoodpos1(){
	for(var i=0;i<snake.length;i++){
		if(foodpos.x==snake[i].x && foodpos.y==snake[i].y){
			return true;
		}
	}
	return false;
}
function checkfoodpos2(){
	for(var i=0;i<obstacles.length;i++){
		if(foodpos.x==obstacles[i].x && foodpos.y==obstacles[i].y){
			return true;
		}
	}
	return false;
}
document.addEventListener("keydown",direction)
function direction(event){
	var key=event.keyCode;
	if(key== 37 && dir!="RIGHT"){
		dir="LEFT";
		left.play();
	}else if(key == 38 && dir!="DOWN"){
		dir="UP";
		up.play();
	}else if(key == 39 && dir!="LEFT"){
		dir="RIGHT";
		right.play();
	}else if(key == 40 && dir!="UP"){
		dir="DOWN";
		down.play();
	}
}
function selfCollision(head,snake){
  	for(var i=0;i<snake.length;i++){
  		if(snake[i].x==head.x && snake[i].y==head.y){
  			return true;
  		}
  	}
  	return false;
  }

  function obstaclesCollision(currHead){
  	for(var i=0;i<obstacles.length;i++){
  		if(obstacles[i].x == currHead.x && obstacles[i].y == currHead.y){
  			return true;
  		}
  	}
  	return false;
  }

 function drawObstacles(){
 	for(var i=0;i<obstacles.length;i++){
 		ctx.fillStyle ="blue"
 		ctx.fillRect(obstacles[i].x,obstacles[i].y,box,box);
 		ctx.strokeStyle = "black";
 		ctx.strokeRect(obstacles[i].x,obstacles[i].y,box,box);
 	}
 }

 function draw(){
 	ctx.drawImage(ground,0,0);
 	drawObstacles();
 	for(var i=0;i<snake.length;i++){
 		ctx.fillStyle = (i==0) ? "black" : "white";
 		ctx.fillRect(snake[i].x,snake[i].y,box,box);
 		ctx.strokeStyle = "red";
 		ctx.strokeRect(snake[i].x,snake[i].y,box,box);
 	}
 	ctx.drawImage(foodimg,foodpos.x,foodpos.y);
 	var headX=snake[0].x;
 	var headY=snake[0].y;
 	if(dir=="LEFT")headX-=box;
 	else if(dir=="UP")headY-=box;
 	else if(dir=="RIGHT")headX+=box;
 	else if(dir=="DOWN")headY+=box;
 	var currHead = {x : headX , y : headY}
 	var flag = obstaclesCollision(currHead);
 	if(headX==foodpos.x && headY==foodpos.y){
 		eat.play();
 		score++;
 		matrix[headY/box-3][headX/box-1]=true;
		var vec=[];
		for(var i=0;i<15 ;i++){
			for(var j=0;j<17;j++){
				if(matrix[i][j] == false){
					var pos={
						x : j,
						y : i
					}
					vec.push(pos);
				}
			}
		}
		var p=Math.floor(Math.random()*vec.length);
		foodpos={
			x : (vec[p].x+1)*box,
			y : (vec[p].y+3)*box
		}
		delay=delay-10;
 	}else if(flag == false){
 		var last=snake.pop();
 		matrix[last.y/box-3][last.x/box-1]=false;

 	}
 	if(headX<box || headX>17*box || headY<3*box || headY>17*box ||selfCollision(currHead,snake)){
 		stop();
 	}
 	if(flag == false){
 		snake.unshift(currHead);
 		matrix[currHead.y/box-3][currHead.x.box-1]=true;
 		//stop();
 	}else{
 		matrix[currHead.y/box-3][currHead.x.box-1]=false;
 		//dead.play();
 		stop();
 	}
 	ctx.fillStyle="white";
 	ctx.font="45px Changa one";
 	ctx.fillText("Score"+score,2*box,1.6*box);
 }
 initmatrix();
 addObstacles();
 var interval = setInterval(draw,delay);
 function stop(){
 	dead.play();
 	ctx.fillStyle="red";
 	ctx.font="45px Changa one";
 	ctx.fillText("GAME OVER !",4*box,10*box);
 	ctx.fillStyle="green";
 	ctx.font="45px Changa one";
 	ctx.fillText("your score is "+score,4*box,11.3*box)
 	ctx.drawImage(smileimg,8*box,12*box,);
 	clearInterval(interval);
 }
 