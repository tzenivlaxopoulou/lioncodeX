const leoStates = ["leo-idle", "leo-happy", "leo-talking", "leo-wave", "leo-sleep", "leo-excited"];
const leoInactivityDelay = 30000;
const leoSleepTimers = new WeakMap();

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
    if (isLeoIdleLike(puppet)) {
      setLeoState(puppet, "leo-sleep");
      return;
    }

    scheduleLeoSleep(puppet);
  }, leoInactivityDelay);

  leoSleepTimers.set(puppet, timer);
}

function wakeLeo(puppet) {
  setLeoState(puppet, "leo-idle");
  scheduleLeoSleep(puppet);
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

  const puppet = button.closest(".leo-puppet-shell")?.querySelector("[data-leo-puppet]") || document.querySelector("[data-leo-puppet]");
  if (!puppet) return;

  setLeoState(puppet, button.dataset.leoPuppetState);
  scheduleLeoSleep(puppet);
});
