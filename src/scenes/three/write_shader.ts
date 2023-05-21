import * as THREE from "three";
import writeShaderFragment from "./shaders/write_shader.fragment.glsl?raw";
import networkVertex from "./shaders/network.vertex.glsl?raw";

const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    utime: { value: 0.0 },
    opacity: { value: 1.0 },
    color: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
    colorOpacity: { value: 0.0 },
    sinTimeOpacity: { value: 0.0 },
    scaledSinTimeOpacity: { value: 0.0 },
    mixTimeOpacity: { value: 0.0 },
    shiftCoord: { value: new THREE.Vector2(0.5, 0.5) },
    shiftedCoordOpacity: { value: 0.0 },
    uniformCoordOpacity: { value: 0.0 },
    uniformCoordLenOpacity: { value: 0.0 },
    resultOpacity: { value: 1.0 },
  },
  vertexShader: networkVertex,
  fragmentShader: writeShaderFragment,
  transparent: true,
  depthTest: true,
});

const threeScene = new THREE.Scene();
const plane = new THREE.PlaneGeometry();
const planeMesh = new THREE.Mesh(plane, planeMaterial);
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
  const uniforms = planeMesh.material.uniforms;
  uniforms.utime.value = 0.0;
  uniforms.opacity.value = 1.0;
  uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
  uniforms.colorOpacity.value = 0.0;
  uniforms.sinTimeOpacity.value = 0.0;
  uniforms.scaledSinTimeOpacity.value = 0.0;
  uniforms.mixTimeOpacity.value = 0.0;
  uniforms.shiftCoord.value = new THREE.Vector2(0.5, 0.5);
  uniforms.shiftedCoordOpacity.value = 0.0;
  uniforms.uniformCoordOpacity.value = 0.0;
  uniforms.uniformCoordLenOpacity.value = 0.0;
  uniforms.resultOpacity.value = 1.0;
}

export { threeScene, camera, orbit, setupScene, planeMesh };
