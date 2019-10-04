import * as THREE from 'three';
import * as TWEEN from 'es6-tween';

import Cube from './Cube.js';

let camera;
let scene;
let renderer;
let parent;
let mouse;
let raycaster;

const cubes = [];

function render() {

  renderer.render(scene, camera);

}

function animate() {

  requestAnimationFrame(animate);

  TWEEN.update();

  for (const cube of cubes) {

    cube.mesh.rotation.x = Math.sin(Date.now() * 0.001) * Math.PI * 0.1;
    cube.mesh.rotation.y = Math.sin(Date.now() * 0.001) * Math.PI * 0.1;

  }

  render();

}

function onDocumentMouseDown(event) {

  event.preventDefault();

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  const hiddenCubes = [];

  let selectedCube;

  if (intersects.length > 0) {

    for (const cube of cubes) {

      if (cube.mesh.uuid === intersects[0].object.uuid) {

        selectedCube = cube;

      }
      else {

        hiddenCubes.push(cube);

      }
    }

    if (selectedCube.mesh.userData.clickable) {

      if (Math.floor(selectedCube.mesh.position.z) < 5) {

        selectedCube.mesh.userData.clickable = false;

        selectedCube.focusCube(camera);
        selectedCube.fadeBackground(scene, 'in');

        for (const hiddenCube of hiddenCubes) {

          hiddenCube.mesh.userData.clickable = false;

          hiddenCube.fadeMesh('out', {
            duration: 1000,
            onComplete: () => {
              hiddenCube.mesh.visible = false;
            }
          });
        }

      }
      else {

        selectedCube.unfocusCube();
        selectedCube.fadeBackground(scene, 'out');

        for (const hiddenCube of hiddenCubes) {

          hiddenCube.mesh.userData.clickable = true;

          hiddenCube.fadeMesh('in', {
            duration: 1000,
            onStart: () => {
              hiddenCube.mesh.visible = true;
            }
          });
        }
      }
    }
  }
}

function onDocumentTouchDown(event) {

  event.preventDefault();

  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;

  onDocumentMouseDown(event);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function init() {

  const container = document.createElement('div');
  container.setAttribute('class', 'banner');
  document.body.appendChild(container);

  const title = document.createElement('div');
  title.setAttribute('class', 'banner-title');
  title.innerHTML = 'Hi, my name is Brandon';
  container.appendChild(title);

  const subTitle = document.createElement('div');
  subTitle.setAttribute('class', 'banner-subtitle');
  subTitle.innerHTML = "☆ I'm a web developer / wannabe designer ☆";
  container.appendChild(subTitle);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.z = 70;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentTouchDown, false);
  window.addEventListener('resize', onWindowResize, false);

  parent = new THREE.Object3D();

  cubes.push(new Cube(
    {x: -75, y: 0, z: 0},
    {x: 30, y: 30, z: 0},
    'Github',
    'git',
    0x000000,
    parent,
    'Take a gander at some of my published code on Github ( ͡° ͜ʖ ͡°)',
    'click here for some code',
    'https://github.com/BrandonMorr'
  ));
  cubes.push(new Cube(
    {x: 0, y: 0, z: 0},
    {x: 30, y: 35, z: 0.1},
    'Project Crazy 8 Smackdown',
    'crazy8',
    0x000000,
    parent,
    'You ever hear of Crazy 8s? This is an enhanced & more grusome version of the classic you know n\' love. Coming SOON to a web browser near you',
    'click here to see progress',
    'https://github.com/BrandonMorr/crazy-8-smackdown'
  ));
  cubes.push(new Cube(
    {x: 75, y: 0, z: 0},
    {x: 30, y: 32, z: 0.1},
    'About me',
    'about',
    0x000000,
    parent,
    'I\'m a web application developer living in Charlottetown, Prince Edward (pogey) Island. I enjoy video game design, web app development, and salt n\' vinegar chips. I skateboard when there\'s no snow, and cry when there\'s snow. If you\'d like to say hi feel free to reach out :-)',
    'click here to copy email',
    '#clickToCopyEmail'
  ));

  scene.add(parent);

}

init();
animate();
