
window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvas");
    canvas.width= window.innerWidth;
    canvas.height=window.innerHeight;

    var engine = new BABYLON.Engine(canvas, true);

    var advancedTexture;
    
    var particleSystem;

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        engine.enableOfflineSupport = false;
        scene.clearColor = new BABYLON.Color3.Black;


        //particles
        particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);
        particleSystem.particleTexture = new BABYLON.Texture("square.png", scene);
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, 0); // Starting all From
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0); // To...
        particleSystem.minSize = 0.02;
        particleSystem.maxSize = 1.1;
        particleSystem.emitRate = 50;
        particleSystem.emitter = new BABYLON.Vector3(-10, 8, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-0.1, -1, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0.1, -1, 0);        
        particleSystem.color1 = new BABYLON.Color4(1, 0.3, 0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 0.5);
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 10.5;
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.05;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.start();

        var camera = new BABYLON.FreeCamera("Cam1", new BABYLON.Vector3(0, 0, -30), scene);

        var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0, 0, 1), scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(0, 0, 0);

        scene.actionManager = new BABYLON.ActionManager(scene);

        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        return scene;
    }

    var scene = createScene();

    
    

  



    engine.runRenderLoop(function () {
        canvas.width= window.innerWidth;
        canvas.height=window.innerHeight;




        scene.render();
    });
});
