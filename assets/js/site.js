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

function initPageLeoGuide() {
  if (document.body.dataset.page === "home") return;

  const heroGrid = document.querySelector(".page-hero-grid");
  const pageHero = document.querySelector(".page-hero");
  if (!heroGrid || !pageHero) return;

  const pathname = window.location.pathname.toLowerCase();
  const currentPage = document.body.dataset.page;
  const messageMap = new Map([
    [
      "/index.html",
      "Καλώς ήρθες στο LionCodeX. Εδώ δεν φτιάχνουμε απλώς sites — χτίζουμε ψηφιακές εμπειρίες που δουλεύουν για την επιχείρησή σου."
    ],
    [
      "/services/website-development.html",
      "Αν θέλεις ιστοσελίδα, δεν ξεκινάμε από το design. Ξεκινάμε από το τι πρέπει να καταλάβει και να νιώσει ο πελάτης σου."
    ],
    [
      "/services/ecommerce.html",
      "Ένα e-shop δεν πρέπει απλώς να δείχνει προϊόντα. Πρέπει να βοηθά τον επισκέπτη να αγοράσει εύκολα, γρήγορα και με εμπιστοσύνη."
    ],
    [
      "/ai-solutions.html",
      "Εδώ μπαίνει η διαφορά. Μπορώ να γίνω ο ψηφιακός βοηθός της δικής σου επιχείρησης και να εξυπηρετώ τους επισκέπτες σου 24/7."
    ],
    [
      "/services/ai-agent-integration.html",
      "Εδώ μπαίνει η διαφορά. Μπορώ να γίνω ο ψηφιακός βοηθός της δικής σου επιχείρησης και να εξυπηρετώ τους επισκέπτες σου 24/7."
    ],
    [
      "/services/digital-marketing.html",
      "Το marketing δεν είναι να φωνάζεις πιο δυνατά. Είναι να εμφανίζεσαι σωστά, τη σωστή στιγμή, στον σωστό άνθρωπο."
    ],
    [
      "/services/web-apps.html",
      "Μια εφαρμογή πρέπει να λύνει πραγματικό πρόβλημα. Όχι να υπάρχει απλώς επειδή ακούγεται εντυπωσιακό."
    ],
    [
      "/services/mobile-apps.html",
      "Μια εφαρμογή πρέπει να λύνει πραγματικό πρόβλημα. Όχι να υπάρχει απλώς επειδή ακούγεται εντυπωσιακό."
    ],
    [
      "/about.html",
      "Το LionCodeX δημιουργήθηκε για επιχειρήσεις που θέλουν κάτι πιο έξυπνο, πιο ανθρώπινο και πιο αποτελεσματικό από μια απλή online παρουσία."
    ],
    [
      "/contact.html",
      "Πες μας τι έχεις στο μυαλό σου και θα σε βοηθήσουμε να δούμε ποια λύση ταιριάζει καλύτερα στην επιχείρησή σου."
    ],
    [
      "/services.html",
      "Κάθε υπηρεσία εδώ είναι σχεδιασμένη για να εξυπηρετεί πραγματικό επιχειρηματικό στόχο, όχι απλώς για να γεμίσει μια λίστα δυνατοτήτων."
    ],
    [
      "/portfolio.html",
      "Εδώ θα δεις το επίπεδο σκέψης και αισθητικής που βάζουμε σε κάθε ψηφιακή εμπειρία πριν φτάσει μπροστά στον πελάτη σου."
    ],
    [
      "/process.html",
      "Ο τρόπος που δουλεύουμε έχει σημασία όσο και το τελικό αποτέλεσμα. Θέλουμε να ξέρεις τι χτίζεται, γιατί και με ποια λογική."
    ]
  ]);

  const fallbackMessageByPage = {
    ai: "Η AI αποδίδει όταν μπαίνει σε σωστό σημείο της εμπειρίας και υπηρετεί έναν καθαρό επιχειρηματικό ρόλο.",
    services:
      "Κάθε υπηρεσία εδώ είναι σχεδιασμένη για να εξυπηρετεί πραγματικό επιχειρηματικό στόχο, όχι απλώς για να γεμίσει μια λίστα δυνατοτήτων.",
    about:
      "Το LionCodeX δημιουργήθηκε για επιχειρήσεις που θέλουν κάτι πιο έξυπνο, πιο ανθρώπινο και πιο αποτελεσματικό από μια απλή online παρουσία.",
    contact:
      "Πες μας τι έχεις στο μυαλό σου και θα σε βοηθήσουμε να δούμε ποια λύση ταιριάζει καλύτερα στην επιχείρησή σου.",
    portfolio:
      "Εδώ θα δεις το επίπεδο σκέψης και αισθητικής που βάζουμε σε κάθε ψηφιακή εμπειρία πριν φτάσει μπροστά στον πελάτη σου.",
    process:
      "Ο τρόπος που δουλεύουμε έχει σημασία όσο και το τελικό αποτέλεσμα. Θέλουμε να ξέρεις τι χτίζεται, γιατί και με ποια λογική."
  };

  const message =
    [...messageMap.entries()].find(([suffix]) => pathname.endsWith(suffix))?.[1] ||
    fallbackMessageByPage[currentPage];
  const isServicesOverview = pathname.endsWith("/services.html");
  const isWebsiteServicePage = pathname.endsWith("/services/website-development.html");

  if (!message) return;

  let side = heroGrid.querySelector(".page-hero-side");
  if (!side) {
    side = document.createElement("div");
    side.className = "page-hero-side";
    side.setAttribute("data-reveal", "");
    heroGrid.append(side);
  }

  heroGrid.classList.add("page-hero-grid--with-leo");
  pageHero.classList.add("page-hero--with-leo");
  side.classList.remove("page-hero-frame");
  side.classList.add("page-hero-side--leo");
  side.innerHTML = isServicesOverview || isWebsiteServicePage
    ? `
      <section class="leo-page-guide leo-page-guide--interactive" aria-label="Leo AI concierge">
        <div class="leo-page-guide__bubble">
          <span class="leo-page-guide__label">${isWebsiteServicePage ? "Leo · Website Consultant" : "Leo · Service Guide"}</span>
          <div class="leo-page-guide__dialogue" aria-live="polite">
            <p>${message}</p>
          </div>
          <div class="leo-page-guide__chips">
            ${
              isWebsiteServicePage
                ? `
                  <button class="leo-page-guide__chip" type="button">Τι κάνει μια ιστοσελίδα αποτελεσματική;</button>
                  <button class="leo-page-guide__chip" type="button">Για ποιες επιχειρήσεις ταιριάζει;</button>
                  <button class="leo-page-guide__chip" type="button">Θέλω να το συζητήσουμε</button>
                `
                : `
                  <button class="leo-page-guide__chip" type="button" data-service-choice="web-presence">Θέλω να ξεκινήσω online</button>
                  <button class="leo-page-guide__chip" type="button" data-service-choice="ecommerce">Θέλω να πουλάω online</button>
                  <button class="leo-page-guide__chip" type="button" data-service-choice="apps-systems">Θέλω εφαρμογή ή custom σύστημα</button>
                  <button class="leo-page-guide__chip" type="button" data-service-choice="ai">Θέλω να βάλω AI στο site μου</button>
                  <button class="leo-page-guide__chip" type="button" data-service-choice="growth">Θέλω ανάπτυξη και προβολή</button>
                `
            }
          </div>
          <div class="leo-page-guide__actions" aria-live="polite"></div>
        </div>
        <div class="leo-page-guide__reaction" aria-live="polite" aria-hidden="true"></div>
        <figure class="leo-page-guide__avatar-wrap">
          <img class="leo-page-guide__avatar" src="${relativePath("assets/Leo/Leo-happy1.png")}" alt="Leo AI concierge mascot" />
        </figure>
      </section>
    `
    : `
      <section class="leo-page-guide" aria-label="Leo AI concierge">
        <div class="leo-page-guide__bubble">
          <span class="leo-page-guide__label">Leo · AI Concierge</span>
          <p>${message}</p>
        </div>
        <figure class="leo-page-guide__avatar-wrap">
          <img class="leo-page-guide__avatar" src="${relativePath("assets/Leo/Leo-happy1.png")}" alt="Leo AI concierge mascot" />
        </figure>
      </section>
    `;

  const guide = side.querySelector(".leo-page-guide");
  const avatar = side.querySelector(".leo-page-guide__avatar");
  const reactionBubble = side.querySelector(".leo-page-guide__reaction");
  if (!guide || !avatar) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const leoBasePath = relativePath("assets/Leo");
  const excitedSrc = `${leoBasePath}/Leo-excited.png`;
  const happySrc = `${leoBasePath}/Leo-happy1.png`;
  const idle2Src = `${leoBasePath}/Leo-idle2.png`;
  const idle4Src = `${leoBasePath}/Leo-idle4.png`;
  const walkFrames = ["Leo-walk1.png", "Leo-walk2.png", "Leo-walk3.png", "Leo-walk4.png"];
  const waveFrames = ["Leo-wave1.png", "Leo-wave2.png"];
  const talkFrames = ["Leo-talk1.png", "Leo-talk2.png", "Leo-talk3.png", "Leo-talk4.png"];
  let frameTimer = 0;
  let stateTimer = 0;
  let guideRestingSrc = happySrc;

  function leoAsset(filename) {
    return `${leoBasePath}/${filename}`;
  }

  [...new Set(["Leo-excited.png", "Leo-happy1.png", "Leo-idle2.png", "Leo-idle4.png", ...walkFrames, ...waveFrames, ...talkFrames])].forEach((filename) => {
    const image = new Image();
    image.src = leoAsset(filename);
  });

  function clearLeoGuideTimers() {
    window.clearTimeout(frameTimer);
    window.clearTimeout(stateTimer);
    frameTimer = 0;
    stateTimer = 0;
  }

  function showGuideReaction(message) {
    if (!reactionBubble) return;
    reactionBubble.textContent = message;
    reactionBubble.classList.add("is-visible");
    reactionBubble.setAttribute("aria-hidden", "false");
  }

  function hideGuideReaction() {
    if (!reactionBubble) return;
    reactionBubble.classList.remove("is-visible");
    reactionBubble.setAttribute("aria-hidden", "true");
  }

  function setGuideFrame(src) {
    avatar.src = src;
  }

  function setGuideRestingState(src) {
    guideRestingSrc = src;
  }

  function enterHappyState() {
    setGuideRestingState(happySrc);
    guide.classList.remove("is-talking");
    setGuideFrame(happySrc);
  }

  function enterGuideIdle2State() {
    setGuideRestingState(idle2Src);
    guide.classList.remove("is-talking");
    setGuideFrame(idle2Src);
  }

  function enterGuideRestingState() {
    guide.classList.remove("is-talking");
    setGuideFrame(guideRestingSrc);
  }

  function playLeoGuideSequence(frames, totalDuration, onComplete) {
    const sequence = frames.slice();
    const frameDuration = Math.max(130, Math.round(totalDuration / sequence.length));
    let frameIndex = 0;

    const tick = () => {
      setGuideFrame(leoAsset(sequence[frameIndex]));
      frameIndex += 1;
      if (frameIndex >= sequence.length) {
        onComplete?.();
        return;
      }
      frameTimer = window.setTimeout(tick, frameDuration);
    };

    tick();
  }

  function playLeoGuideLoadSequence() {
    clearLeoGuideTimers();

    if (reducedMotion.matches) {
      avatar.src = leoAsset("Leo-wave1.png");
      stateTimer = window.setTimeout(() => {
        guide.classList.add("is-talking");
        avatar.src = leoAsset("Leo-talk1.png");
        stateTimer = window.setTimeout(() => {
          enterGuideIdle2State();
          stateTimer = window.setTimeout(enterHappyState, 2200);
        }, 3200);
      }, 1600);
      return;
    }

    playLeoGuideSequence([...waveFrames, ...waveFrames], 1700, () => {
      guide.classList.add("is-talking");
      playLeoGuideSequence([...talkFrames, ...talkFrames, ...talkFrames], 3900, () => {
        enterGuideIdle2State();
        stateTimer = window.setTimeout(enterHappyState, 2200);
      });
    });
  }

  avatar.addEventListener("error", () => {
    setGuideFrame(happySrc);
  });

  guide.addEventListener("pointerenter", () => {
    clearLeoGuideTimers();
    guide.classList.remove("is-talking");
    avatar.src = idle4Src;
  });

  guide.addEventListener("pointerleave", () => {
    enterGuideRestingState();
  });

  enterHappyState();
  playLeoGuideLoadSequence();

  if (isServicesOverview || isWebsiteServicePage) {
    const dialogue = guide.querySelector(".leo-page-guide__dialogue");
    const chips = Array.from(guide.querySelectorAll(".leo-page-guide__chip"));
    const actions = guide.querySelector(".leo-page-guide__actions");
    if (!dialogue || !chips.length || !actions) return;

    const servicesGuideMap = isWebsiteServicePage
      ? new Map([
          [
            "Τι κάνει μια ιστοσελίδα αποτελεσματική;",
            {
              response:
                "Μια αποτελεσματική ιστοσελίδα έχει ξεκάθαρο μήνυμα, σωστή δομή, γρήγορη εμπειρία, εμπιστοσύνη και διαδρομή που οδηγεί τον επισκέπτη στο επόμενο βήμα.",
              actions: [
                { label: "Δες τη διαδικασία", href: "process.html" },
                { label: "Κλείσε call", href: "contact.html" }
              ]
            }
          ],
          [
            "Για ποιες επιχειρήσεις ταιριάζει;",
            {
              response:
                "Ταιριάζει σε επιχειρήσεις που θέλουν επαγγελματική παρουσία, περισσότερη αξιοπιστία και ένα σημείο αναφοράς όπου ο πελάτης καταλαβαίνει άμεσα τι προσφέρουν.",
              actions: [
                { label: "Δες υπηρεσίες", href: "services.html" },
                { label: "Μίλησε μαζί μας", href: "contact.html" }
              ]
            }
          ],
          [
            "Θέλω να το συζητήσουμε",
            {
              response:
                "Μπορούμε να ξεκινήσουμε από τον στόχο σου και να δούμε αν χρειάζεσαι απλή παρουσίαση, πιο στρατηγικό website ή κάτι με AI λειτουργίες.",
              actions: [
                { label: "Επικοινωνία", href: "contact.html" },
                { label: "Στρατηγικό call", href: "contact.html" }
              ]
            }
          ]
        ])
      : new Map([
          [
            "web-presence",
            {
              response:
                "Αν θέλεις να ξεκινήσεις online σωστά, ξεκίνα από μια επαγγελματική παρουσία με καθαρό μήνυμα, σωστή δομή και εμπειρία που εμπνέει εμπιστοσύνη.",
              actions: [
                {
                  label: "Δες Websites",
                  href: "services/website-development.html",
                  guidedTarget: "websites-commerce",
                  guidedContext: "websites-commerce",
                  guidedMessage:
                    "Ωραία, πάμε να δούμε λύσεις που μπορούν να κάνουν την επιχείρησή σου να ξεχωρίσει online."
                },
                {
                  label: "Μίλησε μαζί μας",
                  href: "contact.html",
                  guidedTarget: "websites-commerce",
                  guidedContext: "contact",
                  guidedMessage: "Τέλεια, πάμε να ανοίξουμε τον πιο άμεσο δρόμο επικοινωνίας."
                }
              ],
              target: "websites-commerce"
            }
          ],
          [
            "ecommerce",
            {
              response:
                "Αν θέλεις να πουλάς online, αυτή είναι η σωστή κατηγορία για e-shop με καλύτερη εμπειρία αγοράς, εμπιστοσύνη και πιο δυνατό εμπορικό flow.",
              actions: [
                { label: "Δες E-shops", href: "services/ecommerce.html" },
                { label: "Ζήτησε πρόταση", href: "contact.html" }
              ],
              target: "websites-commerce"
            }
          ],
          [
            "apps-systems",
            {
              response:
                "Αν χρειάζεσαι εφαρμογή ή custom σύστημα, εδώ θα δεις λύσεις που οργανώνουν διαδικασίες, συγκεντρώνουν λειτουργίες και στηρίζουν την καθημερινή δουλειά της επιχείρησής σου.",
              actions: [
                { label: "Δες Web Apps", href: "services/web-apps.html" },
                { label: "Ζήτησε πρόταση", href: "contact.html" }
              ],
              reactionMessage:
                "Τέλεια επιλογή! Πάμε να δούμε πώς μια εφαρμογή μπορεί να οργανώσει καλύτερα την επιχείρησή σου.",
              target: "apps-systems"
            }
          ],
          [
            "ai",
            {
              response:
                "Αν θέλεις να βάλεις AI στο site σου, εδώ θα δεις λύσεις για agents και assistants που καθοδηγούν, εξυπηρετούν και ενισχύουν τα leads.",
              actions: [
                { label: "Δες AI Solutions", href: "ai-solutions.html" },
                { label: "Θέλω demo concept", href: "contact.html" }
              ],
              target: "ai-automation"
            }
          ],
          [
            "growth",
            {
              response:
                "Αν ο στόχος σου είναι ανάπτυξη και προβολή, αυτή η κατηγορία συγκεντρώνει marketing, SEO, tracking και conversion thinking για πιο μετρήσιμα αποτελέσματα.",
              actions: [
                { label: "Δες Digital Marketing", href: "services/digital-marketing.html" },
                { label: "Κλείσε στρατηγικό call", href: "contact.html" }
              ],
              target: "marketing-growth"
            }
          ]
        ]);

    function setActiveChip(selectedLabel) {
      chips.forEach((chip) => {
        const chipKey = chip.dataset.serviceChoice || chip.textContent?.trim();
        const isActive = chipKey === selectedLabel;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", String(isActive));
      });
    }

    function renderServiceActions(actionItems = []) {
      actions.innerHTML = "";
      actionItems.forEach((action) => {
        const actionLink = document.createElement("a");
        actionLink.className = "leo-page-guide__action";
        actionLink.href = relativePath(action.href);
        actionLink.textContent = action.label;
        if (action.guidedTarget) {
          actionLink.dataset.guidedTarget = action.guidedTarget;
        }
        if (action.guidedMessage) {
          actionLink.dataset.guidedMessage = action.guidedMessage;
        }
        if (action.guidedContext) {
          actionLink.dataset.guidedContext = action.guidedContext;
        }
        actions.append(actionLink);
      });
    }

    let highlightTimer = 0;
    const serviceCards = Array.from(document.querySelectorAll("[data-service-group]"));
    const cardWalkState = new WeakMap();
    const cardContextState = new WeakMap();
    const defaultGuideReactionMessage = "Τέλεια επιλογή! Έλα να σου δείξω τι μπορούμε να χτίσουμε μαζί.";
    const guideReactionDelay = 1950;
    const cardContextDelay = 520;
    const cardContextDuration = 5600;
    const cardContextMessages = {
      "websites-commerce":
        "Εδώ χτίζουμε την πρώτη δυνατή εικόνα της επιχείρησής σου online — με σωστή δομή, καθαρό μήνυμα και εμπειρία που οδηγεί σε αποτέλεσμα.",
      "apps-systems":
        "Εδώ σχεδιάζουμε εργαλεία που οργανώνουν διαδικασίες, αυτοματοποιούν δουλειές και λύνουν πραγματικά λειτουργικά προβλήματα.",
      "ai-automation":
        "Εδώ ο Leo γίνεται πραγματικός ψηφιακός βοηθός: απαντά, καθοδηγεί και υποστηρίζει τους επισκέπτες σου με πιο έξυπνο τρόπο.",
      "marketing-growth":
        "Εδώ δεν μιλάμε απλώς για προβολή. Στήνουμε στρατηγική ώστε ο σωστός κόσμος να σε βρίσκει, να σε καταλαβαίνει και να σε εμπιστεύεται.",
      contact:
        "Αν έχεις μια ιδέα, μια ανάγκη ή απλώς θέλεις να δεις από πού να ξεκινήσεις, μπορούμε να το συζητήσουμε απλά και καθαρά."
    };

    function parseAnimationDurationMs(value) {
      const firstValue = value.split(",")[0]?.trim() || "0s";
      if (firstValue.endsWith("ms")) {
        return Number.parseFloat(firstValue);
      }
      if (firstValue.endsWith("s")) {
        return Number.parseFloat(firstValue) * 1000;
      }
      return 0;
    }

    function stopServiceCardWalk(card) {
      const walkState = cardWalkState.get(card);
      const walkTrack = card.querySelector(".leo-walk-track");
      const walkAvatar = card.querySelector(".leo-walk-avatar");
      if (walkState?.frameTimer) {
        window.clearInterval(walkState.frameTimer);
      }
      if (walkState?.settleTimer) {
        window.clearTimeout(walkState.settleTimer);
      }
      if (walkTrack && walkState?.endHandler) {
        walkTrack.removeEventListener("animationend", walkState.endHandler);
      }
      if (walkAvatar) {
        walkAvatar.src = leoAsset(walkFrames[0]);
      }
      cardWalkState.delete(card);
    }

    function hideServiceCardContext(card) {
      const bubble = card.querySelector(".leo-walk-bubble");
      const contextState = cardContextState.get(card);
      if (contextState?.showTimer) {
        window.clearTimeout(contextState.showTimer);
      }
      if (contextState?.hideTimer) {
        window.clearTimeout(contextState.hideTimer);
      }
      if (bubble) {
        bubble.classList.remove("is-visible");
        bubble.setAttribute("aria-hidden", "true");
      }
      cardContextState.delete(card);
    }

    function showServiceCardContext(card, contextKey) {
      const bubble = card.querySelector(".leo-walk-bubble");
      const messageText = contextKey ? cardContextMessages[contextKey] : "";
      if (!bubble || !messageText) return;

      hideServiceCardContext(card);
      bubble.textContent = messageText;

      const showTimer = window.setTimeout(() => {
        bubble.classList.add("is-visible");
        bubble.setAttribute("aria-hidden", "false");
      }, cardContextDelay);

      const hideTimer = window.setTimeout(() => {
        bubble.classList.remove("is-visible");
        bubble.setAttribute("aria-hidden", "true");
        cardContextState.delete(card);
      }, cardContextDelay + cardContextDuration);

      cardContextState.set(card, { showTimer, hideTimer });
    }

    function startServiceCardWalk(card) {
      const walkTrack = card.querySelector(".leo-walk-track");
      const walkAvatar = card.querySelector(".leo-walk-avatar");
      if (!walkTrack || !walkAvatar) return;

      stopServiceCardWalk(card);
      walkAvatar.src = leoAsset(walkFrames[0]);

      if (reducedMotion.matches) return;

      const walkDuration = Math.max(1, parseAnimationDurationMs(window.getComputedStyle(walkTrack).animationDuration));
      const totalFrameSteps = Math.max(8, Math.round(walkDuration / 200));
      const frameDuration = Math.max(140, Math.round(walkDuration / totalFrameSteps));
      let frameIndex = 0;
      const frameTimer = window.setInterval(() => {
        frameIndex = (frameIndex + 1) % walkFrames.length;
        walkAvatar.src = leoAsset(walkFrames[frameIndex]);
      }, frameDuration);

      const endHandler = (event) => {
        if (event.animationName !== "leoCardWalk" && event.animationName !== "leoCardWalkMobile") return;
        window.clearInterval(frameTimer);
        walkAvatar.src = idle4Src;
        walkTrack.removeEventListener("animationend", endHandler);
        const settleTimer = window.setTimeout(() => {
          walkAvatar.src = happySrc;
          cardWalkState.delete(card);
        }, 950);
        cardWalkState.set(card, { settleTimer });
      };
      walkTrack.addEventListener("animationend", endHandler);

      cardWalkState.set(card, { frameTimer, endHandler });
    }

    function activateServiceCard(targetCard, options = {}) {
      if (!targetCard) return;
      const shouldScroll = options.scroll !== false;
      const contextKey = options.contextKey || targetCard.dataset.serviceGroup || "";
      serviceCards.forEach((card) => {
        card.classList.remove("is-highlighted", "is-open", "is-active");
        card.setAttribute("aria-expanded", "false");
        stopServiceCardWalk(card);
        hideServiceCardContext(card);
      });
      // Force a reflow so Leo's entrance animation reliably restarts on repeated selections.
      void targetCard.offsetWidth;
      targetCard.classList.add("is-open", "is-active");
      targetCard.setAttribute("aria-expanded", "true");
      startServiceCardWalk(targetCard);
      showServiceCardContext(targetCard, contextKey);
      if (options.highlight) {
        targetCard.classList.add("is-highlighted");
      }
      if (shouldScroll) {
        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    function startGuideReactionFlow({ reactionMessage = defaultGuideReactionMessage, targetKey, contextKey, onArrive }) {
      clearLeoGuideTimers();
      guide.classList.add("is-talking");
      setGuideFrame(excitedSrc);
      showGuideReaction(reactionMessage);

      stateTimer = window.setTimeout(() => {
        hideGuideReaction();
        if (targetKey) {
          highlightServiceGroup(targetKey, contextKey || targetKey);
        }
        onArrive?.();
        setGuideFrame(idle4Src);
        stateTimer = window.setTimeout(() => {
          enterHappyState();
        }, 950);
      }, guideReactionDelay);
    }

    function highlightServiceGroup(targetKey, contextKey) {
      if (!isServicesOverview || !targetKey) return;
      const targetCard = document.querySelector(`[data-service-group="${targetKey}"]`);
      if (!targetCard) return;
      activateServiceCard(targetCard, { highlight: true, contextKey });
      window.clearTimeout(highlightTimer);
      highlightTimer = window.setTimeout(() => {
        targetCard.classList.remove("is-highlighted");
      }, 2200);
    }

    if (isServicesOverview && serviceCards.length) {
      serviceCards.forEach((card) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-expanded", "false");
        card.addEventListener("click", (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest("a")) return;
          activateServiceCard(card, { scroll: false });
        });
        card.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          activateServiceCard(card, { scroll: false });
        });
      });

      // Temporary visible confirmation state: first grouped card opens on load.
      activateServiceCard(serviceCards[0], { scroll: false });
    }

    chips.forEach((chip) => {
      chip.setAttribute("aria-pressed", "false");
      chip.addEventListener("click", () => {
        const selectedLabel = chip.dataset.serviceChoice || chip.textContent?.trim();
        const nextState = selectedLabel ? servicesGuideMap.get(selectedLabel) : null;
        if (!selectedLabel || !nextState) return;
        setActiveChip(selectedLabel);
        startGuideReactionFlow({
          reactionMessage: nextState.reactionMessage || defaultGuideReactionMessage,
          targetKey: nextState.target,
          contextKey: nextState.target,
          onArrive: () => {
            renderServiceActions(nextState.actions);
          }
        });
      });
      chip.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        chip.click();
      });
    });

    actions.addEventListener("click", (event) => {
      const actionLink = event.target instanceof Element ? event.target.closest(".leo-page-guide__action") : null;
      if (!actionLink || !(actionLink instanceof HTMLAnchorElement)) return;
      const guidedTarget = actionLink.dataset.guidedTarget;
      if (!guidedTarget) return;
      event.preventDefault();
      startGuideReactionFlow({
        reactionMessage: actionLink.dataset.guidedMessage || defaultGuideReactionMessage,
        targetKey: guidedTarget,
        contextKey: actionLink.dataset.guidedContext || guidedTarget
      });
    });

    actions.addEventListener("keydown", (event) => {
      const actionLink = event.target instanceof Element ? event.target.closest(".leo-page-guide__action") : null;
      if (!actionLink || !(actionLink instanceof HTMLAnchorElement)) return;
      if (event.key !== " ") return;
      event.preventDefault();
      actionLink.click();
    });
  }
}

function initIntroOverlay() {
  const intro = document.querySelector("[data-intro-screen]");

  function markIntroDone() {
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-done");
  }

  if (!intro || document.body.dataset.page !== "home") {
    markIntroDone();
    return;
  }
  const image = intro.querySelector(".intro-screen__emblem");
  const storageKey = "lioncodexIntroSeen";

  function notifyIntroFinished() {
    markIntroDone();
    window.dispatchEvent(new CustomEvent("lioncodex:intro-finished"));
  }

  try {
    if (window.sessionStorage.getItem(storageKey) === "true") {
      intro.remove();
      notifyIntroFinished();
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
        notifyIntroFinished();
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

function initHeroAssistantCard() {
  if (document.body.dataset.page !== "home") return;

  const leoResponseBubble = document.querySelector("[data-leo-response-bubble]");
  if (!leoResponseBubble) return;

  const quickReplyMap = new Map([
    [
      "Θέλω περισσότερους πελάτες",
      {
        response:
          "Τότε το ζητούμενο είναι μια ψηφιακή παρουσία που εμπνέει εμπιστοσύνη, εξηγεί καθαρά την αξία σου και οδηγεί τον επισκέπτη σε επικοινωνία ή αγορά.",
        bubbleText:
          "Για περισσότερους πελάτες χρειάζεσαι μια ψηφιακή παρουσία που εμπνέει εμπιστοσύνη και οδηγεί τον επισκέπτη σε επικοινωνία ή αγορά.",
        bubbleActions: [
          { label: "Δες ιστοσελίδες", href: "#service-web-development" },
          { label: "Δες marketing", href: "services/digital-marketing.html" },
          { label: "Κλείσε στρατηγικό call", href: "#contact-booking" }
        ]
      }
    ],
    [
      "Θέλω online πωλήσεις",
      {
        response:
          "Εδώ η σωστή βάση είναι ένα e-shop που κάνει την αγορά εύκολη, καθαρή και αξιόπιστη, χωρίς να κουράζει τον πελάτη.",
        bubbleText:
          "Για online πωλήσεις χρειάζεσαι εμπειρία που χτίζει εμπιστοσύνη, μειώνει τριβές και οδηγεί τον χρήστη στο καλάθι.",
        bubbleActions: [
          { label: "Δες e-shop λύσεις", href: "#service-ecommerce" },
          { label: "Δες AI για e-shops", href: "#ai-solutions-preview" },
          { label: "Κλείσε στρατηγικό call", href: "#contact-booking" }
        ]
      }
    ],
    [
      "Θέλω καλύτερη online παρουσία",
      {
        response:
          "Αν η εικόνα σου online δεν σε εκπροσωπεί όπως πρέπει, ξεκινάμε από μια premium ιστοσελίδα με σωστή δομή, καθαρό μήνυμα και εμπειρία που δείχνει την αξία σου.",
        bubbleText:
          "Η online εικόνα σου πρέπει να εξηγεί καθαρά ποιος είσαι, τι προσφέρεις και γιατί να σε επιλέξει κάποιος.",
        bubbleActions: [
          { label: "Δες website design", href: "#service-web-development" },
          { label: "Δες portfolio", href: "#portfolio-preview" },
          { label: "Κλείσε στρατηγικό call", href: "#contact-booking" }
        ]
      }
    ],
    [
      "Με ενδιαφέρει AI",
      {
        response:
          "Η AI εμπειρία μπορεί να μετατρέψει το site σου από στατική παρουσία σε ενεργό εργαλείο καθοδήγησης, εξυπηρέτησης και συλλογής leads.",
        bubbleText:
          "Το AI μπορεί να γίνει ο έξυπνος βοηθός του site σου, να καθοδηγεί επισκέπτες και να αυξάνει τα σωστά leads.",
        bubbleActions: [
          { label: "Δες AI agents", href: "#ai-solutions-preview" },
          { label: "Δες AI Business Scan", href: "", disabled: true },
          { label: "Κλείσε στρατηγικό call", href: "#contact-booking" }
        ]
      }
    ]
  ]);

  let bubbleSequenceActive = false;
  let bubbleFallbackTimer = 0;
  const bubbleHighlightTimers = [];
  const welcomeBubbleState = {
    bubbleText: "Γεια! Είμαι ο Leo. Πες μου τι θέλεις να πετύχεις και θα σε οδηγήσω στη σωστή λύση.",
    bubbleActions: [
      { label: "Θέλω περισσότερους πελάτες", choice: "Θέλω περισσότερους πελάτες" },
      { label: "Θέλω online πωλήσεις", choice: "Θέλω online πωλήσεις" },
      { label: "Θέλω καλύτερη online παρουσία", choice: "Θέλω καλύτερη online παρουσία" },
      { label: "Με ενδιαφέρει AI", choice: "Με ενδιαφέρει AI" }
    ]
  };

  function triggerLeo3D(state) {
    if (typeof window.lionCodeXLeo3D?.playState === "function") {
      window.lionCodeXLeo3D.playState(state);
      return;
    }
    if (typeof window.lionCodeXLeo3D?.[state] === "function") {
      window.lionCodeXLeo3D[state]();
      return;
    }
    window.dispatchEvent(new CustomEvent("lioncodex:leo-state", { detail: { state } }));
  }

  function triggerLeo3DWhenReady(state) {
    triggerLeo3D(state);
    if (typeof window.lionCodeXLeo3D?.playState === "function") return;
    window.setTimeout(() => triggerLeo3D(state), 350);
  }

  function clearBubbleSequence() {
    window.clearTimeout(bubbleFallbackTimer);
    bubbleFallbackTimer = 0;
    while (bubbleHighlightTimers.length) {
      window.clearTimeout(bubbleHighlightTimers.pop());
    }
  }

  function renderLeoBubble(state, sequence = true) {
    if (!leoResponseBubble) return;

    const actions = state.bubbleActions || [];
    leoResponseBubble.innerHTML = `
      <p>${state.bubbleText || state.response}</p>
      <div class="leo-response-bubble__actions">
        ${actions
          .map((action, index) => {
            if (action.choice) {
              return `<button class="leo-response-bubble__cta" type="button" data-followup-index="${index}" data-leo-choice="${action.choice}">${action.label}</button>`;
            }
            const disabled = action.disabled || !action.href;
            const className = `leo-response-bubble__cta${disabled ? " is-disabled" : ""}`;
            if (disabled) {
              return `<span class="${className}" data-followup-index="${index}" aria-disabled="true">${action.label}</span>`;
            }
            return `<a class="${className}" data-followup-index="${index}" href="${relativePath(action.href)}">${action.label}</a>`;
          })
          .join("")}
      </div>
    `;
    leoResponseBubble.classList.add("is-visible");
    leoResponseBubble.classList.toggle("is-sequencing", sequence);
    leoResponseBubble.setAttribute("aria-hidden", "false");
    if (!sequence) {
      leoResponseBubble.querySelectorAll(".leo-response-bubble__cta").forEach((cta) => {
        cta.classList.add("is-revealed");
      });
    }
  }

  function finishBubbleSequence() {
    clearBubbleSequence();
    bubbleSequenceActive = false;
    if (!leoResponseBubble) return;
    leoResponseBubble.classList.remove("is-sequencing");
    leoResponseBubble.querySelectorAll(".leo-response-bubble__cta").forEach((cta) => {
      cta.classList.remove("is-highlighted");
      cta.classList.add("is-revealed");
    });
    triggerLeo3D("idle");
  }

  function runBubbleHighlights(durationSeconds = 0) {
    if (!leoResponseBubble) return;

    clearBubbleSequence();
    const ctas = Array.from(leoResponseBubble.querySelectorAll(".leo-response-bubble__cta"));
    ctas.forEach((cta) => {
      cta.classList.remove("is-highlighted", "is-revealed");
    });

    ctas.forEach((cta, index) => {
      const timer = window.setTimeout(() => {
        ctas.forEach((item) => item.classList.remove("is-highlighted"));
        cta.classList.add("is-highlighted", "is-revealed");
      }, 260 + index * 520);
      bubbleHighlightTimers.push(timer);
    });

    const sequenceMs = 620 + ctas.length * 520;
    const animationMs = durationSeconds > 0 ? durationSeconds * 1000 + 260 : 0;
    bubbleFallbackTimer = window.setTimeout(finishBubbleSequence, Math.max(2100, sequenceMs, animationMs));
  }

  function startBubbleSequence(state) {
    if (!leoResponseBubble) return;

    bubbleSequenceActive = true;
    renderLeoBubble(state, true);
    runBubbleHighlights();
  }

  function applyQuickReplySelection(selectedLabel) {
    if (bubbleSequenceActive) {
      console.info(`[Leo Concierge] Ignoring ${selectedLabel}; Leo response sequence is active.`);
      return;
    }
    console.info(`[Leo Concierge] Button clicked: ${selectedLabel}`);
    const nextState = quickReplyMap.get(selectedLabel);
    if (!nextState) {
      console.warn(`[Leo Concierge] No response configured for: ${selectedLabel}`);
      return;
    }
    startBubbleSequence(nextState);
    triggerLeo3D("talk");
  }

  console.info("[Leo Concierge] Initialized speech bubble assistant");

  renderLeoBubble(welcomeBubbleState, false);
  triggerLeo3DWhenReady("wave");

  leoResponseBubble?.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const cta = target?.closest(".leo-response-bubble__cta");
    if (!cta) return;
    const selectedLabel = cta.getAttribute("data-leo-choice");
    if (selectedLabel) {
      event.preventDefault();
      applyQuickReplySelection(selectedLabel);
      return;
    }
    if (bubbleSequenceActive || cta.classList.contains("is-disabled")) {
      event.preventDefault();
      return;
    }
    const href = cta.getAttribute("href");
    if (href?.startsWith("#")) {
      const destination = document.querySelector(href);
      if (destination) {
        event.preventDefault();
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }
    }
    window.lionCodeXLeo3D?.playState?.("walk");
  });

  window.addEventListener("lioncodex:leo-state-finished", (event) => {
    if (event.detail?.state === "talk" && bubbleSequenceActive) {
      finishBubbleSequence();
    }
  });

  window.addEventListener("lioncodex:leo-state-start", (event) => {
    if (event.detail?.state === "talk" && bubbleSequenceActive) {
      runBubbleHighlights(event.detail.duration);
    }
  });
}

function initStaticHeroAssistantDrag() {
  if (document.body.dataset.page !== "home") return;

  const hero = document.querySelector(".hero");
  const assistant = document.querySelector(".hero-assistant");
  const popout = document.querySelector(".hero-leo-popout");
  const handle = popout?.querySelector(".leo-mascot");
  const card = document.querySelector(".leo-chat-card");
  const mascotImage = handle?.querySelector("img");
  const messageThread = document.querySelector(".leo-chat-card__message");
  const chips = Array.from(document.querySelectorAll(".leo-chat-card__chip"));
  const actionWrap = document.querySelector(".leo-chat-card__actions");
  if (!hero || !assistant || !popout || !handle || !card || !mascotImage || !messageThread || !actionWrap) return;

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startRight = 0;
  let startTop = 0;
  let dragMoved = false;
  let dragPositionPrimed = false;
  const openClass = "is-open";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const leoBasePath = relativePath("assets/Leo");
  const defaultLeoFrames = [
    "Leo-peek-idle.png",
    "Leo-peek-wave.png",
    "Leo-idle1.png",
    "Leo-happy1.png",
    "Leo-wave1.png",
    "Leo-wave2.png",
    "Leo-talk1.png",
    "Leo-talk2.png",
    "Leo-talk3.png",
    "Leo-talk4.png",
    "Leo-excited.png"
  ];
  const leoStates = {
    idle: ["Leo-idle1.png", "Leo-happy1.png"],
    wave: ["Leo-wave1.png", "Leo-wave2.png"],
    talk: ["Leo-talk1.png", "Leo-talk2.png", "Leo-talk3.png", "Leo-talk4.png"],
    excited: ["Leo-excited.png"]
  };
  const peekIdleLeoImage = `${leoBasePath}/Leo-peek-idle.png`;
  const peekWaveLeoImage = `${leoBasePath}/Leo-peek-wave.png`;
  const idle1LeoImage = `${leoBasePath}/Leo-idle1.png`;
  const happy1LeoImage = `${leoBasePath}/Leo-happy1.png`;
  const fallbackLeoImage = happy1LeoImage;
  const idle2LeoImage = idle1LeoImage;
  const idle4LeoImage = happy1LeoImage;
  const initialLeoGreeting =
    "Γεια! Είμαι ο Leo.<br />Μπορώ να σε βοηθήσω να βρεις ποια ψηφιακή λύση ταιριάζει καλύτερα στην επιχείρησή σου.";
  let mascotState = "idle";
  let idleFrameIndex = 0;
  let currentMascotSrc = peekIdleLeoImage;
  let restingMascotSrc = happy1LeoImage;
  let isHoveringLeo = false;
  let stateTimeout = 0;
  let frameTimer = 0;
  let initialTalkPlayed = false;

  function isDesktop() {
    return window.innerWidth > 960;
  }

  function leoAsset(filename) {
    return `${leoBasePath}/${filename}`;
  }

  [...new Set([...defaultLeoFrames, ...Object.values(leoStates).flat()])].forEach((filename) => {
    const image = new Image();
    image.src = leoAsset(filename);
  });

  function setMascotFrame(src) {
    currentMascotSrc = src || fallbackLeoImage;
    mascotImage.src = currentMascotSrc;
  }

  function scrollMessageThreadToBottom() {
    messageThread.scrollTop = messageThread.scrollHeight;
  }

  function pushMessage(role, html) {
    const entry = document.createElement("div");
    entry.className = `leo-chat-card__entry leo-chat-card__entry--${role}`;
    entry.innerHTML = `<p>${html}</p>`;
    messageThread.append(entry);
    scrollMessageThreadToBottom();
  }

  function resetMessageThread() {
    messageThread.innerHTML = "";
    pushMessage("leo", initialLeoGreeting);
    actionWrap.innerHTML = "";
  }

  mascotImage.addEventListener("error", () => {
    const fallbackIndex = defaultLeoFrames.findIndex((filename) => mascotImage.src.endsWith(filename));
    const nextFallback = defaultLeoFrames[fallbackIndex + 1];
    if (nextFallback) {
      setMascotFrame(leoAsset(nextFallback));
      return;
    }
    if (mascotImage.src !== fallbackLeoImage) {
      setMascotFrame(fallbackLeoImage);
    }
  });

  function clearLeoTimers() {
    window.clearTimeout(stateTimeout);
    window.clearTimeout(frameTimer);
    stateTimeout = 0;
    frameTimer = 0;
    mascotImage.classList.remove("is-popping");
  }

  function setRestingMascot(src) {
    restingMascotSrc = src;
  }

  function enterIdleState() {
    mascotState = "idle";
    idleFrameIndex = 0;
    setMascotFrame(restingMascotSrc);
  }

  function enterIdle2State() {
    mascotState = "idle";
    idleFrameIndex = 0;
    setRestingMascot(idle2LeoImage);
    setMascotFrame(idle2LeoImage);
  }

  function enterHappyRestingState() {
    mascotState = "idle";
    idleFrameIndex = 0;
    setRestingMascot(happy1LeoImage);
    setMascotFrame(happy1LeoImage);
  }

  function playFrameSequence(frames, frameDuration, onComplete) {
    let frameIndex = 0;
    const tick = () => {
      setMascotFrame(leoAsset(frames[frameIndex]));
      frameIndex += 1;
      if (frameIndex >= frames.length) {
        onComplete?.();
        return;
      }
      frameTimer = window.setTimeout(tick, frameDuration);
    };
    tick();
  }

  function playLeoState(state, totalDuration) {
    const frames = leoStates[state];
    if (!frames?.length) {
      enterIdleState();
      return;
    }

    clearLeoTimers();
    mascotState = state;
    const frameDuration = Math.max(120, Math.round(totalDuration / frames.length));

    playFrameSequence(frames, frameDuration, () => {
      if (state === "talk") {
        stateTimeout = window.setTimeout(() => {
          enterIdleState();
        }, 160);
        return;
      }

      if (state === "excited") {
        stateTimeout = window.setTimeout(() => {
          enterIdleState();
        }, 220);
        return;
      }

      enterIdleState();
    });
  }

  function triggerLeoInteractionState(state) {
    if (state === "wave") {
      playLeoState("wave", 1400);
      return;
    }
    if (state === "talk") {
      playLeoState("talk", 1200);
      return;
    }
    if (state === "excited") {
      playLeoState("excited", 1800);
    }
  }

  function playInitialLeoTalk() {
    if (initialTalkPlayed) return;
    initialTalkPlayed = true;
    clearLeoTimers();

    if (reducedMotion.matches) {
      setMascotFrame(idle1LeoImage);
      stateTimeout = window.setTimeout(() => {
        enterHappyRestingState();
      }, 1200);
      return;
    }

    mascotState = "wave";
    setMascotFrame(peekIdleLeoImage);
    // Restart the one-time pop-out animation on load.
    void mascotImage.offsetWidth;
    mascotImage.classList.add("is-popping");

    stateTimeout = window.setTimeout(() => {
      setMascotFrame(peekWaveLeoImage);
      stateTimeout = window.setTimeout(() => {
        mascotImage.classList.remove("is-popping");
        enterIdle2State();
        stateTimeout = window.setTimeout(() => {
          enterHappyRestingState();
        }, 1200);
      }, 680);
    }, 420);
  }

  function syncExpandedState() {
    handle.setAttribute("aria-expanded", String(assistant.classList.contains(openClass)));
  }

  function toggleAssistant(force) {
    assistant.classList.add(openClass);
    syncExpandedState();
    if (force !== false) {
      triggerLeoInteractionState("wave");
    }
  }

  const quickReplyMap = new Map([
    [
      "Θέλω περισσότερους πελάτες",
      {
        response:
          "Τότε το ζητούμενο είναι μια ψηφιακή παρουσία που εμπνέει εμπιστοσύνη, εξηγεί καθαρά την αξία σου και οδηγεί τον επισκέπτη σε επικοινωνία ή αγορά.",
        actions: [
          { label: "Δες ιστοσελίδες", href: "services/website-development.html" },
          { label: "Δες marketing", href: "services/digital-marketing.html" },
          { label: "Κλείσε στρατηγικό call", href: "contact.html" }
        ]
      }
    ],
    [
      "Θέλω online πωλήσεις",
      {
        response:
          "Εδώ η σωστή βάση είναι ένα e-shop που κάνει την αγορά εύκολη, καθαρή και αξιόπιστη, χωρίς να κουράζει τον πελάτη.",
        actions: [
          { label: "Δες e-shops", href: "services/ecommerce.html" },
          { label: "Δες AI για e-shop", href: "ai-solutions.html" },
          { label: "Ζήτησε πρόταση", href: "contact.html" }
        ]
      }
    ],
    [
      "Θέλω καλύτερη online παρουσία",
      {
        response:
          "Αν η εικόνα σου online δεν σε εκπροσωπεί όπως πρέπει, ξεκινάμε από μια premium ιστοσελίδα με σωστή δομή, καθαρό μήνυμα και εμπειρία που δείχνει την αξία σου.",
        actions: [
          { label: "Δες websites", href: "services/website-development.html" },
          { label: "Δες portfolio", href: "portfolio.html" },
          { label: "Μίλησε μαζί μας", href: "contact.html" }
        ]
      }
    ],
    [
      "Με ενδιαφέρει AI",
      {
        response:
          "Η AI εμπειρία μπορεί να μετατρέψει το site σου από στατική παρουσία σε ενεργό εργαλείο καθοδήγησης, εξυπηρέτησης και συλλογής leads.",
        actions: [
          { label: "Δες AI Solutions", href: "ai-solutions.html" },
          { label: "Πώς εφαρμόζεται", href: "ai-solutions.html" },
          { label: "Θέλω demo concept", href: "contact.html" }
        ]
      }
    ]
  ]);

  function renderActionLinks(actions = []) {
    actionWrap.innerHTML = actions
      .map(
        (action) =>
          `<a class="leo-chat-card__action" href="${relativePath(action.href)}">${action.label}</a>`
      )
      .join("");
  }

  function setActiveQuickReply(selectedLabel) {
    chips.forEach((chip) => {
      const isActive = chip.textContent?.trim() === selectedLabel;
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyQuickReplySelection(selectedLabel) {
    const nextState = quickReplyMap.get(selectedLabel);
    if (!nextState) return;
    setActiveQuickReply(selectedLabel);
    messageThread.innerHTML = "";
    pushMessage("user", selectedLabel);
    pushMessage("leo", nextState.response);
    renderActionLinks(nextState.actions);
    triggerLeoInteractionState("talk");
  }

  handle.setAttribute("aria-controls", "hero-leo-chat-card");
  card.id = "hero-leo-chat-card";
  assistant.classList.add(openClass);
  syncExpandedState();
  chips.forEach((chip) => chip.setAttribute("aria-pressed", "false"));

  function applyDesktopBase() {
    if (!isDesktop()) {
      assistant.style.removeProperty("right");
      assistant.style.removeProperty("top");
      assistant.style.removeProperty("left");
      assistant.style.removeProperty("bottom");
      return false;
    }

    const heroRect = hero.getBoundingClientRect();
    const assistantRect = assistant.getBoundingClientRect();
    const currentRight = heroRect.right - assistantRect.right;
    const currentTop = assistantRect.top - heroRect.top;
    assistant.style.left = "auto";
    assistant.style.bottom = "auto";
    assistant.style.right = `${Math.max(0, currentRight)}px`;
    assistant.style.top = `${Math.max(0, currentTop)}px`;
    return true;
  }

  function clampPosition(nextRight, nextTop) {
    const heroRect = hero.getBoundingClientRect();
    const assistantRect = assistant.getBoundingClientRect();
    const maxRight = Math.max(16, heroRect.width - assistantRect.width);
    const maxTop = Math.max(16, heroRect.height - assistantRect.height);
    return {
      right: Math.min(Math.max(16, nextRight), maxRight),
      top: Math.min(Math.max(16, nextTop), maxTop)
    };
  }

  handle.addEventListener("pointerdown", (event) => {
    if (!isDesktop()) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();
    clearLeoTimers();
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startRight = 0;
    startTop = 0;
    dragMoved = false;
    dragPositionPrimed = false;
    assistant.classList.add("is-dragging");
    handle.setPointerCapture(pointerId);
  });

  handle.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!dragMoved && Math.hypot(deltaX, deltaY) > 6) {
      dragMoved = true;
      if (!applyDesktopBase()) return;
      startRight = parseFloat(assistant.style.right) || 0;
      startTop = parseFloat(assistant.style.top) || 0;
      dragPositionPrimed = true;
    }
    if (!dragPositionPrimed) return;
    const clamped = clampPosition(startRight - deltaX, startTop + deltaY);
    assistant.style.right = `${clamped.right}px`;
    assistant.style.top = `${clamped.top}px`;
  });

  function stopDrag(event, allowToggle = true) {
    if (pointerId !== event.pointerId) return;
    if (handle.hasPointerCapture(pointerId)) {
      handle.releasePointerCapture(pointerId);
    }
    const shouldToggle = allowToggle && !dragMoved;
    pointerId = null;
    assistant.classList.remove("is-dragging");
    dragMoved = false;
    dragPositionPrimed = false;
    if (shouldToggle) {
      toggleAssistant(true);
      return;
    }
    if (!isHoveringLeo && !reducedMotion.matches) {
      enterIdleState();
    }
  }

  handle.addEventListener("pointerup", (event) => stopDrag(event, true));
  handle.addEventListener("pointercancel", (event) => stopDrag(event, false));
  handle.addEventListener("click", (event) => {
    if (isDesktop()) {
      event.preventDefault();
      return;
    }
    toggleAssistant(true);
  });
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selectedLabel = chip.textContent?.trim();
      if (!selectedLabel) return;
      applyQuickReplySelection(selectedLabel);
    });
  });
  handle.addEventListener("pointerenter", () => {
    isHoveringLeo = true;
    clearLeoTimers();
    mascotState = "hover";
    setMascotFrame(idle4LeoImage);
  });
  handle.addEventListener("pointerleave", () => {
    isHoveringLeo = false;
    enterIdleState();
  });
  window.addEventListener("resize", () => {
    if (!isDesktop()) {
      assistant.classList.remove("is-dragging");
      assistant.style.removeProperty("right");
      assistant.style.removeProperty("top");
      assistant.style.removeProperty("left");
      assistant.style.removeProperty("bottom");
      return;
    }
    applyDesktopBase();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearLeoTimers();
      return;
    }
    if (reducedMotion.matches) {
      setMascotFrame(fallbackLeoImage);
      return;
    }
    enterIdleState();
  });

  if (reducedMotion.matches) {
    setRestingMascot(fallbackLeoImage);
    setMascotFrame(fallbackLeoImage);
  } else {
    enterHappyRestingState();
  }
  resetMessageThread();

  if (document.body.classList.contains("intro-active")) {
    window.addEventListener(
      "lioncodex:intro-finished",
      () => {
        playInitialLeoTalk();
      },
      { once: true }
    );
  } else {
    playInitialLeoTalk();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initPageLeoGuide();
  initIntroOverlay();
  initHeroAssistantCard();
  initCodeRain();
  initReveal();
  initPortfolioFilters();
});
