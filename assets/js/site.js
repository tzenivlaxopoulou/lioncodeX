const brandName = "LionCodeX";
const basePath = document.body.dataset.base || ".";

const navItems = [
  { href: "index.html", label: "Αρχική", key: "home" },
  { href: "services.html", label: "Υπηρεσίες", key: "services" },
  { href: "ai-solutions.html", label: "AI Solutions", key: "ai" },
  { href: "portfolio.html", label: "Portfolio", key: "portfolio" },
  { href: "about.html", label: "Σχετικά με εμάς", key: "about" },
  { href: "contact.html", label: "Επικοινωνία", key: "contact" }
];

const footerGroups = [
  {
    title: "Κύριες Σελίδες",
    links: [
      ["Αρχική", "index.html"],
      ["Υπηρεσίες", "services.html"],
      ["AI Solutions", "ai-solutions.html"],
      ["Portfolio", "portfolio.html"]
    ]
  },
  {
    title: "Βασικές Υπηρεσίες",
    links: [
      ["Website Development", "services/website-development.html"],
      ["E-commerce", "services/ecommerce.html"],
      ["Web Apps", "services/web-apps.html"],
      ["AI Agents", "services/ai-agent-integration.html"]
    ]
  },
  {
    title: "Επικοινωνία",
    links: [
      ["hello@lioncodex.gr", "mailto:hello@lioncodex.gr"],
      ["+30 210 123 4567", "tel:+302101234567"],
      ["Κλείστε στρατηγικό call", "contact.html"]
    ]
  }
];

function relativePath(target) {
  const currentDepth = window.location.pathname
  if (/^(mailto:|tel:|https?:)/.test(target)) return target;
  return basePath === "." ? target : `${basePath}/${target}`;
}

function renderHeader() {
  const host = document.querySelector("[data-site-header]");
  if (!host) return;
  const currentPage = document.body.dataset.page;
  host.innerHTML = `
    <div class="site-brand-bar" data-site-brand-bar>
      <a class="site-brand-bar-inner" href="${relativePath("index.html")}" aria-label="LionCodeX αρχική">
        <span class="brand-mark" aria-hidden="true">
          <img class="brand-mark__image" src="${relativePath("assets/media/lion-emblem.png")}?v=2" alt="" />
        </span>
        <span class="brand-text">
          <strong><span class="brand-lion">Lion</span><span class="brand-code">Code</span><span class="brand-x">X</span></strong>
          <span>Εκεί που η επιτυχία γράφεται σε κώδικα</span>
        </span>
      </a>
    </div>
    <header class="site-header">
      <div class="container nav-shell nav-shell-brandless">
        <nav class="nav-links" aria-label="Primary">
          ${navItems
            .map(
              (item) =>
                `<a class="${item.key === currentPage ? "is-active" : ""}" href="${relativePath(item.href)}">${item.label}</a>`
            )
            .join("")}
        </nav>
        <div class="nav-actions">
          <a class="btn btn-secondary" href="${relativePath("contact.html")}">Στρατηγικό Ραντεβού</a>
          <button class="nav-toggle" type="button" aria-label="Άνοιγμα μενού">≡</button>
        </div>
      </div>
    </header>
  `;

  const header = host.querySelector(".site-header");
  const toggle = host.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => header.classList.toggle("is-open"));
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  });
}

function renderFooter() {
  const host = document.querySelector("[data-site-footer]");
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="${relativePath("index.html")}">
              <span class="brand-mark" aria-hidden="true"></span>
              <span class="brand-text">
                <strong><span class="brand-lion">Lion</span><span class="brand-code">Code</span><span class="brand-x">X</span></strong>
                <span>Web, apps, AI, growth systems</span>
              </span>
            </a>
            <p class="lead">Σχεδιάζουμε premium ψηφιακές εμπειρίες με στρατηγική λογική, τεχνολογική ακρίβεια και έμφαση στο conversion.</p>
          </div>
          ${footerGroups
            .map(
              (group) => `
              <div>
                <h3 class="footer-title">${group.title}</h3>
                <ul class="footer-list">
                  ${group.links
                    .map(([label, href]) => `<li><a href="${relativePath(href)}">${label}</a></li>`)
                    .join("")}
                </ul>
              </div>`
            )
            .join("")}
        </div>
        <div class="footer-bottom">
          <span>© 2026 ${brandName}. Premium digital presence, engineered with intent.</span>
          <span>Αθήνα · Ελλάδα · Remote-first delivery</span>
        </div>
      </div>
    </footer>
  `;
}

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  items.forEach((item) => observer.observe(item));
}

function initPortfolioFilters() {
  const filterWrap = document.querySelector("[data-portfolio-filters]");
  if (!filterWrap) return;
  const buttons = filterWrap.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-case]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      const selected = button.dataset.filter;
      cards.forEach((card) => {
        card.classList.toggle("hidden", selected !== "all" && card.dataset.case !== selected);
      });
    });
  });
}

function initIntroOverlay() {
  const intro = document.querySelector("[data-intro-screen]");
  if (!intro || document.body.dataset.page !== "home") return;
  const image = intro.querySelector(".intro-screen__emblem");
  const storageKey = "lioncodexIntroSeen";

  try {
    if (window.sessionStorage.getItem(storageKey) === "true") {
      intro.remove();
      return;
    }
  } catch (error) {
    // Ignore storage access issues and continue with the intro.
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visibleFor = reducedMotion ? 1000 : 1000;
  const closeDuration = reducedMotion ? 260 : 1320;

  function closeIntro() {
    window.setTimeout(() => {
      intro.classList.add("is-closing");

      window.setTimeout(() => {
        intro.remove();
        document.body.classList.remove("is-intro-active");
      }, closeDuration);
    }, visibleFor);
  }

  function revealIntro() {
    if (intro.classList.contains("is-ready")) return;
    try {
      window.sessionStorage.setItem(storageKey, "true");
    } catch (error) {
      // Ignore storage access issues and continue with the intro.
    }
    document.body.classList.add("is-intro-active");
    intro.classList.add("is-ready");
    closeIntro();
  }

  if (!image) {
    revealIntro();
    return;
  }

  if (typeof image.decode === "function") {
    image
      .decode()
      .then(revealIntro)
      .catch(() => {
        if (image.complete) {
          revealIntro();
          return;
        }
        image.addEventListener("load", revealIntro, { once: true });
        image.addEventListener("error", revealIntro, { once: true });
      });
    return;
  }

  if (image.complete) {
    revealIntro();
    return;
  }

  image.addEventListener("load", revealIntro, { once: true });
  image.addEventListener("error", revealIntro, { once: true });
}

function initCodeRain() {
  const canvas = document.createElement("canvas");
  canvas.className = "site-code-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const context = canvas.getContext("2d");
  if (!context) return;

  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/\\=+-*#%$&?!;:_|~".split("");
  const colors = [
    [201, 168, 106],
    [212, 176, 111],
    [224, 194, 135],
    [188, 149, 84],
    [232, 208, 158]
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let streams = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrame = 0;
  let lastTime = 0;

  function pickGlyph() {
    return glyphs[Math.floor(Math.random() * glyphs.length)];
  }

  function pickColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function buildStreams() {
    const minGap = width > 1100 ? 17 : width > 768 ? 19 : 22;
    const totalColumns = Math.max(24, Math.floor(width / minGap));
    streams = Array.from({ length: totalColumns + 10 }, (_, index) => {
      const column = index - 5;
      const x = column * minGap + Math.random() * minGap;
      const fontSize = width > 1100 ? 17 : width > 768 ? 16 : 14;
      const length = 10 + Math.floor(Math.random() * 14);
      const speed = 24 + Math.random() * 42;
      const direction = Math.random() > 0.34 ? 1 : -1;
      const offset = Math.random() * height;
      const phase = Math.random() * Math.PI * 2;
      const alpha = 0.28 + Math.random() * 0.26;
      return {
        x,
        fontSize,
        step: fontSize * 1.18,
        length,
        speed,
        direction,
        offset,
        drift: (Math.random() - 0.5) * 4,
        phase,
        alpha,
        color: pickColor(),
        glyphs: Array.from({ length }, pickGlyph)
      };
    });
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStreams();
  }

  function drawStream(stream, timeSeconds) {
    const verticalTravel = (timeSeconds * stream.speed + stream.offset) % (height + stream.length * stream.step * 2);
    const headY = stream.direction === 1
      ? verticalTravel - stream.length * stream.step
      : height - verticalTravel + stream.length * stream.step;
    const x = stream.x + Math.sin(timeSeconds * 0.28 + stream.phase) * stream.drift;

    context.font = `${stream.fontSize}px "IBM Plex Mono", "SFMono-Regular", Consolas, monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let index = 0; index < stream.length; index += 1) {
      const y = headY + index * stream.step * stream.direction;
      if (y < -40 || y > height + 40) continue;

      const fade = 1 - index / stream.length;
      const alpha = stream.alpha * Math.max(0.18, fade);
      const [r, g, b] = stream.color;
      const glow = index === 0 ? 10 : index < 3 ? 6 : 0;

      if (glow) {
        context.shadowBlur = glow;
        context.shadowColor = `rgba(${r}, ${g}, ${b}, ${Math.min(alpha + 0.16, 0.66)})`;
      } else {
        context.shadowBlur = 0;
      }

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      context.fillText(stream.glyphs[index], x, y);
    }
  }

  function renderFrame(timestamp) {
    const time = timestamp * 0.001;
    const delta = lastTime ? Math.min(timestamp - lastTime, 32) : 16;
    lastTime = timestamp;

    context.clearRect(0, 0, width, height);
    context.fillStyle = `rgba(5, 16, 33, ${reducedMotion.matches ? 0.16 : 0.1})`;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalCompositeOperation = "screen";
    streams.forEach((stream) => drawStream(stream, time));
    context.restore();
    context.shadowBlur = 0;

    if (!reducedMotion.matches) {
      animationFrame = window.requestAnimationFrame(renderFrame);
      return;
    }

    if (delta >= 0) {
      animationFrame = 0;
    }
  }

  const restart = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    lastTime = 0;
    resizeCanvas();
    animationFrame = window.requestAnimationFrame(renderFrame);
  };

  restart();
  window.addEventListener("resize", restart);
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", restart);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(restart);
  }
}

function initLeoHost() {
  const page = document.body.dataset.page;
  const leo = document.createElement("div");
  const positionKey = "lioncodexLeoPosition";
  const compactClass = "is-compact";
  const heroClass = "is-hero-mode";
  const greetedClass = "has-greeted";
  const openClass = "is-open";

  leo.className = "leo-host";
  leo.setAttribute("data-leo-host", "");
  leo.innerHTML = `
    <div class="leo-greeting" role="status" aria-live="polite">
      <span class="leo-greeting__eyebrow">Leo Host</span>
      <p>Γεια, είμαι ο Leo.<br />Ο AI host της LionCodeX.<br />Θες να σε βοηθήσω να βρεις τη σωστή λύση;</p>
    </div>
    <div class="leo-panel" hidden>
      <div class="leo-panel__header">
        <div>
          <span class="leo-panel__eyebrow">Leo AI Concierge</span>
          <h2>Ο premium host της LionCodeX για γρήγορη καθοδήγηση.</h2>
        </div>
        <button class="leo-panel__close" type="button" aria-label="Κλείσιμο Leo">×</button>
      </div>
      <p>Ο Leo σας κατευθύνει γρήγορα σε υπηρεσίες, AI λύσεις ή στρατηγικό ραντεβού, χωρίς να χάνετε το flow της σελίδας.</p>
      <div class="leo-panel__actions">
        <a class="btn btn-primary" href="${relativePath("contact.html")}">Μιλήστε με τη LionCodeX</a>
        <a class="btn btn-secondary" href="${relativePath("ai-solutions.html")}">AI Solutions</a>
        <a class="btn btn-secondary" href="${relativePath("services.html")}">Υπηρεσίες</a>
      </div>
    </div>
    <button class="leo-trigger" type="button" aria-expanded="false" aria-label="Άνοιγμα Leo host panel">
      <span class="leo-trigger__avatar" aria-hidden="true">
        <img src="${relativePath("assets/media/lion-emblem.png")}?v=2" alt="" />
      </span>
      <span class="leo-trigger__copy">
        <strong>Leo</strong>
        <span>AI host της LionCodeX</span>
      </span>
    </button>
  `;

  document.body.append(leo);

  const greeting = leo.querySelector(".leo-greeting");
  const trigger = leo.querySelector(".leo-trigger");
  const panel = leo.querySelector(".leo-panel");
  const closeButton = leo.querySelector(".leo-panel__close");
  let suppressClick = false;
  let pointerId = null;
  let originX = 0;
  let originY = 0;
  let originLeft = 0;
  let originTop = 0;
  let currentLeft = 0;
  let currentTop = 0;
  let hasMoved = false;
  let isDragging = false;

  function loadSavedPosition() {
    try {
      const raw = window.localStorage.getItem(positionKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.left !== "number" || typeof parsed?.top !== "number") return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function savePosition(left, top) {
    try {
      window.localStorage.setItem(positionKey, JSON.stringify({ left, top }));
    } catch (error) {
      // Ignore storage write failures.
    }
  }

  function clampPosition(left, top) {
    const margin = 12;
    const rect = leo.getBoundingClientRect();
    const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
    return {
      left: Math.min(Math.max(margin, left), maxLeft),
      top: Math.min(Math.max(margin, top), maxTop)
    };
  }

  function applyPosition(left, top, persist = false) {
    const next = clampPosition(left, top);
    currentLeft = next.left;
    currentTop = next.top;
    leo.style.right = "auto";
    leo.style.bottom = "auto";
    leo.style.left = `${next.left}px`;
    leo.style.top = `${next.top}px`;
    if (persist) savePosition(next.left, next.top);
    updatePanelAlignment();
  }

  function getFloatingDefaultPosition() {
    const margin = 24;
    const rect = leo.getBoundingClientRect();
    return {
      left: Math.max(margin, window.innerWidth - rect.width - margin),
      top: Math.max(margin, window.innerHeight - rect.height - margin)
    };
  }

  function getHeroDefaultPosition() {
    const hero = document.querySelector(".hero");
    const fallback = getFloatingDefaultPosition();
    if (!hero) return fallback;
    const heroRect = hero.getBoundingClientRect();
    const rect = leo.getBoundingClientRect();
    return clampPosition(
      Math.min(window.innerWidth - rect.width - 28, heroRect.right - rect.width * 0.72),
      heroRect.top + Math.max(42, heroRect.height * 0.34)
    );
  }

  function updatePanelAlignment() {
    leo.classList.toggle("leo-host--panel-left", currentLeft < window.innerWidth * 0.42);
  }

  function dismissGreeting() {
    leo.classList.add(greetedClass);
  }

  function setPanelOpen(isOpen) {
    leo.classList.toggle(openClass, isOpen);
    panel.hidden = !isOpen;
    trigger.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) dismissGreeting();
    requestAnimationFrame(() => applyPosition(currentLeft, currentTop, false));
  }

  function collapseHeroMode() {
    if (!leo.classList.contains(heroClass)) return;
    leo.classList.remove(heroClass);
    leo.classList.add(compactClass);
    requestAnimationFrame(() => {
      const fallback = getFloatingDefaultPosition();
      applyPosition(fallback.left, fallback.top, false);
    });
  }

  const savedPosition = loadSavedPosition();
  const startsHeroMode = page === "home" && !savedPosition;
  leo.classList.add(startsHeroMode ? heroClass : compactClass);

  requestAnimationFrame(() => {
    const initial = savedPosition || (startsHeroMode ? getHeroDefaultPosition() : getFloatingDefaultPosition());
    applyPosition(initial.left, initial.top, false);
  });

  if (startsHeroMode) {
    const handleHeroExit = () => {
      if (window.scrollY <= 32) return;
      collapseHeroMode();
      window.removeEventListener("scroll", handleHeroExit);
    };
    window.addEventListener("scroll", handleHeroExit, { passive: true });
  }

  trigger.addEventListener("pointerdown", (event) => {
    pointerId = event.pointerId;
    originX = event.clientX;
    originY = event.clientY;
    originLeft = currentLeft;
    originTop = currentTop;
    hasMoved = false;
    isDragging = false;
    suppressClick = false;
    trigger.setPointerCapture(pointerId);
  });

  trigger.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const deltaX = event.clientX - originX;
    const deltaY = event.clientY - originY;
    const distance = Math.hypot(deltaX, deltaY);

    if (!hasMoved && distance > 8) {
      hasMoved = true;
      isDragging = true;
      suppressClick = true;
      collapseHeroMode();
      leo.classList.add("is-dragging");
    }

    if (!isDragging) return;
    applyPosition(originLeft + deltaX, originTop + deltaY, false);
  });

  function finishPointer(event) {
    if (pointerId !== event.pointerId) return;
    if (trigger.hasPointerCapture(pointerId)) {
      trigger.releasePointerCapture(pointerId);
    }
    if (isDragging) {
      savePosition(currentLeft, currentTop);
      leo.classList.remove("is-dragging");
      dismissGreeting();
      window.setTimeout(() => {
        suppressClick = false;
      }, 180);
    }
    pointerId = null;
    isDragging = false;
  }

  trigger.addEventListener("pointerup", finishPointer);
  trigger.addEventListener("pointercancel", finishPointer);

  trigger.addEventListener("click", (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (leo.classList.contains(heroClass)) {
      collapseHeroMode();
    }
    setPanelOpen(!leo.classList.contains(openClass));
  });

  closeButton.addEventListener("click", () => setPanelOpen(false));
  greeting?.addEventListener("click", () => {
    if (leo.classList.contains(heroClass)) {
      collapseHeroMode();
    }
    setPanelOpen(true);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!leo.contains(event.target)) {
      setPanelOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setPanelOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (leo.classList.contains(heroClass)) {
      const next = getHeroDefaultPosition();
      applyPosition(next.left, next.top, false);
      return;
    }
    applyPosition(currentLeft, currentTop, false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initIntroOverlay();
  initLeoHost();
  initCodeRain();
  initReveal();
  initPortfolioFilters();
});
