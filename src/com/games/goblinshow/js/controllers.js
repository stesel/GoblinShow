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

    this.targetPool = options.targetPool || [];

    var targetIndex = 0, target,
        deltaX, deltaY;

    this.update = function (modifier) {
        this.x += this.speedX * modifier;
        this.y += this.speedY * modifier;

        if (this.x < -this.image.height
            || this.x > this.canvas.width + this.image.height
            || this.y < -this.image.height
            || this.y > this.canvas.height)
            this.active = false;

        for ( targetIndex = 0; targetIndex < this.targetPool.length; targetIndex ++)
        {
            target = this.targetPool[targetIndex];

            deltaX = Math.abs(this.x - target.x);
            deltaY = Math.abs(this.y - target.y);

            if(deltaX < target.width/4 && deltaY < target.height/4)
            {
                this.active = false;
                target.damage();
            }
        }
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
            if (bullet.active) {
                bullet.update(modifier);
            }
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
        numberOfFrames = options.numberOfFrames || 5,
        life;

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

    that.active = true;

    life = options.life || 3;

    that.addListeners = function()
    {
        addEventListener("keydown", function (event){ keysDown[event.keyCode] = true }, false);
        addEventListener("keyup", function (event){ delete keysDown[event.keyCode] }, false);
        that.canvas.addEventListener("mousemove", onMouseMove, false);
        that.canvas.addEventListener("click", onClick, false);
    };

    that.removeListeners = function()
    {
        that.canvas.removeEventListener("mousemove", onMouseMove, false);
        that.canvas.removeEventListener("click", onClick, false);

        that.onHeroClick = function(){};
    }
	
	function onClick(e)
	{
		 that.onHeroClick();
	}

    that.onHeroClick = function()
    {
        console.log("override click handler");
    };

    that.onHeroDead = function()
    {
        console.log("override dead handler");
    };

    that.onHeroOuch = function()
    {
        console.log("override dead handler");
    };

    function onMouseMove(event)
    {
        if(!that.active)return;
        
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
        if(!that.active) return;
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
        if(!that.animation || that.confused)
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

    that.damage = function(speedX,speedY)
    {
        if(!that.active || that.confused) return;

        that.confused = true;

        that.speedX += speedX;
        that.speedY += speedY;

        life--;

        if(life < 1)
        {
            that.onHeroDead();
            that.active = false;
        }
        else
        {
            that.onHeroOuch();
            setTimeout(function(){that.confused = false}, 3000);
        }
    };

    that.render = function()
    {
        if(!that.active) return;

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

        Object.defineProperty(that, "life", {
            get: function() {
                return life;
            }});

    return that;
}

function EnemyControl(options)
{
    var that = {},
        deltaX, deltaY,
        speedX, speedY,
        target;

    that.numberOfFrames = options.numberOfFrames || 5;

    that.speed = options.speed || 2.7;

    that.image = options.image;
    that.canvas = options.canvas;
    that.context = options.context;

    that.width = options.width || 128;
    that.height = options.height || 128;
    that.loop = options.loop || false;
    that.animation = options.animation || false;

    target = options.target || {x:0, y:0};

    that.tickCount = 0;
    that.ticksPerFrame = 3;

    that.active = true;

    setPosition();

    function setPosition()
    {
        var index = Math.floor(Math.random() * 4);

        switch (index)
        {
            case 1:
                that.rotation = 0;
                that.x = that.width / 2 + Math.random() * (that.canvas.width - that.width / 2);
                that.y = that.canvas.height + that.height / 2;
                break;
            case 2:
                that.rotation = Math.PI / 2;
                that.x = - that.width / 2;
                that.y = that.height / 2 + Math.random() * (that.canvas.height - that.height / 2);
                break;
            case 3:
                that.rotation = Math.PI;
                that.x = that.width / 2 + Math.random() * (that.canvas.width - that.width / 2);
                that.y = - that.height / 2;
                break;
            case 0:
            default:
                that.rotation = - Math.PI / 2;
                that.x = that.canvas.width + that.width / 2;
                that.y = that.height / 2 + Math.random() * (that.canvas.height - that.height / 2);
                break;
        }

        that.phaseX = Math.cos(that.rotation - Math.PI * .5);
        that.phaseY = Math.sin(that.rotation - Math.PI * .5);
    }

    that.update = function(modifier)
    {
        if (that.y < - that.height/2
            || that.y > that.canvas.height + that.height/2
            || that.x < - that.width/2
            || that.x > that.canvas.width + that.width/2)
        {
            setPosition();
        }

        deltaX = Math.abs(target.x - that.x);
        deltaY = Math.abs(target.y - that.y);

        speedX = that.speed * that.phaseX;
        speedY = that.speed * that.phaseY;

        if (deltaX < target.width/4 && deltaY < target.height/4)
        {
            target.damage(speedX*2, speedY*2);
        }

        that.x += speedX;
        that.y += speedY;

        //Sprite animation logics
        if(!that.animation)
            return;

        that.tickCount += 1;

        if (that.tickCount > that.ticksPerFrame)
        {
            that.tickCount = 0;

            if (that.frameIndex < that.numberOfFrames - 1)
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
            that.frameIndex * that.image.width / that.numberOfFrames,
            0,
            that.width,
            that.height,
            - that.width >> 1,
            - that.width >> 1,
            that.width,
            that.height);

        that.context.restore();
    };

    that.damage = function()
    {
        that.active = false;
    };

    return that;
}

function EnemyPool(options)
{
    var that = {},
        index = 0,
        enemy,
        enemylist = [];

    that.count = options.count || 10;
    that.timeout = options.timeout || 1500;

    onTimeout();

    function onTimeout()
    {
        if(that.count >0)
        {
            enemy = new EnemyControl(options);
            enemylist.push(enemy);
            that.count--;
            setTimeout(onTimeout, that.timeout);
        }
    };

    that.update = function(modifier)
    {
        for (index = 0; index < enemylist.length; index ++)
        {
            enemy = enemylist[index];

            if (enemy.active)
                enemy.update(modifier);
            else
            {
                that.onEnemyDead(enemy);

                enemylist.splice(index, 1);
                if(enemylist.length < 1 && that.count < 1)
                    that.onEnemiesDead();
            }
        }
    };

    that.render = function()
    {
        for (index = 0; index < enemylist.length; index ++)
        {
            enemy = enemylist[index];

            if (enemy.active)
                enemy.render();
        }
    };

    Object.defineProperty(that, "enemylist", {
        get: function() {
            return enemylist;
        }});

    Object.defineProperty(that, "enemyCount", {
        get: function() {
            return enemylist.length + that.count;
        }});

    that.onEnemiesDead = function()
    {
        console.log("override dead handler");
    };

    that.onEnemyDead = function(enemy)
    {
        console.log("override dead handler");
    };

    return that;
}

function StainControl(options)
{
    var that = {};

    that.image = options.image;
    that.canvas = options.canvas;
    that.context = options.context;

    that.width = options.width || 128;
    that.height = options.height || 128;
    that.loop = options.loop || false;

    that.target = options.target || {x:0, y:0};

    that.tickCount = 0;
    that.ticksPerFrame = 3;
    that.numberOfFrames = options.numberOfFrames || 5;

    that.active = true;

    that.frameIndex = 0;

    that.update = function(modifier)
    {
        if(!that.active) return;

        //Sprite animation logics
        that.tickCount += 1;

        if (that.tickCount > that.ticksPerFrame)
        {
            that.tickCount = 0;

            if (that.frameIndex < that.numberOfFrames - 1)
                that.frameIndex += 1;
            else
                that.active = false;
        }

    };

    that.render = function()
    {
        that.context.save();
        that.context.translate(that.target.x, that.target.y);

        that.context.drawImage(
            that.image,
            that.frameIndex * that.image.width / that.numberOfFrames,
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

function StainPool()
{
    var that = {},
        index, stain,
        list = [];

    that.add = function(stain)
    {
        list.push(stain);
    };

    that.update = function(modifier)
    {
        for (index = 0; index < list.length; index ++)
        {
            stain = list[index];

            if (stain.active)
                stain.update(modifier);
            else
                list.splice(index, 1);
        }
    };

    that.render = function()
    {
        for (index = 0; index < list.length; index ++)
        {
            stain = list[index];

            if (stain.active)
                stain.render();
        }
    };

    return that;
}