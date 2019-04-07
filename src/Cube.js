import * as THREE from 'three';
import * as TWEEN from 'es6-tween';

export default class Cube {

  /**
   * constructor
   */
  constructor(position, scale, title, file, sceneColor, parent, information, linkText, linkHref) {

    const loader = new THREE.TextureLoader();

    let materials = [
       new THREE.MeshBasicMaterial({map: loader.load(`textures/${file}-2.png`), transparent: true}),
       new THREE.MeshBasicMaterial({map: loader.load(`textures/${file}-2.png`), transparent: true}),
       new THREE.MeshBasicMaterial({map: loader.load(`textures/${file}-2.png`), transparent: true}),
       new THREE.MeshBasicMaterial({map: loader.load(`textures/${file}-2.png`), transparent: true}),
       new THREE.MeshBasicMaterial({map: loader.load(`textures/${file}-1.png`), transparent: true}),
       new THREE.MeshBasicMaterial({map: loader.load(`textures/${file}-2.png`), transparent: true}),
    ];

    const geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);

    const mesh = new THREE.Mesh(geometry, materials);

    mesh.position.set(position.x, position.y, position.z);
    mesh.userData.clickable = true;
    mesh.updateMatrix();

    this.mesh = mesh;
    this.title = title;
    this.linkHref = linkHref;
    this.linkText = linkText;
    this.startingXpos = position.x;
    this.information = information;
    this.sceneColor = new THREE.Color(sceneColor);

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

    const helper = document.createElement('p');
    helper.setAttribute('class', 'helper-text');
    helper.innerHTML = 'click anywhere to go back';
    container.appendChild(helper);
  }

  /**
   * focusCube
   * Should be called when the user initally clicks on a cube.
   * @param camera - the camera object to use as a reference point.
   */
  focusCube(camera) {

    new TWEEN.Tween(this.mesh.position).to({
      x: camera.position.x - 20,
      y: -2,
      z: camera.position.z - 30 }, 2000)
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
   * fadeBackground
   * Fade the background color to the shaded color of the cube
   * OR fade back to default color (0.941).
   */
  fadeBackground(scene, direction) {

    new TWEEN.Tween(scene.background)
      .to({
        r: (direction === 'in') ? this.sceneColor.r : 0.000,
        g: (direction === 'in') ? this.sceneColor.g : 0.000,
        b: (direction === 'in') ? this.sceneColor.b : 0.000
      }, 1000)
      .easing(TWEEN.Easing.Quartic.In)
      .start();

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
        for (let materials of this.mesh.material) {
          materials.opacity = 1 * current.percentage;
        }
      })
      .on('complete', () => {
        if (options.onComplete) {
          options.onComplete();
        }
      })
      .start();

  }
}
