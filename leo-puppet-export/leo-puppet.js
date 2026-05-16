document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-leo-puppet-state]");
  if (!button) return;

  const puppet = document.querySelector("[data-leo-puppet]");
  if (!puppet) return;

  puppet.classList.remove("leo-idle", "leo-happy", "leo-talking", "leo-wave");
  puppet.classList.add(button.dataset.leoPuppetState);
});
