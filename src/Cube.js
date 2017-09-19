import * as THREE from 'three';
import * as TWEEN from 'es6-tween';

export default class Cube {
  /**
   * constructor
   */
  constructor(x, y, z, title, color, parent, information, linkText, linkHref) {

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load(`textures/${title}.png`);
    // const label    = new THREE.MeshBasicMaterial({map: texture});
    const geometry = new THREE.BoxGeometry(20, 15, 5);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.material.transparent = true;
    mesh.userData.clickable = true;
    mesh.updateMatrix();

    this.mesh = mesh;
    this.title = title;
    this.color = color;
    this.linkHref = linkHref;
    this.linkText = linkText;
    this.startingXpos = x;
    this.information = information;

    parent.add(mesh);

    this.fadeMesh('in', 1000);

  }

  /**
   * showDialogue
   * Display cube information to the user.
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
    link.innerHTML = this.linkText;
    link.href = this.linkHref;
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
      .easing(TWEEN.Easing.Elastic.InOut)
      .on('complete', () => {
        this.mesh.userData.clickable = true;
      })
      .start();

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
   * Creates a fade in/out effect for the Cube mesh.
   */
  fadeMesh(direction, options) {

    const current = { percentage: direction === 'in' ? 0 : 1 };
    const duration = options.duration || 1000;

    new TWEEN.Tween(current)
      .to({ percentage: direction === 'in' ? 1 : 0 }, duration)
      .easing(TWEEN.Easing.Linear.None)
      .on('start', () => {
        if (options.onStart) {
          options.onStart();
        }
      })
      .on('update', () => {
        this.mesh.material.opacity = 1 * current.percentage;
      })
      .on('complete', () => {
        if (options.onComplete) {
          options.onComplete();
        }
      })
      .start();

  }
}
