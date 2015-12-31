var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

var now = new Date();
// const endTime = new Date(2015, 11, 31, 12, 0, 0);
const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0);

var curShowTimeSeconds = 0;

var balls = [];

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(function(){
        render(context);
        update();
    }, 50);
};

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round( ret/1000 );
    return ret;
}

function update() {
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt( nextShowTimeSeconds/3600 );
	var nextMinutes = parseInt( (nextShowTimeSeconds-3600*nextHours) / 60 );
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt( curShowTimeSeconds / 3600 );
	var curMinutes = parseInt( (curShowTimeSeconds-3600*curHours) /60 );
	var curSeconds = curShowTimeSeconds % 60;

	if( nextSeconds != curSeconds ) {
		if( parseInt(curHours/10) != parseInt(nextHours/10) )
			addBalls( MARGIN_LEFT+0, MARGIN_TOP, parseInt(curHours/10) );
		if( parseInt(curHours%10) != parseInt(nextHours%10) )
			addBalls( MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10) );

		if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) )
			addBalls( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10) );
		if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) )
			addBalls( MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes%10) );

		if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) )
			addBalls( MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds/10) );
		if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) )
			addBalls( MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds%10) );

		curShowTimeSeconds = nextShowTimeSeconds;
	}

	updateBalls();

	console.log( balls.length );
}

function addBalls(x, y, num) {
	for(var i=0; i<digit[num].length; i++)
		for(var j=0; j<digit[num][i].length; j++)
			if( digit[num][i][j] ) {
				var aBall = {
					x: x + j*2*(RADIUS+1) + (RADIUS+1),
					y: y + i*2*(RADIUS+1) + (RADIUS+1),
					g: 1.5 + Math.random(),
					vx: Math.pow( -1, Math.ceil( Math.random()*1000 ) ) * 4,
					vy: -5,
					color: getColor()
				};
				balls.push( aBall );
			}
}


function updateBalls() {
	for(var i=0; i<balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= WINDOW_HEIGHT-RADIUS ) {
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.7;

		}
	}

	var cnt = 0;
	for(i=0; i<balls.length; i++) {
		if(balls[i].x + RADIUS >0 && balls[i].x - RADIUS < WINDOW_WIDTH) balls[cnt++]=balls[i];
	}

	while( balls.length > Math.min(300, cnt) ) balls.pop();
}

function render(cxt){
	cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

	var hour = parseInt( curShowTimeSeconds/3600 );
	var minute = parseInt( (curShowTimeSeconds-3600*hour)/60 );
	var second = parseInt( curShowTimeSeconds-3600*hour-60*minute);

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hour/10), cxt);
	renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(hour%10), cxt);

	renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt);

	renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minute/10), cxt);
	renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(minute%10), cxt);

	renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt);

	renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(second/10), cxt);
	renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(second%10), cxt);

	for(var i=0; i<balls.length; i++) {
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
		cxt.fill();
		cxt.closePath();
	}
}

function renderDigit(x, y, num, cxt){
	cxt.fillStyle = "rgb(0,102,153)";

	for(var i=0; i<digit[num].length; i++)
		for(var j=0; j<digit[num][i].length; j++) 
			if( digit[num][i][j] === 1 ) {
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
				cxt.closePath();
				cxt.fill();
			}
}

function getColor(){
	var color = parseInt( Math.random() * 16777216 );
	color= '#' + color.toString(16);
	return color;
}