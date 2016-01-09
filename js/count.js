$(function(){
	"use strict";
	var WIDTH = 1024;
	var HEIGHT =768;
	var RADIUS = 8;
	var MARGIN_LEFT = 30;
	var MARGIN_TOP = 60;
	var PI = Math.PI;
	var now = new Date();
	var endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0);
	var curTimeSecond = 0;

	var balls = [];


	window.onload=function() {
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
		canvas.height = HEIGHT;
		canvas.width = WIDTH;

		curTimeSecond = getCurSecond();
		setInterval(function(){
			render(context);
			update();
		}, 50);

	};

	function getColor(){
		var color = parseInt( Math.random() * 16777216 );
		color= '#' + color.toString(16);
		return color;
	}

	function addBall(x, y, number) {
		for(var i=0; i<digit[number].length; i++)
			for(var j=0; j<digit[number][i].length; j++) 
				if( digit[number][i][j] === 1 )
				{
					var aBall = {
						x: x + j*(2*RADIUS+1),
						y: y + i * (2*RADIUS+1),
						color: getColor(),
						vx: Math.pow( -1, Math.ceil( Math.random()*1000 ) ) * 4,
						vy: -5,
						g: 1.5 + Math.random()
					};
					balls.push( aBall );
				}
	}

	function getCurSecond() {
		var cur = new Date();
		var x = endTime.getTime() - cur.getTime();
		x = parseInt( x / 1000 ); 
		return x;
	}

	function renderDigit(x, y, number, cxt) {
		cxt.fillStyle = "rgb(170, 0, 98)";

		for(var i=0; i<digit[number].length; i++)
			for(var j=0; j<digit[number][i].length; j++)
				if( digit[number][i][j] === 1 ) {
					cxt.beginPath();
					cxt.arc(x + j*(2*RADIUS+1), y + i * (2*RADIUS+1), RADIUS, 0, 2*PI);
					cxt.fill();
					cxt.closePath();
				}
		for(i=0; i<balls.length; i++) {
			cxt.fillStyle = balls[i].color;
			cxt.beginPath();
			cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*PI);
			cxt.fill();
			cxt.closePath();
		}
	}

	function render(cxt) {
		cxt.clearRect(0, 0, WIDTH, HEIGHT);

		var hour = parseInt( curTimeSecond / 3600 );
		var minute = parseInt( (curTimeSecond - 3600*hour) / 60 );
		var second = curTimeSecond % 60;

		renderDigit( MARGIN_LEFT, MARGIN_TOP, parseInt( hour/10 ), cxt);
		renderDigit( MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt( hour%10 ), cxt);
		renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt);

		renderDigit( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt( minute/10 ), cxt);
		renderDigit( MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt( minute%10 ), cxt);
		renderDigit( MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt);

		renderDigit( MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt( second/10 ), cxt);
		renderDigit( MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt( second%10 ), cxt);
	}

	function update() {
		var nextTimeSecond = getCurSecond();

		var curHour = parseInt( curTimeSecond / 3600 );
		var curMinute = parseInt( (curTimeSecond - 3600*curHour) / 60 );
		var curSecond = curTimeSecond % 60;

		var nextHour = parseInt( curTimeSecond / 3600 );
		var nextMinute = parseInt( (curTimeSecond - 3600*nextHour) / 60 );
		var nextSecond = nextTimeSecond % 60;

		if( nextSecond != curSecond ) {

			if( parseInt(nextHour/10 ) != parseInt( curHour/10) ) 
				addBall( MARGIN_LEFT, MARGIN_TOP, parseInt(nextHour/10 ) );
			if( parseInt(nextHour%10 ) != parseInt( curHour%10) ) 
				addBall( MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(nextHour%10 ) );

			if( parseInt(nextMinute/10 ) != parseInt( curMinute/10) ) 
				addBall( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(nextMinute%10 ) );
			if( parseInt(nextMinute%10 ) != parseInt( curMinute%10) ) 
				addBall( MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(nextMinute%10 ) );

			if( parseInt(nextSecond/10 ) != parseInt( curSecond/10) ) 
				addBall( MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(nextSecond%10 ) );
			if( parseInt(nextSecond%10 ) != parseInt( curSecond%10) ) 
				addBall( MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(nextSecond%10 ) );
			curTimeSecond = nextTimeSecond;
		}
		updateBall();
	}

	function updateBall() {
		for(var i=0; i<balls.length; i++) {
			balls[i].x += balls[i].vx;
			balls[i].y += balls[i].vy;
			balls[i].vy += balls[i].g;

			if( balls[i].y >= HEIGHT-RADIUS ) {
				balls[i].y = HEIGHT-RADIUS;
				balls[i].vy *= -0.7;
			}
		}

		var cnt = 0;
		for(i=0; i<balls.length; i++) {
			if(balls[i].x + RADIUS >0 && balls[i].x - RADIUS < WIDTH) balls[cnt++]=balls[i];
		}

		while( balls.length > Math.min(300, cnt) ) balls.pop();
	}
});
