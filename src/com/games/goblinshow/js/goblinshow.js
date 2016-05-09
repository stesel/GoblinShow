/**
 * ...
 * @author Leo Trofymchuk
 */

var GoblinShow;

var game = (function()
{
	//var console = window.console || { log: function (message) {	} };
	//var console = { log : _log };

	//function _log(message)
	//{
	//	var logArea = document.getElementById("logArea");
	//	var text = document.createTextNode("\n" + message);
	//	logArea.appendChild(text);
	//	logArea.scrollTop = logArea.scrollHeight;
	//}

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

	var parallaxFactor = 0.02;

	var defaultBackgroundX;
	var defaultBackgroundY;

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
			console.log("canvas is ready: " + canvas.id);
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

	var backGroundImage;

	function _addBackground()
	{
		backGroundImage = new Image();
		backGroundImage.onload = function(){ _addHero(); };
		backGroundImage.src = "assets/images/background_parallax.jpg";

		console.log("background image is added");
	}

	var shootSound;

	function _loadSounds()
	{
		shootSound = new Audio();
		shootSound.addEventListener("canplaythrough", onAudioLoaded, false);
		shootSound.src = "assets/sounds/laser.mp3";
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
		defaultBackgroundX = (rWidth - backGroundImage.width) * .5;
		defaultBackgroundY = (rHeight - backGroundImage.height) * .5;

		heroImage = new Image();
		heroImage.onload = onHeroImageLoaded;
		heroImage.src = "assets/images/herosprite.png";
		console.log("hero is added");
	}

	var enemyImage;

	function _loadEnemy()
	{
		enemyImage = new Image();
		enemyImage.onload = onEnemyImageLoaded;
		enemyImage.src = "assets/images/enemysprite.png";
		console.log("enemy is added");
	}
	
	var enemyPool;
	
	function onEnemyImageLoaded() 
	{
		var options = {image: enemyImage, canvas: canvas, context: rectangle, animation: true, loop: true, x: canvas.width / 2, y: canvas.height, count: 12};
		enemyPool = new EnemyPool(options);
		
		_loadSounds();
	}

	function onHeroImageLoaded()
	{
		var options = {image: heroImage, canvas: canvas, context: rectangle, animation: true, loop: true};
		hero = new HeroControl(options);

		_loadBullet();
	}

	var bulletImage;

	function _loadBullet()
	{
		bulletImage = new Image();
		bulletImage.onload = onBulletImageLoaded;
		bulletImage.src = "assets/images/bullet.png";

		console.log("bullet image is added");
	}

	var bulletPool;

	function onBulletImageLoaded()
	{
		bulletPool = new BulletPoolControl();

		_loadSight();
	}

	var sightImage;

	function _loadSight()
	{
		sightImage = new Image();
		sightImage.onload = onSightImageLoaded;
		sightImage.src = "assets/images/sight.png";

		console.log("sight image is added");
	}

	var sight;

	function onSightImageLoaded()
	{
		var options = {image: sightImage, canvas: canvas, context: rectangle,  obj:hero};
		sight = new SightControl(options);
		sight.x = 40;
		console.log("sight.x: " + sight.x);

		_loadEnemy();
	}

	function _addEventListeners()
	{
		hero.addListeners();
		hero.onHeroClick = onHeroClick;
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
		enemyPool.update(modifier);
		bulletPool.update(modifier);
		sight.update();
		///////////

		//render
		rectangle.drawImage(backGroundImage,
							defaultBackgroundX + (rWidth *.5 - hero.x) * parallaxFactor,
							defaultBackgroundY + (rHeight *.5 - hero.y) * parallaxFactor);
		bulletPool.render();
		enemyPool.render();
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

	function onHeroClick()
	{
		addBullet();

		shootSound.currentTime = 0;
		shootSound.play();
	}

	function addBullet()
	{
		var options = {image: bulletImage, canvas: canvas, context: rectangle,  owner:hero};
		var bullet = new BulletControl(options);
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