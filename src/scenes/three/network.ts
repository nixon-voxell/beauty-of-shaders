import * as THREE from "three";
import networkFragment from "./shaders/network.fragment.glsl?raw";
import networkVertex from "./shaders/network.vertex.glsl?raw";

const networkMaterial = new THREE.ShaderMaterial({
  vertexShader: networkVertex,
  fragmentShader: networkFragment,
  transparent: true,
  depthTest: true,
});

const threeScene = new THREE.Scene();
const plane = new THREE.PlaneGeometry();
const planeMesh = new THREE.Mesh(plane, networkMaterial);
threeScene.add(planeMesh);

const camera = new THREE.PerspectiveCamera(90);
const orbit = new THREE.Group();
orbit.add(camera);
threeScene.add(orbit);

async function setupScene() {
  orbit.position.set(0, 0, 0);
  orbit.rotation.set(0, 0, 0);
  camera.rotation.set(0, 0, 0);
  camera.position.set(0, 0, 540);

  planeMesh.scale.set(1920.0, 1080.0, 1.0);

  // useScene().LifecycleEvents.onBeginRender.subscribe(apply);
}

export { threeScene, camera, orbit, setupScene };
