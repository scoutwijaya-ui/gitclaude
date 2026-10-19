// mg3d.js — three.js helpers for cinematic product shots, driven by the MG timeline.
//
//   import * as THREE from 'three';
//   import { createStage, loadGLB, imageProduct, CameraRig, dust, contactShadow } from './runtime/mg3d.js';
//
// Everything here is deterministic: animate rig/product properties with MG.tl tweens,
// and the stage renders once per frame through MG.onFrame.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { MG } from './mg.js';

/**
 * Create a renderer + scene + camera that fills the composition and renders every frame.
 * opts: canvas (element or selector), fov, exposure, background (css color or null for transparent),
 *       envIntensity, bloom: { strength, radius, threshold } or false, shadows (bool)
 */
export function createStage(opts = {}) {
  const { width, height } = MG.cfg;
  const canvas = typeof opts.canvas === 'string' ? document.querySelector(opts.canvas) : opts.canvas;
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: opts.background == null, preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.0;
  if (opts.shadows !== false) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  const scene = new THREE.Scene();
  if (opts.background != null) scene.background = new THREE.Color(opts.background);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = opts.envIntensity ?? 0.6;

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 30, width / height, 0.01, 200);

  let composer = null;
  if (opts.bloom) {
    composer = new EffectComposer(renderer);
    composer.setPixelRatio(1);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const b = opts.bloom;
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), b.strength ?? 0.6, b.radius ?? 0.5, b.threshold ?? 0.85));
    composer.addPass(new OutputPass());
  }

  const stage = {
    renderer, scene, camera, composer,
    before: [],                 // fn(t) run before render (rigs, particles)
    render() { composer ? composer.render() : renderer.render(scene, camera); },
  };
  MG.onFrame((t, f) => { for (const fn of stage.before) fn(t, f); stage.render(); });
  return stage;
}

/** Classic 3-point product lighting with a strong rim. Returns the lights for animation. */
export function productLights(scene, { key = 2.2, rim = 3.0, fill = 0.35, warm = '#ffe7c7', cool = '#cfe3ff' } = {}) {
  const k = new THREE.DirectionalLight(warm, key);
  k.position.set(2.5, 3.5, 3);
  k.castShadow = true;
  k.shadow.mapSize.set(2048, 2048);
  k.shadow.camera.near = 0.5; k.shadow.camera.far = 15;
  k.shadow.camera.left = k.shadow.camera.bottom = -2; k.shadow.camera.right = k.shadow.camera.top = 2;
  k.shadow.radius = 6; k.shadow.bias = -0.0005;
  const r = new THREE.DirectionalLight(cool, rim);
  r.position.set(-3, 2.2, -3.5);
  const f = new THREE.HemisphereLight('#ffffff', '#202020', fill);
  scene.add(k, r, f);
  return { key: k, rim: r, fill: f };
}

/**
 * Load a GLB/GLTF, center it on the floor (y=0) and scale it so its height = `height`.
 * Returns a Group you can rotate/move. Meshes cast and receive shadows.
 */
export async function loadGLB(url, { height = 1, castShadow = true } = {}) {
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath('./node_modules/three/examples/jsm/libs/draco/gltf/');
  loader.setDRACOLoader(draco);
  const gltf = await loader.loadAsync(url);
  const model = gltf.scene;
  model.traverse((o) => {
    if (o.isMesh) { o.castShadow = castShadow; o.receiveShadow = true; }
  });
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const s = height / size.y;
  model.scale.setScalar(s);
  model.position.set(-center.x * s, -box.min.y * s, -center.z * s);
  const group = new THREE.Group();
  group.add(model);
  group.userData = { size: size.multiplyScalar(s), animations: gltf.animations, gltf };
  return group;
}

/**
 * Turn a product photo (PNG with transparent background) into a 2.5D object:
 * a lit plane with a moving specular "light sweep", a soft reflection and a contact shadow.
 * Animate `product.userData.sweep` (0 → 1) on the timeline to run the sweep across it.
 */
export async function imageProduct(url, { height = 1, reflection = 0.25, sweepColor = '#ffffff', sweepWidth = 0.18 } = {}) {
  const tex = await new THREE.TextureLoader().loadAsync(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const aspect = tex.image.width / tex.image.height;
  const geo = new THREE.PlaneGeometry(height * aspect, height);
  geo.translate(0, height / 2, 0);

  const uniforms = {
    map: { value: tex }, sweep: { value: -1 }, sweepColor: { value: new THREE.Color(sweepColor) },
    sweepWidth: { value: sweepWidth }, brightness: { value: 1 }, opacity: { value: 1 }, fade: { value: 0 },
  };
  const vert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
  const frag = `
    uniform sampler2D map; uniform float sweep, sweepWidth, brightness, opacity, fade; uniform vec3 sweepColor;
    varying vec2 vUv;
    void main(){
      vec4 c = texture2D(map, vUv);
      float d = (vUv.x + vUv.y * 0.6) - (sweep * 2.2 - 0.3);
      float s = smoothstep(sweepWidth, 0.0, abs(d)) * 0.55;
      vec3 col = c.rgb * brightness + sweepColor * s * c.a;
      float a = c.a * opacity;
      if (fade > 0.0) a *= 1.0 - smoothstep(0.0, fade, vUv.y);  // reflection fade-out from the floor line
      if (a < 0.01) discard;
      gl_FragColor = vec4(col, a);
      #include <colorspace_fragment>
    }`;
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag, transparent: true });
  const plane = new THREE.Mesh(geo, mat);

  const group = new THREE.Group();
  group.add(plane);

  if (reflection > 0) {
    const rUniforms = THREE.UniformsUtils.clone(uniforms);
    rUniforms.map.value = tex;
    rUniforms.opacity.value = reflection;
    rUniforms.fade.value = 0.45;
    const rMat = new THREE.ShaderMaterial({ uniforms: rUniforms, vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const refl = new THREE.Mesh(geo, rMat);
    refl.scale.y = -1;
    group.add(refl);
    group.userData.reflection = refl;
    MG.onFrame(() => { rUniforms.sweep.value = uniforms.sweep.value; rUniforms.brightness.value = uniforms.brightness.value; });
  }

  // Proxies so GSAP can tween plain properties: MG.tl.to(product.userData, { sweep: 1 })
  const ud = group.userData;
  Object.defineProperties(ud, {
    sweep: { get: () => uniforms.sweep.value, set: (v) => (uniforms.sweep.value = v), enumerable: true },
    brightness: { get: () => uniforms.brightness.value, set: (v) => (uniforms.brightness.value = v), enumerable: true },
    opacity: { get: () => uniforms.opacity.value, set: (v) => (uniforms.opacity.value = v), enumerable: true },
  });
  ud.size = new THREE.Vector3(height * aspect, height, 0);
  ud.plane = plane;
  return group;
}

/** Soft radial shadow under an object (works with any background, cheap). */
export function contactShadow(scene, { radius = 0.6, opacity = 0.55, y = 0.001 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(0,0,0,1)'); grd.addColorStop(0.5, 'rgba(0,0,0,0.45)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  scene.add(mesh);
  return mesh;
}

/**
 * Invisible floor that only catches shadows. Pair it with a transparent stage
 * (createStage({ background: null })) and a CSS gradient backdrop behind the canvas:
 * the product then sits on a seamless studio sweep with no horizon line.
 * Much cheaper than a lit PBR floor in software rendering.
 */
export function shadowFloor(scene, { opacity = 0.45, size = 20 } = {}) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  return floor;
}

/**
 * Camera rig with tweenable, film-language properties:
 *   angle (deg around Y), height, radius, targetY, fov, roll (deg), shakeAmp
 * MG.tl.to(rig, { angle: 120, radius: 2.2, duration: 4 }) → orbit + push-in.
 */
export class CameraRig {
  constructor(stage, { angle = 0, height = 0.6, radius = 3, targetX = 0, targetY = 0.5, targetZ = 0, fov, roll = 0, shakeAmp = 0 } = {}) {
    Object.assign(this, { angle, height, radius, targetX, targetY, targetZ, roll, shakeAmp });
    this.fov = fov ?? stage.camera.fov;
    this.camera = stage.camera;
    stage.before.push((t) => this.update(t));
  }
  /**
   * Framing math, so shots don't have to be guessed. Returns { radius, targetY, height } that make
   * `object` fill `fill` of the frame height with its vertical centre at `center` (0 = top edge,
   * 1 = bottom edge). Spread the result into a tween: tl.to(rig, { ...rig.framing(p, {fill:.45}), angle: 30 })
   *   fill .40–.55 = hero / wide shot with room for type below
   *   fill 1.2–2.0 = detail / macro (pair with `focusY` to aim at a part of the object, 0 = base, 1 = top)
   *   fillW: use instead of `fill` for wide products (shoes, cars, laptops) in a tall frame:
   *          fraction of the frame WIDTH the object should cover, e.g. 0.8
   */
  framing(object, { fill = 0.45, fillW, center = 0.4, focusY = 0.5, fov = this.fov, lift = 0.15 } = {}) {
    const box = new THREE.Box3().setFromObject(object);
    const h = box.max.y - box.min.y;
    const w = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(fov) / 2);
    const aspect = this.camera.aspect;
    // world height visible at the object's distance
    const visible = fillW ? (w / fillW) / aspect : h / fill;
    const radius = visible / (2 * tanHalf);
    const focus = box.min.y + h * focusY;
    const targetY = focus - (0.5 - center) * visible;
    return { radius, targetY, height: targetY + h * lift, fov };
  }

  update(t) {
    const a = THREE.MathUtils.degToRad(this.angle);
    const c = this.camera;
    // Handheld micro-shake: sum of sines, deterministic in t.
    const sx = this.shakeAmp * (Math.sin(t * 1.7) * 0.6 + Math.sin(t * 4.1) * 0.4);
    const sy = this.shakeAmp * (Math.sin(t * 1.3 + 1) * 0.6 + Math.sin(t * 3.3) * 0.4);
    c.position.set(this.targetX + Math.sin(a) * this.radius + sx, this.height + sy, this.targetZ + Math.cos(a) * this.radius);
    c.lookAt(this.targetX, this.targetY, this.targetZ);
    c.rotateZ(THREE.MathUtils.degToRad(this.roll));
    if (c.fov !== this.fov) { c.fov = this.fov; c.updateProjectionMatrix(); }
  }
}

/** Floating dust / bokeh particles drifting through the light (deterministic). */
export function dust(stage, { count = 300, spread = 4, color = '#ffffff', size = 0.025, opacity = 0.6, seed = 3 } = {}) {
  const r = MG.rand(seed);
  const base = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    base[i * 3] = (r() - 0.5) * spread; base[i * 3 + 1] = r() * spread * 0.7; base[i * 3 + 2] = (r() - 0.5) * spread;
    speed[i] = 0.03 + r() * 0.08;
  }
  const pos = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({ color, size, map: new THREE.CanvasTexture(c), transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(geo, mat);
  stage.scene.add(pts);
  stage.before.push((t) => {
    for (let i = 0; i < count; i++) {
      pos[i * 3] = base[i * 3] + Math.sin(t * speed[i] * 6 + i) * 0.08;
      pos[i * 3 + 1] = ((base[i * 3 + 1] + t * speed[i]) % (spread * 0.7));
      pos[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * speed[i] * 5 + i) * 0.08;
    }
    geo.attributes.position.needsUpdate = true;
  });
  return pts;
}

export { THREE };
