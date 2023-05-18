import { all, loop, waitFor } from "@motion-canvas/core/lib/flow";
import { ThreadGenerator } from "@motion-canvas/core/lib/threading";
import * as THREE from "three";
import networkFragment from "./shaders/network.fragment.glsl?raw";
import networkVertex from "./shaders/network.vertex.glsl?raw";

const networkMaterial = new THREE.ShaderMaterial({
  uniforms: {
    utime: { value: 0.0 },
    opacity: { value: 1.0 }
  },
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

function setupScene() {
  orbit.position.set(0, 0, 0);
  orbit.rotation.set(0, 0, 0);
  camera.rotation.set(0, 0, 0);
  camera.position.set(0, 0, 540);

  planeMesh.scale.set(1920.0, 1080.0, 1.0);
  planeMesh.material.uniforms.utime.value = 0.0;
  planeMesh.material.uniforms.opacity.value = 1.0;
}

export { threeScene, camera, orbit, setupScene, planeMesh };
