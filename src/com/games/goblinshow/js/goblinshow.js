/**
 * ...
 * @author Leo Trofymchuk
 */
	
var console = window.console || {log:function(message){}};

var canvas;
var rectangle;
	
function drawRectangle()
{
	canvas = document.getElementById("myCanvas");
	
	if (canvas)
	{
		console.log("canvas is ready");
	}
	
	rectangle = canvas.getContext("2d");
	
	canvas.width = 200;
	canvas.height = 200;
	canvas.style.left = "100px";
	canvas.style.top = "100px";
	canvas.style.position = "absolute";
	
	
	rectangle.rect(20,20,150,100);
	rectangle.stroke();

	console.log("rectangle is drawn");
}