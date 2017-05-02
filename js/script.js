var camera, controls, scene, renderer;

var cubes;

// make the things happen.
init();
animate();

function init() {
  scene     = new THREE.Scene();
  scene.background = new THREE.Color('white');

  renderer  = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera    = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.z = 50;

  controls  = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.maxDistance = 60;

  drawCubes();

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  cubes.rotation.x += 0.001;
  cubes.rotation.y -= 0.001;
  cubes.rotation.z -= 0.001;

  render();
}

// render loop.
function render() {
  renderer.render(scene, camera);
}

function drawCubes() {
  cubes = new THREE.Group();
  scene.add(cubes);

  for (var i = 0; i < 1000; i++) {
    var rand = Math.floor(Math.random() * (5 - 1) + 1);

    var geometry  = new THREE.BoxGeometry(rand, rand, rand);
    var material  = new THREE.MeshNormalMaterial();

    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    mesh.rotation.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;

    cubes.add(mesh);
  }
}
