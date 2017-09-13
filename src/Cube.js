import * as THREE from 'three';
import * as TWEEN from 'es6-tween';

export default class Cube {
  /**
   * constructor
   */
  constructor(x, y, z, name, color, parent) {

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load(`textures/${name}.png`);
    // const label    = new THREE.MeshBasicMaterial({map: texture});

    // this.x = x;
    // this.y = y;
    // this.z = z;
    this.name = name;
    this.color = color;
    this.startingXpos = x;

    const geometry = new THREE.BoxGeometry(20, 15, 5);
    const side = new THREE.MeshBasicMaterial({ color: this.color });
    const mesh = new THREE.Mesh(geometry, side);

    mesh.position.set(x, y, z);
    mesh.updateMatrix();

    this.mesh = mesh;

    parent.add(mesh);

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
    title.innerHTML = this.name;
    container.appendChild(title);

    const information = document.createElement('p');
    information.setAttribute('class', 'information');
    information.innerHTML = 'This is some dummy information';
    container.appendChild(information);

    const link = document.createElement('a');
    link.setAttribute('class', 'link');
    link.innerHTML = 'Click here for something?';
    link.href = 'http://jarredkenny.com';
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

}
