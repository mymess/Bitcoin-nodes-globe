var orbitControls, line;

$(function() {
	
	var stats = initStats();
	
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();
	
	//renderer.setClearColorHex(0xEEEEEE);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	var axes = new THREE.AxisHelper(20);
	scene.add(axes);
		
	//CONTROLS
	var controls = new function(){
		this.red = 255;
		this.green = 255;
		this.blue = 255;
		this.lat = 0;
		this.lon = 0;
	};
	
	var gui = new dat.GUI();
	gui.add( controls, 'red', 0, 255);
	gui.add( controls, 'green', 0, 255);
	gui.add( controls, 'blue', 0, 255);
	gui.add( controls, 'lat', -90, 90);
	gui.add( controls, 'lon', -180, 180);
	
	
	var earthRadius = 28;
	var sphereGeom   = new THREE.SphereGeometry(earthRadius, 30, 30)
	var texture = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg', {}, function() {
						renderer.render(scene);
					});
	var sphereMaterial  = new THREE.MeshLambertMaterial({map: texture});
	var sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
	
	sphere.position.x = 0;
	sphere.position.y = 0;
	sphere.position.z = 0;
	
	
	scene.add(sphere);
	
	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 30;
	camera.lookAt(scene.position);
	
	orbitControls = new THREE.OrbitControls(camera);
	
	

	displayNodes();		
	
	
	//LIGHT
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-40, 60, -10);
	scene.add(spotLight);
	
	scene.add(new THREE.AmbientLight(0xffffff));
	
	
	$("#webgl").append(renderer.domElement);
	renderer.render(scene, camera);
	
	
	var dirLight = new THREE.DirectionalLight(0xffffff);
	dirLight.position.set(10,10,10);
	scene.add(dirLight);
	
	
	renderScene();
	
	
	function displayNodes(){
		var nodes = nodesData["nodes"];
		var whiteMat = new THREE.LineBasicMaterial({
			color: 0xffffff
		});
		
		var r = earthRadius*1.1;
		for(var node in nodes){
			//console.log(node +"-->" +nodes[node]);
			var lat = nodes[node][8]*Math.PI/180.0;
			var lon = -nodes[node][9]*Math.PI/180.0;
			
			var lineGeom = new THREE.Geometry();
			lineGeom.vertices.push(
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( 0, 0, 30 )	
			);
			line = new THREE.Line( lineGeom, whiteMat );
			
			line.geometry.vertices[1].x  = r * Math.cos(lat)*Math.cos(lon);
			line.geometry.vertices[1].y  = r * Math.sin(lat);
			line.geometry.vertices[1].z  = r * Math.cos(lat)*Math.sin(lon);
			scene.add( line );
			
		}	
                
            
	}
	
	function renderScene(){	
		stats.update();
		//step += .04;
		//sphere.position.x = 20 + 10*Math.cos(step);
		//sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
		orbitControls.update();
				
		var r = 1.1*earthRadius;
		line.geometry.vertices[1].x  = r * Math.cos(controls.lat*Math.PI/180.0)*Math.cos(controls.lon*Math.PI/180.0);
		line.geometry.vertices[1].y  = r * Math.sin(controls.lat*Math.PI/180.0);
		line.geometry.vertices[1].z  = r * Math.cos(controls.lat*Math.PI/180.0)*Math.sin(controls.lon*Math.PI/180.0);
		line.geometry.verticesNeedUpdate = true; 
		
		
		sphere.material.color.setRGB(controls.red/255.0, controls.green/255.0, controls.blue/255.);
		requestAnimationFrame(renderScene);
		renderer.render(scene, camera);
		
	}
	
	function initStats(){
		var stats = new Stats();
		stats.setMode(0);		
		
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = 0;
		stats.domElement.style.top = 0;
		
		document.getElementById("stats").appendChild(stats.domElement);
		
		return stats;
	}
});
