// FIX 1: Null checks — prevents crash if elements don't exist in the DOM
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

  // FIX 2: Update aria-expanded when menu opens/closes (screen reader support)
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // FIX 3: Close menu when any nav link is clicked (mobile UX — menu was staying open)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // FIX 4: Close menu when clicking anywhere outside of it
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // FIX 5: Close menu with Escape key and return focus to the toggle button
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  });

  // FIX 6: Close menu if window is resized to desktop width (prevents ghost-open menu)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────────────────────────

const reveals = document.querySelectorAll(".reveal");

// FIX 7: Replaced scroll event listener with IntersectionObserver
//         — far better performance, no scroll event jank, no manual calculations
if ("IntersectionObserver" in window) {

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // FIX 8: Unobserve after activating — no point watching an already-revealed element
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      // FIX 9: rootMargin replicates the original 88% trigger point cleanly
      rootMargin: "0px 0px -10% 0px"
    }
  );

  reveals.forEach((el) => observer.observe(el));

} else {
  // FIX 10: Fallback for very old browsers — just show everything immediately
  reveals.forEach((el) => el.classList.add("active"));
}
window.addEventListener("scroll", () => {
  let elements = document.querySelectorAll(".reveal");

  elements.forEach(el => {
    let position = el.getBoundingClientRect().top;
    let screenHeight = window.innerHeight;

    if (position < screenHeight - 100) {
      el.classList.add("active");
    }
  });
});
