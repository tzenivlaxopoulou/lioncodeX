import * as THREE from "../vendor/three/three.module.js";
import { GLTFLoader } from "../vendor/three/GLTFLoader.js";

const leoStates = {
  idle: "idle.glb",
  walk: "walk.glb",
  wave: "wave.glb",
  talk: "talk.glb",
  excited: "excited.glb"
};
const leoModelBasePath = "assets/leo3d";
const fallbackState = "idle";
const instanceKey = "__lionCodeXLeo3DInstance";
const leoDebug = new URLSearchParams(window.location.search).has("leoDebug");

function logDebug(...args) {
  if (leoDebug) console.info(...args);
}

function relativePath(target) {
  const basePath = document.body.dataset.base || ".";
  return basePath === "." ? target : `${basePath}/${target}`;
}

function getLongestClipDuration(gltf) {
  return Math.max(0, ...gltf.animations.map((clip) => clip.duration || 0));
}

function prepareSceneMaterials(scene) {
  const materials = new Set();

  scene.traverse((node) => {
    if (!node.isMesh) return;
    node.frustumCulled = false;
    node.castShadow = true;
    node.receiveShadow = true;

    const sourceMaterials = Array.isArray(node.material) ? node.material : [node.material];
    const clonedMaterials = sourceMaterials.map((material) => {
      const clone = material.clone();
      clone.transparent = true;
      clone.depthWrite = true;
      clone.userData.baseOpacity = clone.opacity ?? 1;
      materials.add(clone);
      return clone;
    });

    node.material = Array.isArray(node.material) ? clonedMaterials : clonedMaterials[0];
  });

  return materials;
}

function setSceneOpacity(sceneData, opacity) {
  const nextOpacity = THREE.MathUtils.clamp(opacity, 0, 1);
  sceneData.group.visible = nextOpacity > 0.001;

  sceneData.materials.forEach((material) => {
    material.opacity = (material.userData.baseOpacity ?? 1) * nextOpacity;
    material.depthWrite = nextOpacity > 0.98;
    material.needsUpdate = true;
  });
}

function normalizeModel(scene, scale) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  scene.scale.setScalar(scale);
  scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  return Math.max(size.x, size.y, size.z);
}

function initLeo3D() {
  const hosts = document.querySelectorAll("[data-leo-3d]");
  const stages = document.querySelectorAll("[data-leo-3d-stage]");
  const host = hosts[0];
  const stage = stages[0];
  const loaderLabel = document.querySelector("[data-leo-3d-loader]");
  if (!host || !stage) return;

  logDebug("[Leo3D] containers found", {
    hosts: hosts.length,
    stages: stages.length,
    canvasesInStage: stage.querySelectorAll("canvas").length
  });

  if (window[instanceKey]?.initialized) {
    logDebug("[Leo3D] duplicate init prevented");
    return;
  }

  stage.querySelectorAll("canvas").forEach((canvas) => canvas.remove());

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("data-leo-3d-canvas", "true");
  stage.append(renderer.domElement);
  logDebug("[Leo3D] canvases after append", stage.querySelectorAll("canvas").length);

  window[instanceKey] = {
    initialized: true,
    renderer,
    stage
  };

  const modelRoot = new THREE.Group();
  modelRoot.position.set(0, -0.16, 0);
  scene.add(modelRoot);

  const ambientLight = new THREE.AmbientLight(0xffffff, 3.2);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xfff4dd, 0x273a64, 3.4);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 5.2);
  keyLight.position.set(3.8, 5.6, 5.4);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x9ec5ff, 2.7);
  rimLight.position.set(-4, 2.4, -3);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xffd68a, 2.2, 12);
  fillLight.position.set(0, 1.8, 3.4);
  scene.add(fillLight);

  const loader = new GLTFLoader();
  const baseModelYaw = -0.18;
  const models = new Map();
  const pendingModels = new Map();
  const failedModels = new Set();
  let activeMixer = null;
  let activeName = "idle";
  let fade = null;
  let returnTimer = 0;
  let oneShotState = null;
  let activeFinishHandler = null;
  let sectionPrimed = false;
  let lastSectionSwitch = 0;
  let sharedScale = 1;

  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    renderer.setSize(safeWidth, safeHeight, false);
    camera.aspect = safeWidth / safeHeight;
    camera.position.set(0, safeWidth < 520 ? 0.25 : 0.18, safeWidth < 520 ? 6.8 : 5.8);
    camera.lookAt(0, 0.05, 0);
    camera.updateProjectionMatrix();
  }

  function stopFinishListener() {
    if (!activeFinishHandler) return;
    const { model, handler } = activeFinishHandler;
    model.mixer.removeEventListener("finished", handler);
    activeFinishHandler = null;
  }

  function hideInactiveModels(visibleName) {
    models.forEach((model, modelName) => {
      if (modelName !== visibleName) {
        model.mixer.stopAllAction();
        setSceneOpacity(model, 0);
        if (model.group.parent === modelRoot) {
          modelRoot.remove(model.group);
        }
      }
    });
  }

  function playAction(name) {
    const model = models.get(name);
    if (!model) return;

    model.mixer.stopAllAction();
    model.actions.forEach((action) => action.stop());
    if (!model.actions.length) return;

    const shouldLoop = name === "idle" || name === "walk" || name === "talk";
    model.actions.forEach((action) => {
      action.reset();
      action.enabled = true;
      action.paused = false;
      action.timeScale = 1;
      action.clampWhenFinished = !shouldLoop;
      action.setLoop(shouldLoop ? THREE.LoopRepeat : THREE.LoopOnce, shouldLoop ? Infinity : 1);
      action.play();
    });
  }

  function mountActiveModel(name, opacity = 1) {
    const model = models.get(name);
    if (!model) return null;

    hideInactiveModels(name);
    if (model.group.parent !== modelRoot) {
      modelRoot.add(model.group);
    }
    setSceneOpacity(model, opacity);
    activeMixer = model.mixer;
    logDebug("[Leo3D] active model", {
      state: name,
      rootChildren: modelRoot.children.length,
      sceneChildren: scene.children.length
    });
    return model;
  }

  function emitLeoStateEvent(type, name) {
    const model = models.get(name);
    window.dispatchEvent(
      new CustomEvent(`lioncodex:leo-state-${type}`, {
        detail: {
          state: name,
          duration: model?.duration || 0
        }
      })
    );
  }

  function getModelUrl(file) {
    return relativePath(`${leoModelBasePath}/${file}`);
  }

  function getFallbackName(name) {
    if (models.has(name)) return name;
    if (name !== fallbackState) {
      console.warn(`[Leo3D] ${name} is unavailable. Falling back to ${fallbackState}.`);
    }
    return fallbackState;
  }

  function fadeTo(name, options = {}) {
    const isBlockedByOneShot = oneShotState && name !== "idle" && !(options.force && name === oneShotState);
    if (isBlockedByOneShot) {
      logDebug(`[Leo3D] Ignoring ${name}; ${oneShotState} is playing.`);
      return;
    }
    if (failedModels.has(name)) {
      name = getFallbackName(name);
    }
    if (activeName === name && !options.force) return;
    if (!models.has(name)) {
      if (!pendingModels.has(name)) {
        pendingModels.set(name, loadModel(name, leoStates[name]).catch(() => getFallbackName(name)));
      }
      if (name !== fallbackState) fadeTo(fallbackState, options);
      return;
    }
    window.clearTimeout(returnTimer);
    stopFinishListener();

    const to = models.get(name);
    const duration = reducedMotion.matches ? 0.01 : options.duration ?? 0.32;

    const activeModel = mountActiveModel(name, 0.001);
    if (!activeModel) return;
    playAction(name);
    fade = { to, elapsed: 0, duration };
    activeName = name;
    setSceneOpacity(to, 0.001);
    emitLeoStateEvent("start", name);

    if (name === "idle") {
      oneShotState = null;
      return;
    }

    if (name === "talk") {
      oneShotState = name;
      return;
    }

    if (name === "wave" || name === "excited") {
      oneShotState = name;
      const handler = () => {
        if (activeName !== name) return;
        stopFinishListener();
        oneShotState = null;
        emitLeoStateEvent("finished", name);
        fadeTo("idle", { force: true });
      };
      to.mixer.addEventListener("finished", handler);
      activeFinishHandler = { model: to, handler };
      return;
    }

    if (options.returnToIdle && name === "walk") {
      const holdMs = options.holdMs ?? 1150;
      returnTimer = window.setTimeout(() => {
        emitLeoStateEvent("finished", name);
        fadeTo("idle", { force: true });
      }, holdMs);
    }
  }

  function animate() {
    const delta = Math.min(clock.getDelta(), 0.045);
    activeMixer?.update(delta);

    if (fade) {
      fade.elapsed += delta;
      const progress = Math.min(1, fade.elapsed / fade.duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setSceneOpacity(fade.to, eased);
      if (progress >= 1) {
        setSceneOpacity(fade.to, 1);
        hideInactiveModels(activeName);
        fade = null;
      }
    }

    modelRoot.rotation.y = baseModelYaw + Math.sin(clock.elapsedTime * 0.42) * 0.035;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  }

  function bindInteractions() {
    host.addEventListener("mouseover", () => {
      fadeTo("wave", { returnToIdle: true });
    });

    host.addEventListener("focusin", () => {
      fadeTo("wave", { returnToIdle: true });
    });

    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("pointerenter", () => {
        fadeTo("wave", { returnToIdle: true });
      });
      card.addEventListener("focusin", () => {
        fadeTo("wave", { returnToIdle: true });
      });
      card.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) return;
        fadeTo("wave", { returnToIdle: true, force: true });
      });
    });

    document.querySelectorAll(".nav-links a, .btn[href], a.btn").forEach((link) => {
      link.addEventListener("click", (event) => {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (link.getAttribute("href")?.startsWith("mailto:") || link.getAttribute("href")?.startsWith("tel:")) return;

        fadeTo("walk", { returnToIdle: true, holdMs: 1100 });
        if (url.pathname !== window.location.pathname || url.hash) return;
        event.preventDefault();
        window.setTimeout(() => {
          window.location.href = url.href;
        }, reducedMotion.matches ? 0 : 320);
      });
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        if (!sectionPrimed) {
          sectionPrimed = true;
          return;
        }

        const now = performance.now();
        if (now - lastSectionSwitch < 1200) return;
        lastSectionSwitch = now;
        fadeTo("walk", { returnToIdle: true, holdMs: 1150 });
      },
      { threshold: [0.42, 0.62] }
    );

    document.querySelectorAll("main > section").forEach((section) => sectionObserver.observe(section));
  }

  async function loadModels() {
    const idle = await loadGltf("idle", leoStates.idle, true);
    const idleSize = new THREE.Box3().setFromObject(idle.scene).getSize(new THREE.Vector3());
    sharedScale = 1.15 / Math.max(idleSize.x, idleSize.y, idleSize.z, 1);
    registerModel("idle", idle, 0);
    mountActiveModel("idle", 1);
    activeName = "idle";
    playAction("idle");
    host.classList.add("is-loaded");
    loaderLabel?.setAttribute("aria-hidden", "true");
    bindInteractions();

    Object.entries(leoStates)
      .filter(([name]) => name !== "idle")
      .forEach(([name, file]) => {
        const modelPromise = loadModel(name, file).catch((error) => {
          console.warn(`[Leo3D] Optional ${name} model unavailable. Using ${fallbackState} fallback.`, error);
          failedModels.add(name);
          pendingModels.delete(name);
          return models.get(fallbackState);
        });
        pendingModels.set(name, modelPromise);
        if (name === "wave") {
          modelPromise.then((model) => {
            if (model && !failedModels.has(name)) {
              fadeTo("wave", { returnToIdle: true, force: true });
            }
          });
        }
      });
  }

  async function loadModel(name, file) {
    if (!file) {
      throw new Error(`No GLB filename configured for state: ${name}`);
    }
    const gltf = await loadGltf(name, file, false);
    if (models.has(name)) {
      pendingModels.delete(name);
      return models.get(name);
    }
    const model = registerModel(name, gltf, 0);
    pendingModels.delete(name);
    return model;
  }

  async function loadGltf(name, file, required) {
    const url = getModelUrl(file);
    logDebug(`[Leo3D] Loading ${name}: ${url}`);
    try {
      const gltf = await loader.loadAsync(url);
      logDebug(`[Leo3D] Loaded ${name}: ${url}`);
      return gltf;
    } catch (error) {
      const level = required ? "error" : "warn";
      console[level](`[Leo3D] Failed to load ${name}: ${url}`, error);
      throw error;
    }
  }

  function registerModel(name, gltf, opacity) {
    const group = gltf.scene;
    if (models.has(name)) return models.get(name);
    normalizeModel(group, sharedScale);
    const normalizedBox = new THREE.Box3().setFromObject(group);
    const normalizedSize = normalizedBox.getSize(new THREE.Vector3());
    const normalizedCenter = normalizedBox.getCenter(new THREE.Vector3());
    logDebug(`[Leo3D] ${name} loaded`, {
      modelNames: [...models.keys(), name],
      rootChildren: modelRoot.children.length,
      meshCount: group.children.length,
      size: {
        x: Number(normalizedSize.x.toFixed(3)),
        y: Number(normalizedSize.y.toFixed(3)),
        z: Number(normalizedSize.z.toFixed(3))
      },
      center: {
        x: Number(normalizedCenter.x.toFixed(3)),
        y: Number(normalizedCenter.y.toFixed(3)),
        z: Number(normalizedCenter.z.toFixed(3))
      }
    });
    const materials = prepareSceneMaterials(group);
    const mixer = new THREE.AnimationMixer(group);
    const actions = gltf.animations.map((clip) => mixer.clipAction(clip));
    const duration = getLongestClipDuration(gltf) || (name === "idle" ? 5 : 1.8);

    const model = { group, mixer, actions, materials, duration };
    models.set(name, model);
    setSceneOpacity(model, opacity);
    return model;
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);
  animate();

  loadModels().catch((error) => {
    console.error("Leo 3D failed to load", error);
    host.classList.add("is-error");
  });

  function playState(state) {
    logDebug(`[Leo3D] playState(${state})`);
    if (!models.has(state) && pendingModels.has(state)) {
      pendingModels.get(state)?.then((model) => {
        if (model && models.has(state)) playState(state);
      });
      return;
    }
    if (state === "idle") {
      fadeTo("idle", { force: true });
      return;
    }
    if (state === "walk") {
      fadeTo("walk", { returnToIdle: true, holdMs: 1150, force: true });
      return;
    }
    if (state === "wave") {
      fadeTo("wave", { returnToIdle: true, force: true });
      return;
    }
    if (state === "talk") {
      oneShotState = null;
      fadeTo("talk", { force: true });
      return;
    }
    if (state === "excited") {
      oneShotState = null;
      fadeTo("excited", { returnToIdle: true, force: true });
      return;
    }
    console.warn(`[Leo3D] Unknown state: ${state}`);
  }

  window.lionCodeXLeo3D = {
    playState,
    idle: () => playState("idle"),
    walk: () => playState("walk"),
    wave: () => playState("wave"),
    talk: () => playState("talk"),
    excited: () => playState("excited")
  };

  window.addEventListener("lioncodex:leo-state", (event) => {
    const state = event.detail?.state;
    if (typeof state === "string") {
      playState(state);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLeo3D, { once: true });
} else {
  initLeo3D();
}
