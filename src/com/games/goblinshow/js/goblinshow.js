/**
 * ...
 * @author Leo Trofymchuk
 */

var game = (function()
{
	var console = window.console || { log: function (message) {	} };

	var canvas;
	var rectangle;

	var startX = 0;
	var startY = 0;

	var rWidth = 600;
	var rHeight = 500;

	var renderQueue = [];


	function _initialize()
	{
		_drawRectangle();
		_addBackground();
	}

	function _drawRectangle()
	{
		canvas = document.getElementById("canvasLayer");

		if (canvas)
		{
			console.log("canvas is ready");
		}

		canvas.width = rWidth;
		canvas.height = rHeight;

		rectangle = canvas.getContext("2d");

		var gradient = rectangle.createLinearGradient(startX, startY, rWidth, rHeight);
		gradient.addColorStop(0, "red");
		gradient.addColorStop(1, "blue");

		rectangle.fillStyle = gradient;
		rectangle.fillRect(startX, startY, rWidth, rHeight);

		console.log("rectangle is drawn");
	}

	function _addBackground()
	{

	}

	return {initialize: _initialize};

})();