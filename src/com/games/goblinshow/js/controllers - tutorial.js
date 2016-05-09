/**
 * Created by Leo on 14.05.2015.
 */
 
 (function (App) {
	 
	 App.BaseControl = IObject.clone();
	 
	 App.BaseControl.init = function () {
		 this.image = options.image;
		 // ...
	 };
	 
	 App.BaseControl.update = function () {
		 // ...
	 };
	 
	 
 }(window.App || window.App = {}));
 
 // base-control.js
 (function (App) {
	 
	 App.BaseControl = BaseControl;
	 
	 function BaseControl() {
		 this.image = options.image;
		 // ...
	 };
	 
	 BaseControl.prototype.update = function () {
		 // ...
	 };
	 
	 
 }(window.App || window.App = {}));
 
 // character.js
 (function (App) {
	 
	 App.Character = function Character() {
		 App.BaseControl.call(this);
		 this.name = options.name;
		 // ...
	 };
	 
	 App.Character.prototype.update = function () {
		 // ...
	 };
	 
	 
	 
 }(window.App || window.App = {}));

function BaseControl(options) {
    this.image = options.image;
    this.canvas = options.canvas;
    this.context = options.context;
}

BaseControl.prototype.update = function () {
	console.log("Overide base update method");
};

BaseControl.prototype.render = function () {
	console.log("Overide base render method");
};

BaseControl.init = function () {
	this.
};
BaseControl.update = function () {
};

baseControl.

// extends
Character.prototype = Object.create(BaseControl.prototype);
Character.prototype.constructor = Character;

function Character(options) {
	BaseControl.call(this, options);
	
	this.name = options.name;
}

var _update = Character.prototype.update;
Character.prototype.update = function () {
	_update.call(this);
	BaseControl.prototype.update();
};

Character.prototype.run = function () {
	// TODO: run
};

function createBaseControl(options) {
	// extends
	var self = {};
	
	// Private
	var privateProp = "Test 2";
	
	// Public
	self.prop = "Test 1";
	
	self.method = function () {
		// ...
	};
	
	return self;
}

function createCharacter(options) {
	// extends
	var self = createBaseControl(options);
	
	// override
	var _method = self.method;
	self.method = function () {
		_method();
		// ...
	};
	
	self.method2 = function () {
	};
	
	return self;
}

//BulletControl.prototype = Object.create(BaseControl.prototype);
//BulletControl.prototype.constructor = BulletControl.constructor;

function BulletControl(options)
{
    this.prototype = BaseControl.prototype;

    this.active = true;

    this.image = options.image;
    this.canvas = options.canvas;
    this.context = options.context;

    this.rotation = options.owner.rotation;
    this.phaseX = Math.cos(this.rotation - Math.PI * .5);
    this.phaseY = Math.sin(this.rotation - Math.PI * .5);
    this.speed = 384;
    this.x = options.owner.x + options.owner.width * .1 * this.phaseX;
    this.y = options.owner.y + options.owner.height * .1 * this.phaseY;
    this.speedX = this.speed * this.phaseX;
    this.speedY = this.speed * this.phaseY;

    this.update = function (modifier) {
        this.x += this.speedX * modifier;
        this.y += this.speedY * modifier;


        if (this.x < -this.image.height
            || this.x > this.canvas.width + this.image.height
            || this.y < -this.image.height
            || this.y > this.canvas.height)
            this.active = false;
    };

    this.render = function () {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.rotation);
        this.context.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            -this.image.width >> 1,
            -this.image.height >> 1,
            this.image.width,
            this.image.height);

        this.context.restore();
    };
}

function BulletPoolControl()
{
    var index,
        bullet,
        bulletList = [];

    this.add = function(bullet)
    {
        bulletList.push(bullet);
    };

    this.update = function(modifier)
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

    this.render = function()
    {
        for (index = 0; index < bulletList.length; index ++)
        {
            bullet = bulletList[index];
            if (bullet.active)
                bullet.render();
        }
    };
}

function SightControl(options)
{
    this.image = options.image;
    this.canvas = options.canvas;
    this.context = options.context;

    this.obj = options.obj;

    this.x = options.obj.mouseX;
    this.y = options.obj.mouseY;

    this.update = function()
    {
        this.x = this.obj.mouseX;
        this.y = this.obj.mouseY;
    };

    this.render = function()
    {
        this.context.save();
        this.context.translate(this.x, this.y);

        this.context.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            - this.image.width >> 1,
            - this.image.height >> 1,
            this.image.width,
            this.image.height);

        this.context.restore();
    };
}

function HeroControl(options)
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
	
	function onClick(e)
	{
		 that.onHeroClick();
	}

    that.onHeroClick = function()
    {
        console.log("override click handler");
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

    function _onClick()
    {
        onHeroClick();
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

    that.render = function()
    {
        that.context.save();
        that.context.translate(that.x, that.y);
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