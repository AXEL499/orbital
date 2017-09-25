
window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvas");
    canvas.width= window.innerWidth;
    canvas.height=window.innerHeight;

    var engine = new BABYLON.Engine(canvas, true);

    var player = new Player();

    var moonVelocity = new BABYLON.Vector3(0, 2.451, 0);

    var gravity = 1;

    var timeLeft = 60;

    var fuelHighScore = 0;
    var timeHighScore = 0;

    var ringMaterial;
    var ringTimer = 10;
    var inRing = false;

    var music;
    var thruster;
    
    var particleSystem;
    var advancedTexture;

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        engine.enableOfflineSupport = false;
        scene.clearColor = new BABYLON.Color3.Black;

        //music and effects
        //music = new BABYLON.Sound("Music", "test.ogg", scene, null, { loop: true, autoplay: true });
        //music.setVolume(0.5);
        thruster = new BABYLON.Sound("Thruster", "rocketMain.ogg", scene);

        //textures/materials
        var earthMat = new BABYLON.StandardMaterial("material3", scene);
        earthMat.diffuseTexture = new BABYLON.Texture("Earth.jpg", scene);

        //planet/texturing
        var planet = BABYLON.MeshBuilder.CreateSphere("Planet", { diameter: 2, diameterX: 2 }, scene);//diameter 2
        planet.material = earthMat;
        planet.position = new BABYLON.Vector3.Zero();
        planet.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(270), BABYLON.Tools.ToRadians(180), 0);

        //ship dummy
        var ship = new BABYLON.Mesh("Ship", scene);
        ship.position = new BABYLON.Vector3(-10, 0, 0);

        BABYLON.SceneLoader.ImportMesh("","", "rocket.babylon", scene, 
        function(meshes){
            meshes.forEach(function(i){
                i.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(270), 0, 0);
                i.material = new BABYLON.StandardMaterial("heartMat", scene);
                i.material.diffuseColor = BABYLON.Color3.Random();
                i.parent = ship;
                i.scaling = new BABYLON.Vector3(0.15, 0.15,0.15);
                i.convertToFlatShadedMesh();
            });
        });

        particleSystem = new MyParticles(scene, ship);

        //moon dummy
        var moon = new BABYLON.Mesh("Moon", scene);
        moon.position = new BABYLON.Vector3(10, 0, 0);

        BABYLON.SceneLoader.ImportMesh("","", "moon2.babylon", scene, 
        function(meshes){
            meshes.forEach(function(i){
                i.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(270), 0, 0);
                i.material = new BABYLON.StandardMaterial("heartMat", scene);
                i.material.diffuseColor = BABYLON.Color3.Gray();
                //i.material.ambientColor = new BABYLON.Color3(1, 1, 1);
                //i.material.emissiveTexture  = new BABYLON.Texture("Checkerboard.jpg", scene);
                i.convertToFlatShadedMesh();
                i.parent = moon;
                i.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            });
        });

        var forwardBlock = new BABYLON.Mesh("ForwardBlock", scene);
        forwardBlock.parent = ship;
        forwardBlock.translate(new BABYLON.Vector3(0, 1, 0), 5, BABYLON.Space.WORLD);

        var ring = BABYLON.MeshBuilder.CreatePlane("ring", { width: 5, height: 5 }, scene);

        ringMaterial = new BABYLON.StandardMaterial("ringMaterial", scene);
        ringMaterial.diffuseTexture = new BABYLON.Texture("Ring.png", scene);
        ringMaterial.diffuseTexture.hasAlpha = true;//Have an alpha
        ringMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        ring.material = ringMaterial;
        ring.parent = moon;

        var camera = new BABYLON.FreeCamera("Cam1", new BABYLON.Vector3(0, 0, -30), scene);

        var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0, 0, 1), scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(0, 0, 0);

        scene.actionManager = new BABYLON.ActionManager(scene);

        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        return scene;
    }

    var scene = createScene();


    var timeLeftText = new MyTextBlock("", "white", 32, 0, 430, advancedTexture);
   
    var ringTimerText = new MyTextBlock("", "white", 60, 0, -100, advancedTexture);

    var fuelHighScoreText = new MyTextBlock("", "white", 24, 820, -450, advancedTexture);

    var timeHighScoreText = new MyTextBlock("", "white", 24, 820, -400, advancedTexture);

    var fuelLine = new BABYLON.GUI.Line();
    fuelLine.x1 = 475;
    fuelLine.y1 = 950;
    fuelLine.y2 = 950;
    fuelLine.lineWidth = 20;
    fuelLine.color = "green";
    advancedTexture.addControl(fuelLine);  

    var map = {}; //object for multiple key presses

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    engine.runRenderLoop(function () {
        canvas.width= window.innerWidth;
        canvas.height=window.innerHeight;

        var Ship = scene.getMeshByName("Ship");
        var ForwardBlock = scene.getMeshByName("ForwardBlock");
        var Planet = scene.getMeshByName("Planet");
        var Moon = scene.getMeshByName("Moon");
        var Light = scene.getLightByName("dirLight");
        var speedmodifier = 1;

        var deltaTime = (engine.getDeltaTime() / 1000);

        if (map["Shift"]) {
            speedmodifier = 5;
        }
        else
        {
            if (map["w"]) {
                if(player.fuel > 0){
                    var newVec = ForwardBlock.absolutePosition.subtract(Ship.position);
                    player.velocity = player.velocity.add(newVec.multiplyByFloats(player.thrust, player.thrust, player.thrust));
                    player.fuel -= (player.thrust * 40000 * deltaTime);
                    if(!thruster.isPlaying){
                        thruster.play();     
                        particleSystem.start();   
                    }
                }
                else{
                    player.fuel = 0;
                    thruster.pause();
                    particleSystem.stop();            
                }
            }
            else{
                thruster.pause();
                particleSystem.stop();
            }
            if (map["a"]) {
                Ship.rotation.z += (3 * deltaTime);
            }
            if (map["d"]) {
                Ship.rotation.z -= (3 * deltaTime);
            }
            if (map[" "]) {
                timeLeft = 0;
            }
        }

        for (var i = 0; i < speedmodifier; ++i) {
            //ring timer based on speed modifier
            ringTimer -= deltaTime;    

            //time ticks down faster if speeding up time
            if(!inRing){
                timeLeft -= deltaTime;                
            }

            //player gravity to planet
            player.velocity.addInPlace(calcGravity(Ship.position, Planet.position, 1, gravity, deltaTime));

            //player gravity to moon            
            player.velocity.addInPlace(calcGravity(Ship.position, Moon.position, 0.2, gravity, deltaTime));
            
            //moon gravity calculations
            moonVelocity.addInPlace(calcGravity(Moon.position, Planet.position, 1, gravity, deltaTime));

            //move ship based on velocity vector
            Ship.translate(BABYLON.Vector3.Normalize(player.velocity), player.velocity.length() * deltaTime, BABYLON.Space.WORLD);

            //move moon based on velocity vector
            Moon.translate(BABYLON.Vector3.Normalize(moonVelocity), moonVelocity.length() * deltaTime , BABYLON.Space.WORLD);

            //'tidal lock'
            Planet.rotate(BABYLON.Axis.Z, (0.04 * deltaTime * 60), BABYLON.Space.WORLD) ;
            Moon.rotate(BABYLON.Axis.Z, (0.0041 * deltaTime * 60), BABYLON.Space.WORLD);
        }

        timeLeftText.text = String("Time left: " + timeLeft.toFixed(2));
        fuelLine.x2 = 475 + (player.fuel / 1);            
        
        //deathcheck
        var screenWidth = 25.5;
        var screenHeight = 13;
        var planetDistance = Planet.position.subtract(Ship.position);
        var distance = Moon.position.subtract(Ship.position);        
        if (Ship.position.x < -screenWidth || Ship.position.x > screenWidth || Ship.position.y < -screenHeight || Ship.position.y > screenHeight || timeLeft <= 0 || ringTimer <= -10 || distance.length() <= 0.3 || planetDistance.length() <= 1) {
            player.velocity = new BABYLON.Vector3(0, -2.451, 0);
            Ship.position = new BABYLON.Vector3(-10, 0, 0);
            Ship.rotation = new BABYLON.Vector3.Zero();
            Moon.position = new BABYLON.Vector3(10, 0, 0);
            moonVelocity = new BABYLON.Vector3(0, 2.451, 0);
            thruster.pause();
            thruster.play();
            thruster.stop();

            var newFuelScore = (player.fuel / 1000) * 100;
            if(ringTimer <= -10){
                if(fuelHighScore < newFuelScore.toFixed(2)){
                    fuelHighScore = newFuelScore.toFixed(2);
                    fuelHighScoreText.text = String("Most fuel left: " + fuelHighScore + "%");
                }
                if(timeHighScore < timeLeft.toFixed(2)){
                    timeHighScore = timeLeft.toFixed(2);
                    timeHighScoreText.text = String("Most time left: " + timeHighScore);
                }
            }
            player.fuel = 1000;
            timeLeft = 60;
            ringTimer = 10;
        }

        if(distance.length() <= 2.5){
            inRing = true;

            ringTimerText.text = ringTimer.toFixed(2);

            if(ringTimer <= 0){
                ringMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);                  
            }
            else{
                ringMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);    
            }
        }
        else{
            ringTimerText.text = "";
            inRing = false;
            ringTimer = 10;
            ringMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        }

        var cam = scene.getCameraByName("Cam1");

        //cam following player
        // var newVec = Ship.position;
        // var zoomLevel = (Moon.position.subtract(Ship.position)).length();
        // newVec = newVec.add(new BABYLON.Vector3(0, 0, (-zoomLevel * 3)));
        // cam.position = newVec;

        scene.render();
    });
});
