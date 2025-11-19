import { debounce } from './debounce.js';

/**
 * @fileoverview Core frontend utilities for a personal website (TypeScript)
 */

/* -------------------- Core Utilities -------------------- */

/** Setup hamburger menu toggle */
export const setupHamburgerMenu = (): void => {
  const hamburgerBtn = document.querySelector<HTMLButtonElement>("#hamburgerBtn");
  const navMenu = document.querySelector<HTMLElement>("#navMenu");
  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
};

/** Setup basic email form validation */
export const setupFormValidation = (formSelector: string): void => {
  const form = document.querySelector<HTMLFormElement>(formSelector);
  if (!form) return;

  form.addEventListener("submit", (event) => {
    const emailField = form.querySelector<HTMLInputElement>('input[type="email"]');
    if (emailField && !emailField.value.includes("@")) {
      event.preventDefault();
      alert("Please enter a valid email address.");
      emailField.focus();
    }
  });
};

/** Setup scroll-to-top button */
export const setupScrollTopButton = (buttonSelector: string): void => {
  const scrollBtn = document.querySelector<HTMLElement>(buttonSelector);
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/** Fade in elements when scrolled into view */
export const setupFadeInOnScroll = (targetSelector: string): void => {
  const targets = document.querySelectorAll<HTMLElement>(targetSelector);
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
};

/** Setup popup with LocalStorage persistence */
export const setupPopup = (
  popupSelector: string,
  closeSelector: string,
  storageKey: string
): void => {
  const popupEl = document.querySelector<HTMLElement>(popupSelector);
  const closeBtn = document.querySelector<HTMLElement>(closeSelector);
  if (!popupEl || !closeBtn || !storageKey) return;

  if (!localStorage.getItem(storageKey)) {
    popupEl.style.display = "block";
  }

  closeBtn.addEventListener("click", () => {
    localStorage.setItem(storageKey, "closed");
    popupEl.style.display = "none";
  });
};

/** Trigger a callback when a target element enters the viewport */
export const setupScrollTrigger = (
  targetSelector: string,
  onVisible: (el: HTMLElement) => void,
  threshold: number = 0.1
): void => {
  const targetEl = document.querySelector<HTMLElement>(targetSelector);
  if (!targetEl) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible(entry.target as HTMLElement);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  observer.observe(targetEl);
};

/** Setup debounced window resize listener */
export const setupDebouncedResize = (
  callback: () => void,
  delay: number = 250
): void => {
  if (typeof callback !== "function") return;

  const debounced = debounce(callback, delay);
  debounced(); // initial call
  window.addEventListener("resize", debounced);
};

/* -------------------- Site Initialization -------------------- */

/** Initialize all core frontend utilities */
export const setupSite = (): void => {
  setupHamburgerMenu();
  setupFormValidation("#contactForm");
  setupScrollTopButton("#topBtn");
  setupFadeInOnScroll(".fade-in");
  setupPopup("#popup", "#closePopup", "popupClosed");

  setupScrollTrigger("#section1", () => {
    console.log("#section1 is now visible!");
  });

  setupDebouncedResize(() => {
    console.log("Window resized - debounced");
  });
};

// Auto-initialize after DOM is loaded
document.addEventListener("DOMContentLoaded", setupSite);
