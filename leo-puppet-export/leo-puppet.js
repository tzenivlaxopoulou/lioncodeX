const leoStates = ["leo-idle", "leo-happy", "leo-talking", "leo-wave", "leo-sleep", "leo-excited", "leo-walk", "leo-turn", "leo-direction-system"];
const leoSelectableStates = ["leo-idle", "leo-happy", "leo-talking", "leo-wave", "leo-sleep", "leo-excited"];
const leoInactivityDelay = 30000;
const leoSleepTimers = new WeakMap();
const leoTurnTimers = new WeakMap();
const leoDirectionTimers = new WeakMap();
const leoDirectionRuns = new WeakMap();
const leoDirectionKeyboardTests = new WeakSet();
// TEMP TEST: Leo state lock for pose alignment
let leoStateLock = false;

function setLeoState(puppet, state) {
  puppet.classList.remove(...leoStates);
  puppet.classList.add(state);
}

function isLeoIdleLike(puppet) {
  return puppet.classList.contains("leo-idle") || !leoStates.some((state) => puppet.classList.contains(state));
}

function scheduleLeoSleep(puppet) {
  window.clearTimeout(leoSleepTimers.get(puppet));
  const timer = window.setTimeout(() => {
    if (leoStateLock) return;

    if (isLeoIdleLike(puppet)) {
      setLeoState(puppet, "leo-sleep");
      return;
    }

    scheduleLeoSleep(puppet);
  }, leoInactivityDelay);

  leoSleepTimers.set(puppet, timer);
}

function wakeLeo(puppet) {
  if (leoStateLock) return;

  setLeoState(puppet, "leo-idle");
  scheduleLeoSleep(puppet);
}

// TEMP TEST: Leo turn transition
function playLeoTurnTransition(puppet) {
  if (leoStateLock) return;

  window.clearTimeout(leoTurnTimers.get(puppet));
  setLeoState(puppet, "leo-idle");

  window.requestAnimationFrame(() => {
    if (leoStateLock) return;

    setLeoState(puppet, "leo-turn");
    const timer = window.setTimeout(() => {
      if (leoStateLock) return;

      if (puppet.classList.contains("leo-turn")) {
        setLeoState(puppet, "leo-walk");
      }
      scheduleLeoSleep(puppet);
    }, 220);

    leoTurnTimers.set(puppet, timer);
  });
}

// Leo inactivity sleep system
document.querySelectorAll("[data-leo-puppet]").forEach((puppet) => {
  scheduleLeoSleep(puppet);

  ["click", "mouseenter", "pointerdown", "pointermove"].forEach((eventName) => {
    puppet.addEventListener(eventName, () => {
      wakeLeo(puppet);
    });
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-leo-puppet-state]");
  if (!button) return;
  if (!leoSelectableStates.includes(button.dataset.leoPuppetState)) return;

  const puppet = button.closest(".leo-puppet-shell")?.querySelector("[data-leo-puppet]") || document.querySelector("[data-leo-puppet]");
  if (!puppet) return;
  if (leoStateLock) return;

  setLeoState(puppet, button.dataset.leoPuppetState);
  scheduleLeoSleep(puppet);
});

// TEMP TEST: Leo keyboard state shortcuts
document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isTyping =
    activeElement?.matches("input, textarea, select") ||
    activeElement?.isContentEditable;
  if (isTyping) return;

  const shortcutStates = {
    1: "leo-idle",
    2: "leo-sleep",
    3: "leo-excited",
    4: "leo-walk"
  };
  const isTurnShortcut = event.key === "5";
  const selectedState = shortcutStates[event.key];
  if (!selectedState && !isTurnShortcut) return;

  const puppet = document.querySelector(".leo-puppet");
  if (!puppet) return;

  if (leoDirectionKeyboardTests.has(puppet)) return;

  if (event.key === "1") {
    leoStateLock = false;
    setLeoState(puppet, "leo-idle");
    scheduleLeoSleep(puppet);
    return;
  }

  if (event.key === "3") {
    leoStateLock = true;
    window.clearTimeout(leoSleepTimers.get(puppet));
    window.clearTimeout(leoTurnTimers.get(puppet));
    setLeoState(puppet, "leo-excited");
    return;
  }

  if (isTurnShortcut) {
    // KEYBOARD TEST START
    playLeoDirectionKeyboardTest(puppet);
    // KEYBOARD TEST END
    return;
  }

  leoStateLock = false;
  setLeoState(puppet, selectedState);
  scheduleLeoSleep(puppet);
});

// TURN SYSTEM START
const leoDirectionFrameMs = {
  walk: 120,
  walkFast: 110,
  anticipation: 170,
  anticipationHold: 210,
  turn: 200,
  turnBack: 310,
  turnBackHold: 340,
  overshoot: 150,
  settle: 260,
  settleReturn: 180
};

const leoDirectionFrames = {
  walk1: "walk1.png",
  walk2: "walk2.png",
  walk3: "walk3.png",
  walk4: "walk4.png",
  walk5: "walk5.png",
  walk6: "walk6.png",
  walkRight1: "walk-right1.png",
  walkRight2: "walk-right2.png",
  walkRight3: "walk-right3.png",
  turn: "turn.png",
  turnBack: "turn-back.png"
};

function getLeoDirectionPuppet(puppet = document.querySelector(".leo-puppet")) {
  return puppet;
}

function getLeoDirectionSprite(puppet) {
  return puppet?.querySelector(".leo-part-direction-sprite");
}

function getLeoDirectionAssetPath(sprite, filename) {
  const spritePath = sprite.currentSrc || sprite.src;
  return `${spritePath.slice(0, spritePath.lastIndexOf("/") + 1)}${filename}`;
}

function setLeoDirectionFrame(sprite, filename, direction = 1, x = 0, y = 0, opacity = 1) {
  sprite.src = getLeoDirectionAssetPath(sprite, filename);
  // TURN SMOOTHING START
  sprite.style.opacity = opacity;
  sprite.style.transform = `translateX(${x}px) translateY(${y}px) scaleX(${direction})`;
  // TURN SMOOTHING END
}

function waitForLeoDirectionFrame(puppet, ms) {
  window.clearTimeout(leoDirectionTimers.get(puppet));
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    leoDirectionTimers.set(puppet, timer);
  });
}

async function playLeoDirectionSequence(puppet, sequence, runId) {
  const sprite = getLeoDirectionSprite(puppet);
  if (!sprite) return false;

  for (const frame of sequence) {
    if (leoDirectionRuns.get(puppet) !== runId || !puppet.classList.contains("leo-direction-system")) {
      return false;
    }

    setLeoDirectionFrame(sprite, frame.src, frame.direction, frame.x || 0, frame.y || 0, frame.opacity ?? 1);
    await waitForLeoDirectionFrame(puppet, frame.ms);
  }

  return true;
}

function getLeoDirectionTurnToLeftSequence() {
  return [
    { src: leoDirectionFrames.walkRight1, direction: 1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight2, direction: 1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight3, direction: 1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.turn, direction: 1, x: 1, opacity: 0.98, ms: leoDirectionFrameMs.turn },
    { src: leoDirectionFrames.turnBack, direction: 1, x: 2, y: 2, opacity: 0.97, ms: leoDirectionFrameMs.turnBack },
    { src: leoDirectionFrames.turn, direction: -1, x: -1, opacity: 0.98, ms: leoDirectionFrameMs.turn },
    { src: leoDirectionFrames.walkRight3, direction: -1, x: -1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight2, direction: -1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight1, direction: -1, ms: leoDirectionFrameMs.walk }
  ];
}

function getLeoDirectionTurnToRightSequence() {
  return [
    { src: leoDirectionFrames.walkRight1, direction: -1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight2, direction: -1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight3, direction: -1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.turn, direction: -1, x: -1, opacity: 0.98, ms: leoDirectionFrameMs.turn },
    { src: leoDirectionFrames.turnBack, direction: 1, x: -2, y: 2, opacity: 0.97, ms: leoDirectionFrameMs.turnBack },
    { src: leoDirectionFrames.turn, direction: 1, x: 1, opacity: 0.98, ms: leoDirectionFrameMs.turn },
    { src: leoDirectionFrames.walkRight3, direction: 1, x: 1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight2, direction: 1, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight1, direction: 1, ms: leoDirectionFrameMs.walk }
  ];
}

function getLeoDirectionWalkSequence(direction = 1, cycles = 3) {
  return Array.from({ length: cycles }).flatMap(() => [
    { src: leoDirectionFrames.walkRight1, direction, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight2, direction, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walkRight3, direction, ms: leoDirectionFrameMs.walk }
  ]);
}

function getLeoDirectionKeyboardTestSequence() {
  // DISNEY TURN SYSTEM START
  // FOLLOW THROUGH POLISH START
  const sequence = [
    { src: leoDirectionFrames.walk1, direction: 1, ms: leoDirectionFrameMs.walkFast },
    { src: leoDirectionFrames.walk2, direction: 1, x: 0.5, ms: leoDirectionFrameMs.walkFast },
    { src: leoDirectionFrames.walk3, direction: 1, x: 1, y: -0.5, ms: leoDirectionFrameMs.walkFast },
    { src: leoDirectionFrames.walk4, direction: 1, x: 1.5, y: -0.5, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk5, direction: 1, x: 1.25, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk6, direction: 1, x: 0.75, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk5, direction: 1, x: 0.25, y: 1, ms: leoDirectionFrameMs.anticipation },
    { src: leoDirectionFrames.walk4, direction: 1, x: -0.5, y: 1, opacity: 0.99, ms: leoDirectionFrameMs.anticipationHold },
    { src: leoDirectionFrames.turn, direction: 1, x: -1.25, y: 0.5, opacity: 0.985, ms: leoDirectionFrameMs.turn },
    { src: leoDirectionFrames.turnBack, direction: 1, x: -1.75, y: 2, opacity: 0.975, ms: leoDirectionFrameMs.turnBack },
    { src: leoDirectionFrames.turnBack, direction: 1, x: -1.25, y: 2, opacity: 0.985, ms: leoDirectionFrameMs.turnBackHold },
    { src: leoDirectionFrames.turn, direction: -1, x: 1.25, y: 1, opacity: 0.99, ms: leoDirectionFrameMs.turn },
    { src: leoDirectionFrames.walk4, direction: -1, x: 1.75, y: -0.5, ms: leoDirectionFrameMs.overshoot },
    { src: leoDirectionFrames.walk5, direction: -1, x: 1, ms: leoDirectionFrameMs.walkFast },
    { src: leoDirectionFrames.walk6, direction: -1, x: 0.25, ms: leoDirectionFrameMs.walkFast },
    { src: leoDirectionFrames.walk5, direction: -1, x: -0.25, y: 0.5, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk4, direction: -1, x: -0.75, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk3, direction: -1, x: -0.5, y: 0.5, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk2, direction: -1, x: -0.25, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk1, direction: -1, x: 0, ms: leoDirectionFrameMs.walk },
    { src: leoDirectionFrames.walk1, direction: -1, x: -0.5, y: 1.25, ms: leoDirectionFrameMs.settle },
    { src: leoDirectionFrames.walk1, direction: -1, x: 0.25, y: -0.5, ms: leoDirectionFrameMs.settleReturn },
    { src: leoDirectionFrames.walk1, direction: -1, ms: leoDirectionFrameMs.settleReturn }
  ];
  // FOLLOW THROUGH POLISH END
  // DISNEY TURN SYSTEM END

  return sequence;
}

async function playLeoDirectionKeyboardTest(puppet = getLeoDirectionPuppet()) {
  if (
    !puppet ||
    leoDirectionKeyboardTests.has(puppet) ||
    (puppet.classList.contains("leo-direction-system") && leoDirectionRuns.has(puppet)) ||
    !getLeoDirectionSprite(puppet)
  ) return;

  const runId = Symbol("leo-direction-keyboard-test");
  leoDirectionKeyboardTests.add(puppet);
  leoDirectionRuns.set(puppet, runId);
  leoStateLock = false;
  window.clearTimeout(leoSleepTimers.get(puppet));
  window.clearTimeout(leoDirectionTimers.get(puppet));
  puppet.classList.remove(...leoStates);
  puppet.classList.add("leo-direction-system");

  await playLeoDirectionSequence(puppet, getLeoDirectionKeyboardTestSequence(), runId);
  leoDirectionKeyboardTests.delete(puppet);
  leoDirectionRuns.delete(puppet);
  getLeoDirectionSprite(puppet)?.removeAttribute("style");
  setLeoState(puppet, "leo-idle");
  scheduleLeoSleep(puppet);
}

async function runLeoDirectionLoop(puppet, runId) {
  while (leoDirectionRuns.get(puppet) === runId && puppet.classList.contains("leo-direction-system")) {
    const walkedRight = await playLeoDirectionSequence(puppet, getLeoDirectionWalkSequence(1), runId);
    if (!walkedRight) return;

    const turnedLeft = await playLeoDirectionSequence(puppet, getLeoDirectionTurnToLeftSequence(), runId);
    if (!turnedLeft) return;

    const walkedLeft = await playLeoDirectionSequence(puppet, getLeoDirectionWalkSequence(-1), runId);
    if (!walkedLeft) return;

    const turnedRight = await playLeoDirectionSequence(puppet, getLeoDirectionTurnToRightSequence(), runId);
    if (!turnedRight) return;
  }
}

function startLeoDirectionSystem(puppet = getLeoDirectionPuppet()) {
  if (!puppet || !getLeoDirectionSprite(puppet)) return;

  const runId = Symbol("leo-direction-run");
  leoDirectionRuns.set(puppet, runId);
  window.clearTimeout(leoSleepTimers.get(puppet));
  window.clearTimeout(leoDirectionTimers.get(puppet));
  puppet.classList.remove(...leoStates);
  puppet.classList.add("leo-direction-system");
  runLeoDirectionLoop(puppet, runId);
}

function stopLeoDirectionSystem(puppet = getLeoDirectionPuppet()) {
  if (!puppet) return;

  leoDirectionRuns.delete(puppet);
  window.clearTimeout(leoDirectionTimers.get(puppet));
  puppet.classList.remove("leo-direction-system");
  getLeoDirectionSprite(puppet)?.removeAttribute("style");
  setLeoState(puppet, "leo-idle");
  scheduleLeoSleep(puppet);
}

window.LeoDirectionSystem = {
  start: startLeoDirectionSystem,
  stop: stopLeoDirectionSystem,
  turnLeft: (puppet = getLeoDirectionPuppet()) => {
    if (!puppet) return;
    const runId = Symbol("leo-direction-turn-left");
    leoDirectionRuns.set(puppet, runId);
    window.clearTimeout(leoDirectionTimers.get(puppet));
    puppet.classList.remove(...leoStates);
    puppet.classList.add("leo-direction-system");
    playLeoDirectionSequence(puppet, getLeoDirectionTurnToLeftSequence(), runId);
  },
  turnRight: (puppet = getLeoDirectionPuppet()) => {
    if (!puppet) return;
    const runId = Symbol("leo-direction-turn-right");
    leoDirectionRuns.set(puppet, runId);
    window.clearTimeout(leoDirectionTimers.get(puppet));
    puppet.classList.remove(...leoStates);
    puppet.classList.add("leo-direction-system");
    playLeoDirectionSequence(puppet, getLeoDirectionTurnToRightSequence(), runId);
  }
};
// TURN SYSTEM END
