function Player(){
    this.velocity = new BABYLON.Vector3(0, -2.451, 0);
    this.thrust= 0.005;
    this.fuel = 1000;
};

//gonna have a function to call start();
function MyParticles(scene, shipDummy){
    this.particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);
    this.particleSystem.particleTexture = new BABYLON.Texture("square.png", scene);
    this.particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, 0); // Starting all From
    this.particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0); // To...
    this.particleSystem.minSize = 0.1;
    this.particleSystem.maxSize = 0.3;
    this.particleSystem.emitRate = 50;
    this.particleSystem.emitter = shipDummy;
    this.particleSystem.direction1 = new BABYLON.Vector3(-0.1, -1, 0);
    this.particleSystem.direction2 = new BABYLON.Vector3(0.1, -1, 0);        
    this.particleSystem.color1 = new BABYLON.Color4(1, 0.3, 0, 1.0);
    this.particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 0.5);
    this.particleSystem.minLifeTime = 0.3;
    this.particleSystem.maxLifeTime = 2.0;
    this.particleSystem.minEmitPower = 1;
    this.particleSystem.maxEmitPower = 3;
    this.particleSystem.updateSpeed = 0.05;
    this.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    this.start = function(){
        this.particleSystem.start();        
    }
    this.stop = function(){
        this.particleSystem.stop();            
    }
};

function MyTextBlock(text, color, fontSize, left, top, advancedTexture){
    this.block = new BABYLON.GUI.TextBlock();
    this.block.text = text;
    this.block.color = color;
    this.block.fontSize = fontSize;
    this.block.left = left;
    this.block.top = top;
    advancedTexture.addControl(this.block); 
    return this.block;
};

function calcGravity(from, to, massRelative, gravity, deltaTime){
    var distance = to.subtract(from);
    var rSquared = (distance.length() * distance.length());
    var force = ((gravity / rSquared) * massRelative) * deltaTime * 60;
    var gravForceVec = (BABYLON.Vector3.Normalize(distance)).multiplyByFloats(force, force, force);
    return gravForceVec;
};