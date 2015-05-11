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

	document.onerror = function (errorMsg, url, lineNumber)
	{
		console.log("Error occured: " + errorMsg);
	};

	var canvas;
	var rectangle;

	var startX = 0;
	var startY = 0;

	var rWidth = 600;
	var rHeight = 500;

	var hero;

	var _rendering = false;


	function _initialize()
	{
		_createCanvas();
		_addBackground();
	}

	function _createCanvas()
	{
		//canvas = document.getElementById("canvasLayer");
		canvas = document.createElement("canvas");
		canvas.id = "canvasContent";

		canvas.style.cursor = "none";

		if (canvas)
		{
			console.log("canvas is ready" + canvas.id);
		}
		else
		{
			console.log("Your browser does not support the HTML5 canvas");
			return;
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
		backGroundImage.onload = function(){ backGroundImageLoaded = true; _addHero(); };
		backGroundImage.src = "../../../../assets/images/background.jpg";

		console.log("background image is added");
	}

	var shootSound;

	function _loadSounds()
	{
		shootSound = new Audio();
		shootSound.addEventListener("canplaythrough", onAudioLoaded, false);
		shootSound.src = "../../../../assets/sounds/laser.mp3";
	}

	function onAudioLoaded(event)
	{
		event.target.removeEventListener("canplaythrough", onAudioLoaded);
		console.log("audio is loaded");

		_addEventListeners();
		_startRendering();
	}

	var heroImage;

	function _addHero()
	{
		heroImage = new Image();
		heroImage.onload = onHeroImageLoaded;
		heroImage.src = "../../../../assets/images/herosprite.png";
		console.log("hero is added");
	}

	function onHeroImageLoaded()
	{
		var options = {image: heroImage, canvas: canvas, context: rectangle, animation: true, loop: true};
		hero = spriteController(options);

		_loadBullet();
	}

	var bulletImage;

	function _loadBullet()
	{
		bulletImage = new Image();
		bulletImage.onload = onBulletImageLoaded;
		bulletImage.src = "../../../../assets/images/bullet.png";

		console.log("bullet image is added");
	}

	var bulletPool;

	function onBulletImageLoaded()
	{
		bulletPool = bulletPoolControl();

		_loadSight();
	}

	var sightImage;

	function _loadSight()
	{
		sightImage = new Image();
		sightImage.onload = onSightImageLoaded;
		sightImage.src = "../../../../assets/images/sight.png";

		console.log("sight image is added");
	}

	var sight;

	function onSightImageLoaded()
	{
		var options = {image: sightImage, canvas: canvas, context: rectangle,  obj:hero};
		sight = sightControl(options);

		_loadSounds();
	}

	function _addEventListeners()
	{
		hero.addListeners();
		hero.onClick = onHeroClick;
		console.log("key listeners are added");
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
		cancelRequestAnimationFrame(_update());
		console.log("render loop is stoped");
	}

	var then = Date.now();
	var counter = 0;
	var fps = 0;

	function _update()
	{
		//const velocity logics
		var now = Date.now();
		var delta = now - then;
		var modifier = delta / 1000;
		then = now;

		//update
		hero.update(modifier);
		bulletPool.update(modifier);
		sight.update();
		///////////

		//render
		rectangle.drawImage(backGroundImage, 0, 0);
		bulletPool.render();
		hero.render();
		sight.render();
		///////////

		// FPS///////////
		if (counter % 10 == 0)
			fps = 1000 / delta;

		rectangle.fillStyle = "rgb(250, 0, 0)";
		rectangle.font = "12px Helvetica";
		rectangle.textAlign = "left";
		rectangle.textBaseline = "top";
		rectangle.fillText("fps: " + fps.toPrecision(4), 10, 10);
		counter ++;
		////////////////////

		if(_rendering)
			requestAnimationFrame(_update);
	}

	function spriteController(options)
	{
		var that = {},
			keysDown = {},
			deltaX, deltaY,
			tickCount = 0, ticksPerFrame = 3,
			numberOfFrames = options.numberOfFrames || 5;

		that.x = 300;
		that.y = 250;
		that.width = options.width || 128;
		that.height = options.height || 128;
		that.loop = options.loop || false;
		that.animation = options.animation || false;
		that.frameIndex = 0;
		that.speed = 256;
		that.speedX = 0;
		that.speedY = 0;
		that.multipleX = 0.5;
		that.multipleY = 0.5;
		that.rotation = 0;
		that.friction = 0.96;
		that.mouseX = 0;
		that.mouseY = 0;

		that.imageLoaded = false;

		that.onClick = function()
		{
			console.log("override click handler");
		};

		that.image = options.image;
		that.canvas = options.canvas;
		that.context = options.context;

		that.addListeners = function()
		{
			addEventListener("keydown", function (event){ keysDown[event.keyCode] = true }, false);
			addEventListener("keyup", function (event){ delete keysDown[event.keyCode] }, false);
			that.canvas.addEventListener("mousemove", onMouseMove, false);
			that.canvas.addEventListener("click", onClick, false);
		};

		function onMouseMove(event)
		{
			if(event.offsetX)
			{
				that.mouseX = event.offsetX;
				that.mouseY = event.offsetY;
			}
			else if(event.layerX)
			{
				that.mouseX = event.layerX;
				that.mouseY = event.layerY;
			}
		}

		function onClick()
		{
			that.onClick();
		}

		that.update = function(modifier)
		{
			//Movement logics
			//////////////////////////
			if (38 in keysDown || 87 in keysDown)
				that.speedY = - that.speed * modifier;

			if (40 in keysDown || 83 in keysDown)
				that.speedY = that.speed * modifier;

			if (37 in keysDown || 65 in keysDown)
				that.speedX = - that.speed * modifier;

			if (39 in keysDown || 68 in keysDown)
				that.speedX = that.speed * modifier;

			that.x += that.speedX;
			that.y += that.speedY;

			///bounds
			if (that.x > that.canvas.width)
				that.x = that.canvas.width;
			if (that.x < 0)
				that.x = 0;
			if (that.y > that.canvas.height)
				that.y = that.canvas.height;
			if (that.y < 0)
				that.y = 0;


			that.speedX *= that.friction;
			that.speedY *= that.friction;
			////////////////////////////

			//Rotation logics
			///////////////////////////
			deltaX = that.mouseX - that.x;
			deltaY = that.mouseY - that.y;
			that.rotation = - Math.atan2(deltaX, deltaY) + Math.PI;

			//Sprite animation logics
			if(!that.animation)
				return;

			tickCount += 1;

			if (tickCount > ticksPerFrame)
			{
				tickCount = 0;

				if (that.frameIndex < numberOfFrames - 1)
					that.frameIndex += 1;
				else if	(that.loop)
					that.frameIndex = 0;
			}
		};

		that.render= function()
		{
			that.context.save();
			that.context.translate(that.x, hero.y);
			that.context.rotate(that.rotation);

			that.context.drawImage(
				that.image,
				that.frameIndex * that.image.width / numberOfFrames,
				0,
				that.width,
				that.height,
				- that.width >> 1,
				- that.width >> 1,
				that.width,
				that.height);

			that.context.restore();
		};


		return that;
	}

	function sightControl(options)
	{
		var that = {};

		that.image = options.image;
		that.canvas = options.canvas;
		that.context = options.context;

		that.obj = options.obj;

		that.x = options.obj.mouseX;
		that.y = options.obj.mouseY;

		that.update = function()
		{
			that.x = that.obj.mouseX;
			that.y = that.obj.mouseY;
		};

		that.render = function()
		{
			that.context.save();
			that.context.translate(that.x, that.y);

			that.context.drawImage(
				that.image,
				0,
				0,
				that.image.width,
				that.image.height,
				- that.image.width >> 1,
				- that.image.height >> 1,
				that.image.width,
				that.image.height);

			that.context.restore();
		};

		return that;
	}

	function bulletControl(options)
	{
		var that = {};

		that.active = true;

		that.image = options.image;
		that.canvas = options.canvas;
		that.context = options.context;
		that.rotation = options.owner.rotation;
		that.phaseX = Math.cos(that.rotation - Math.PI * .5);
		that.phaseY = Math.sin(that.rotation - Math.PI * .5);
		that.speed = 384;
		that.x = options.owner.x + options.owner.width * .1 * that.phaseX;
		that.y = options.owner.y + options.owner.height * .1 * that.phaseY;
		that.speedX = that.speed * that.phaseX;
		that.speedY = that.speed * that.phaseY;

		that.update = function(modifier)
		{
			that.x += that.speedX * modifier;
			that.y += that.speedY * modifier;


			if (that.x < - that.image.height
				|| that.x > that.canvas.width + that.image.height
				|| that.y < - that.image.height
				|| that.y > that.canvas.height)
				that.active = false;
		};

		that.render = function()
		{
			that.context.save();
			that.context.translate(that.x, that.y);
			that.context.rotate(that.rotation);
			that.context.drawImage(
				that.image,
				0,
				0,
				that.image.width,
				that.image.height,
				- that.image.width >> 1,
				- that.image.height >> 1,
				that.image.width,
				that.image.height);

			that.context.restore();
		};

		return that;
	}

	function bulletPoolControl()
	{
		var that = {},
			index,
			bullet,
			bulletList = [];

		that.add = function(bullet)
		{
			bulletList.push(bullet);
		};

		that.update = function(modifier)
		{
			for (index = 0; index < bulletList.length; index ++)
			{
				bullet = bulletList[index];
				if (bullet.active)
					bullet.update(modifier);
				else
				{
					bulletList.splice(index, 1);
				}
			}
		};

		that.render = function()
		{
			for (index = 0; index < bulletList.length; index ++)
			{
				bullet = bulletList[index];
				if (bullet.active)
					bullet.render();
			}
		};

		return that;
	}

	function onHeroClick()
	{
		addBullet();

		shootSound.currentTime = 0;
		shootSound.play();
	}

	function addBullet()
	{
		var options = {image: bulletImage, canvas: canvas, context: rectangle,  owner:hero};
		var bullet = bulletControl(options);
		bulletPool.add(bullet);
	}

	var requestAnimationFrame = window.requestAnimationFrame
								|| window.webkitRequestAnimationFrame
								|| window.msRequestAnimationFrame
								|| window.mozRequestAnimationFrame;

	var cancelRequestAnimationFrame = window.cancelRequestAnimationFrame
									|| window.webkitCancelRequestAnimationFrame
									|| window.mozCancelRequestAnimationFrame
									|| window.oCancelRequestAnimationFrame
									|| window.msCancelRequestAnimationFrame;

	return {initialize : _initialize};

})();