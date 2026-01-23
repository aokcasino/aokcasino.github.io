// Helpers
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

/** ===== Year ===== */
$("#year").textContent = new Date().getFullYear();

/** ===== Mobile menu ===== */
const burger = $("#burger");
const navPanel = $("#navPanel");

burger?.addEventListener("click", () => {
  const open = navPanel.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});

/** ===== Dropdown "Nos gammes" ===== */
const dropdown = $(".dropdown");
const dropdownBtn = $(".dropdown__btn");

dropdownBtn?.addEventListener("click", () => {
  const isOpen = dropdown.classList.toggle("is-open");
  dropdownBtn.setAttribute("aria-expanded", String(isOpen));
});

// Click outside close
document.addEventListener("click", (e) => {
  const isClickInside = dropdown?.contains(e.target);
  if (dropdown && dropdown.classList.contains("is-open") && !isClickInside) {
    dropdown.classList.remove("is-open");
    dropdownBtn?.setAttribute("aria-expanded", "false");
  }
});

/** ===== Hero slider ===== */
const slides = $$("[data-slide]");
const dotsWrap = $("#heroDots");
let idx = 0;
let timer = null;

function renderDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dot" + (i === idx ? " is-active" : "");
    b.type = "button";
    b.setAttribute("aria-label", `Aller à la slide ${i + 1}`);
    b.addEventListener("click", () => go(i, true));
    dotsWrap.appendChild(b);
  });
}

function go(next, userTriggered=false) {
  slides[idx].classList.remove("is-active");
  idx = (next + slides.length) % slides.length;
  slides[idx].classList.add("is-active");
  renderDots();
  if (userTriggered) restartAuto();
}

function restartAuto() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => go(idx + 1), 6500);
}

$("#prevSlide")?.addEventListener("click", () => go(idx - 1, true));
$("#nextSlide")?.addEventListener("click", () => go(idx + 1, true));

renderDots();
restartAuto();

/** ===== Search drawer ===== */
const searchBtn = $("#searchBtn");
const search = $("#search");
const searchClose = $("#searchClose");
const searchInput = $("#searchInput");

function openSearch() {
  search.hidden = false;
  setTimeout(() => searchInput?.focus(), 50);
}
function closeSearch() {
  search.hidden = true;
}

searchBtn?.addEventListener("click", () => {
  if (search.hidden) openSearch();
  else closeSearch();
});
searchClose?.addEventListener("click", closeSearch);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!search.hidden) closeSearch();
  }
});

/** ===== Language menu (UI only) ===== */
const langBtn = $("#langBtn");
const langMenu = $("#langMenu");
const langLabel = $(".lang__label");

function toggleLangMenu() {
  const isOpen = !langMenu.hidden;
  langMenu.hidden = isOpen;
  langBtn.setAttribute("aria-expanded", String(!isOpen));
}

langBtn?.addEventListener("click", toggleLangMenu);

langMenu?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-lang]");
  if (!btn) return;
  const code = btn.dataset.lang;
  langLabel.textContent = code;
  // Ici tu peux rediriger vers /en/ /de/ etc si tu fais une vraie structure multi-langues
  langMenu.hidden = true;
  langBtn.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", (e) => {
  if (!langBtn?.contains(e.target) && !langMenu?.contains(e.target)) {
    if (langMenu && !langMenu.hidden) {
      langMenu.hidden = true;
      langBtn.setAttribute("aria-expanded", "false");
    }
  }
});

/** ===== Footer language pills (same UI) ===== */
$$(".pill[data-lang]").forEach((b) => {
  b.addEventListener("click", () => {
    langLabel.textContent = b.dataset.lang;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/** ===== Cookie banner ===== */
const cookie = $("#cookie");
const cookieAccept = $("#cookieAccept");
const cookieMore = $("#cookieMore");
const COOKIE_KEY = "cookieConsent";

function showCookie() {
  cookie.hidden = false;
}
function hideCookie() {
  cookie.hidden = true;
}

if (!localStorage.getItem(COOKIE_KEY)) {
  showCookie();
}

cookieAccept?.addEventListener("click", () => {
  localStorage.setItem(COOKIE_KEY, "accepted");
  hideCookie();
});

cookieMore?.addEventListener("click", () => {
  alert("Ajoute ici ton lien vers la page 'Politique de cookies' / 'Confidentialité'.");
});

/** ===== Contact form (front only demo) ===== */
const contactForm = $("#contactForm");
const formNote = $("#formNote");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  formNote.textContent = "Message prêt (demo). Branche un backend / Formspree / Netlify Forms si besoin.";
  contactForm.reset();
});
