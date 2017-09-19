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
  title.innerHTML = 'Brandon Morrissey';
  container.appendChild(title);

  const subTitle = document.createElement('div');
  subTitle.setAttribute('class', 'banner-subtitle');
  subTitle.innerHTML = 'Web Developer / Coffee Drinker / Creative Design';
  container.appendChild(subTitle);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

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
    -90, 0, 0,
    'Github',
    0xE0DFD5,
    parent,
    'Check out some of the things I\'m working on, just make sure to give everything a star :-)',
    'Click here for some code',
    'https://github.com/BrandonMorr'
  ));
  cubes.push(new Cube(
    -45, 0, 0,
    'Project Crazy 8 Smackdown',
    0xDB3069,
    parent,
    'My current pet project, a card game based on the popular crazy 8s. The goal is to support 4-player action with the help of Angular, Socket.io and Phaser. The project is currently in early design but follow the repository and stay tuned!',
    'View progress',
    'https://github.com/BrandonMorr/crazy-8-smackdown'
  ));
  cubes.push(new Cube(
    0, 0, 0,
    'About me',
    0x66D7D1,
    parent,
    'I\'m a web application developer currently residing in Charlottetown, Prince Edward Island.\nI aim to bring creativity and intuitive design to my work while ensuring efficiency.\nI also enjoy skateboarding, mother nature and singing in the shower. If you\'d like to say hi don\'t be shy!',
    'Click here to copy email',
    '#clickToCopyEmail'
  ));
  cubes.push(new Cube(
    45, 0, 0,
    'Another Project',
    0x2CF6B3,
    parent,
    'Probably a game where you save the world from drunk robot hotdogs...',
    'Link to this',
    '#whenItHappens'
  ));
  cubes.push(new Cube(
    90, 0, 0,
    'Nudes',
    0x8783D1,
    parent,
    '... just kidding, this will likely be a repository of all the goofy games I make over time that never end up seeing the light of day. Until then, it\'s an anchor link saying something interesting.',
    'Link to Grindr profile',
    '#somethingInteresting'
  ));

  scene.add(parent);

}

init();
animate();
