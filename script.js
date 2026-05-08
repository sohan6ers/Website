const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Subtle dynamics: reveal-on-scroll + active nav highlight
const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const sections = Array.from(
  document.querySelectorAll("main section[id]")
);
const navLinks = Array.from(
  document.querySelectorAll('nav[aria-label="Primary"] a[href^="#"]')
);

function setActiveNav(id) {
  for (const a of navLinks) {
    const isActive = a.getAttribute("href") === `#${id}`;
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
}

// Add reveal class to key blocks
const revealEls = Array.from(
  document.querySelectorAll(".card, .hero-copy, .hero-card")
);
for (const el of revealEls) el.classList.add("reveal");

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  for (const el of revealEls) revealObs.observe(el);
} else {
  for (const el of revealEls) el.classList.add("is-visible");
}

if ("IntersectionObserver" in window) {
  const sectionObs = new IntersectionObserver(
    (entries) => {
      // Pick the most visible intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (visible?.target?.id) setActiveNav(visible.target.id);
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.2, 0.35, 0.5] }
  );

  for (const s of sections) sectionObs.observe(s);
}

