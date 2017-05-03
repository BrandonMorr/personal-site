var camera, controls, scene, renderer, parent;

var cubes = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.z = 50;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.rotateSpeed   = 0.5;
  controls.zoomSpeed     = 1.0;
  controls.enablePan     = false;
  controls.maxDistance   = 60;
  controls.addEventListener('change', render);

  drawCubes();

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  for (var i = 0; i < cubes.length; i++) {
    cube = cubes[i];

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;
  }

  parent.rotation.x += 0.001;
  parent.rotation.y += 0.001;
  parent.rotation.z += 0.001;

  controls.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}

function drawCubes() {

  parent = new THREE.Object3D();

  for (var i = 0; i < 1000; i++) {
    var rand = Math.floor(Math.random() * (5 - 1) + 1);

    var geometry  = new THREE.BoxGeometry(rand, rand, rand);
    var material  = new THREE.MeshNormalMaterial();
    var cube      = new THREE.Mesh(geometry, material);

    cube.position.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    cube.rotation.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    cubes.push(cube);
    cube.updateMatrix();

    parent.add(cube);
  }

  scene.add(parent);
}
