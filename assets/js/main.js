/* VERRIN — interactions
   Minimal, dependency-light. Lucide loaded via CDN in each page. */
(function () {
  "use strict";

  /* ---- Lucide icons ---- */
  function icons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---- Sticky header state ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    var i = toggle.querySelector("[data-lucide]");
    if (i) { i.setAttribute("data-lucide", open ? "x" : "menu"); icons(); }
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Prefill interest from ?package= on the contact page ---- */
  try {
    var pkg = new URLSearchParams(window.location.search).get("package");
    var interest = document.getElementById("interest");
    if (pkg && interest) {
      interest.value = "packages";
      if (interest.value !== "packages") interest.selectedIndex = 0;
    }
  } catch (e) { /* no-op */ }

  /* ---- Contact form (front-end only; submission goes nowhere) ---- */
  var form = document.querySelector("[data-verrin-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var success = form.querySelector(".form-success");
      var fields = form.querySelector(".form-fields");
      if (success) {
        success.classList.add("show");
        success.setAttribute("role", "status");
      }
      if (fields) { fields.style.display = "none"; }
      // Scroll the confirmation into view without jarring jumps
      if (success && success.scrollIntoView) {
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }

  icons();
  // Re-run icon creation once fonts/CDN settle
  window.addEventListener("load", icons);
})();
