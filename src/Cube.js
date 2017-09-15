import * as THREE from 'three';
import * as TWEEN from 'es6-tween';

export default class Cube {
  /**
   * constructor
   */
  constructor(x, y, z, title, color, parent, information) {

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load(`textures/${title}.png`);
    // const label    = new THREE.MeshBasicMaterial({map: texture});
    const geometry = new THREE.BoxGeometry(20, 15, 5);
    const side = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, side);

    mesh.position.set(x, y, z);
    mesh.updateMatrix();

    this.mesh = mesh;
    this.title = title;
    this.color = color;
    this.startingXpos = x;
    this.information = information;

    parent.add(mesh);

    // Worry about this later...
    // this.fadeMesh(this.mesh, 'in', {
    //
    //   duration: 5000,
    //
    //   easing: TWEEN.Easing.Quintic.InOut,
    //
    //   callback: function onComplete() {
    //     console.log('Fade complete');
    //   }
    // });
  }

  /**
   * showDialogue
   * Display information to the user.
   */
  showDialogue() {

    const container = document.createElement('div');
    container.setAttribute('id', 'container');
    container.style.backgroundColor = `0x${this.color.toString(16)}`;
    container.style.top = `${window.innerHeight / 3}px`;
    container.style.left = `${window.innerWidth / 2}px`;
    document.body.appendChild(container);

    const title = document.createElement('h3');
    title.setAttribute('class', 'title');
    title.innerHTML = this.title;
    container.appendChild(title);

    const information = document.createElement('p');
    information.setAttribute('class', 'information');
    information.innerHTML = this.information;
    container.appendChild(information);

    const link = document.createElement('a');
    link.setAttribute('class', 'link');
    link.innerHTML = 'Click here for something';
    link.href = '#something';
    container.appendChild(link);

  }

  /**
   * focusCube
   * Should be called when the user initally clicks on a cube.
   * @param camera - the camera object to use as a reference point.
   */
  focusCube(camera) {

    new TWEEN.Tween(this.mesh.position).to({
      x: camera.position.x - 20,
      y: 0,
      z: camera.position.z - 25 }, 2000)
      .easing(TWEEN.Easing.Elastic.InOut).start();

    this.showDialogue();

  }

  /**
   * unfocusCube
   * Should be called when the user clicks on the cube to return
   * to cube selection. Should also remove dialogue shown.
   */
  unfocusCube() {

    new TWEEN.Tween(this.mesh.position).to({
      x: this.startingXpos,
      y: 0,
      z: 0 }, 3000)
      .easing(TWEEN.Easing.Elastic.Out).start();

    document.getElementById('container').remove();

  }

  /**
   * focusCube
   * Creates a fade in/out effect for the Cube object.
   * But... the callback isn't being detected? WTF...
   */
  fadeMesh(direction, options) {

    options = options || {};

    const current = { percentage: direction === 'in' ? 1 : 0 };
    const mats = this.mesh.material.materials ? this.mesh.material.materials : [this.mesh.material];
    const originals = this.mesh.userData.originalOpacities;
    const easing = options.easing || TWEEN.Easing.Linear.None;
    const duration = options.duration || 2000;

    new TWEEN.Tween(current)
      .to({ percentage: direction === 'in' ? 0 : 1 }, duration)
      .easing(easing)
      .onUpdate(function update() {
        for (const i = 0; i < mats.length; i + 1) {
          mats[i].opacity = originals[i] * current.percentage;
        }
      })
      .onComplete(function complete() {
        if(options.callback) {
          options.callback();
        }
      }).start();
  }
}
