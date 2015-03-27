/**
 * ...
 * @author Leo Trofymchuk
 */
	
var console = window.console || {log:function(message){}};

var canvas;
var rectangle;

var startX = 0;
var startY = 0;

var rWidth = 600;
var rHeight = 500;

var renderQueue = [];


function init()
{
	_drawRectangle();
}

function _drawRectangle()
{
	canvas = document.getElementById( "canvasLayer" );
	
	if (canvas)
	{
		console.log( "canvas is ready" );
	}
	
	canvas.width = 600;
	canvas.height = 500;
	
	rectangle = canvas.getContext( "2d" );
	
	var gradient = rectangle.createLinearGradient( startX,startY, rWidth, rHeight );
	gradient.addColorStop( 0,"red" );
	gradient.addColorStop( 1,"blue" );

	rectangle.fillStyle = gradient;
	rectangle.fillRect( startX,startY,rWidth,rHeight );

	console.log( "rectangle is drawn" );
}

function _addBackground()
{
	
}