/**
 * Created by Leo on 14.05.2015.
 */

function BaseControl(options)
{
    this.image = options.image;
    this.canvas = options.canvas;
    this.context = options.context;

    this.update = function (modifier) {
        console.log("Overide base update method");
    }

    this.render = function () {
        console.log("Overide base render method");
    }
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
    var keysDown = {},
        deltaX, deltaY,
        tickCount = 0, ticksPerFrame = 3,
        numberOfFrames = options.numberOfFrames || 5;

    this.x = 300;
    this.y = 250;
    this.width = options.width || 128;
    this.height = options.height || 128;
    this.loop = options.loop || false;
    this.animation = options.animation || false;
    this.frameIndex = 0;
    this.speed = 256;
    this.speedX = 0;
    this.speedY = 0;
    this.multipleX = 0.5;
    this.multipleY = 0.5;
    this.rotation = 0;
    this.friction = 0.96;
    this.mouseX = 0;
    this.mouseY = 0;

    this.imageLoaded = false;

    this.image = options.image;
    this.canvas = options.canvas;
    this.context = options.context;

    this.addListeners = function()
    {
        addEventListener("keydown", function (event){ keysDown[event.keyCode] = true }, false);
        addEventListener("keyup", function (event){ delete keysDown[event.keyCode] }, false);
        this.canvas.addEventListener("mousemove", onMouseMove, false);
        this.canvas.addEventListener("click", this.onHeroClick, false);
    };

    this.onHeroClick = function()
    {
        console.log("override click handler");
    };

    function onMouseMove(event)
    {
        if(event.offsetX)
        {
            this.mouseX = event.offsetX;
            this.mouseY = event.offsetY;
        }
        else if(event.layerX)
        {
            this.mouseX = event.layerX;
            this.mouseY = event.layerY;
        }
    }

    function _onClick()
    {
        onHeroClick();
    }

    this.update = function(modifier)
    {
        //Movement logics
        //////////////////////////
        if (38 in keysDown || 87 in keysDown)
            this.speedY = - this.speed * modifier;

        if (40 in keysDown || 83 in keysDown)
            this.speedY = this.speed * modifier;

        if (37 in keysDown || 65 in keysDown)
            this.speedX = - this.speed * modifier;

        if (39 in keysDown || 68 in keysDown)
            this.speedX = this.speed * modifier;

        this.x += this.speedX;
        this.y += this.speedY;

        ///bounds
        if (this.x > this.canvas.width)
            this.x = this.canvas.width;
        if (this.x < 0)
            this.x = 0;
        if (this.y > this.canvas.height)
            this.y = this.canvas.height;
        if (this.y < 0)
            this.y = 0;


        this.speedX *= this.friction;
        this.speedY *= this.friction;
        ////////////////////////////

        //Rotation logics
        ///////////////////////////
        deltaX = this.mouseX - this.x;
        deltaY = this.mouseY - this.y;
        this.rotation = - Math.atan2(deltaX, deltaY) + Math.PI;

        //Sprite animation logics
        if(!this.animation)
            return;

        tickCount += 1;

        if (tickCount > ticksPerFrame)
        {
            tickCount = 0;

            if (this.frameIndex < numberOfFrames - 1)
                this.frameIndex += 1;
            else if	(this.loop)
                this.frameIndex = 0;
        }
    };

    this.render = function()
    {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.rotation);

        this.context.drawImage(
            this.image,
            this.frameIndex * this.image.width / numberOfFrames,
            0,
            this.width,
            this.height,
            - this.width >> 1,
            - this.width >> 1,
            this.width,
            this.height);

        this.context.restore();
    };


    return this;
}