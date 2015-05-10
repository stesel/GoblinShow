/**
 * ...
 * @author Leo Trofymchuk
 */

var GoblinShow;

var game = (function()
{
	//var console = window.console || { log: function (message) {	} };
	var console = { log : _log };

	function _log(message)
	{
		var logArea = document.getElementById("logArea");
		var text = document.createTextNode("\n" + message);
		logArea.appendChild(text);
		logArea.scrollTop = logArea.scrollHeight;
	}
	var canvas;
	var rectangle;

	var startX = 0;
	var startY = 0;

	var rWidth = 600;
	var rHeight = 500;

	var renderQueue = [];

	var keysDown = {};
	var hero = {x : 300, y : 250, width : 40, height : 40, speed: 256, speedX: 0, speedY: 0, multipleX: 0.5,  multipleY: 0.5, rotation: 0, friction: 0.96 };

	var _rendering = false;


	function _initialize()
	{
		_drawRectangle();
		_addBackground();
		_addHeroImage();
		_addEventListeners();
		_startRendering();
	}

	function _drawRectangle()
	{
		//canvas = document.getElementById("canvasLayer");
		canvas = document.createElement("canvas");

		if (canvas)
		{
			console.log("canvas is ready");
		}
		else
		{
			console.log("Your browser does not support the HTML5 canvas");
		}

		canvas.width = rWidth;
		canvas.height = rHeight;

		rectangle = canvas.getContext("2d");

		document.body.appendChild(canvas);

		var gradient = rectangle.createLinearGradient(startX, startY, rWidth, rHeight);
		gradient.addColorStop(0, "red");
		gradient.addColorStop(1, "blue");

		rectangle.fillStyle = gradient;
		rectangle.fillRect(startX, startY, rWidth, rHeight);

		console.log("rectangle is drawn");
	}

	var backGroundImageLoaded = false;
	var backGroundImage;

	function _addBackground()
	{
		backGroundImage = new Image();
		backGroundImage.onload = function(){backGroundImageLoaded = true; rectangle.drawImage(backGroundImage, 0, 0)};
		backGroundImage.src = "../../../../assets/background.jpg";

		console.log("background image is added");
	}

	var heroImageLoaded = false;
	var heroImage;

	function _addHeroImage()
	{
		heroImage = new Image();
		heroImage.onload = function(){heroImageLoaded = true; rectangle.drawImage(heroImage, hero.x, hero.y)};
		heroImage.src = "../../../../assets/hero.png";
	}

	function _addEventListeners()
	{
		addEventListener("keydown", function (event){ keysDown[event.keyCode] = true }, false);
		addEventListener("keyup", function (event){ delete keysDown[event.keyCode] }, false);
		canvas.addEventListener("mousemove", onMouseMove, false);
		console.log("key listeners are added");
	}

	var deltaX, deltaY;
	var mouseX, mouseY;

	function onMouseMove(event)
	{

		if(event.offsetX)
		{
			mouseX = event.offsetX;
			mouseY = event.offsetY;
		}
		else if(event.layerX)
		{
			mouseX = event.layerX;
			mouseY = event.layerY;
		}
	}

	function _startRendering()
	{
		_rendering = true;
		_update();
		console.log("render loop is started");
	}

	function _stopRendering()
	{
		_rendering = false;
		console.log("render loop is stoped");
	}

	var then = Date.now();
	var counter = 0;
	var fps = 0;

	function _update()
	{
		var now = Date.now();
		var delta = now - then;

		var modifier = delta / 1000;

		then = now;

		if (38 in keysDown || 87 in keysDown)
			hero.speedY = - hero.speed * modifier;

		if (40 in keysDown || 83 in keysDown)
			hero.speedY = hero.speed * modifier;

		if (37 in keysDown || 65 in keysDown)
			hero.speedX = - hero.speed * modifier;

		if (39 in keysDown || 68 in keysDown)
			hero.speedX = hero.speed * modifier;

		hero.x += hero.speedX;
		hero.y += hero.speedY;

		hero.speedX *= hero.friction;
		hero.speedY *= hero.friction;

		deltaX = mouseX - hero.x;
		deltaY = mouseY - hero.y;
		hero.rotation = - Math.atan2(deltaX, deltaY) + Math.PI;

		if(backGroundImageLoaded)
			rectangle.drawImage(backGroundImage, 0, 0);

		rectangle.save();
		rectangle.translate(hero.x, hero.y);
		rectangle.rotate(hero.rotation);
		if (heroImageLoaded)
			rectangle.drawImage(heroImage, - heroImage.width / 2, - heroImage.height / 2);
		rectangle.restore();

		// FPS
		if (counter % 10 == 0)
			fps = 1000 / delta;

		rectangle.fillStyle = "rgb(250, 0, 0)";
		rectangle.font = "12px Helvetica";
		rectangle.textAlign = "left";
		rectangle.textBaseline = "top";
		rectangle.fillText("fps: " + fps.toPrecision(4), 10, 10);

		counter ++;

		if(_rendering)
			requestAnimationFrame(_update);
	}

	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

	return {initialize : _initialize};

})();