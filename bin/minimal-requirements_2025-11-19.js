import { debounce } from './debounce.js';

/**
 * @fileoverview Core frontend utilities for a personal website (ESM)
 * Features:
 * - Hamburger menu toggle
 * - Form validation
 * - Scroll-to-top button
 * - Fade-in on scroll
 * - Popup control with LocalStorage
 * - Scroll-triggered callbacks
 * - Debounced window resize
 */

/* -------------------- Core Utilities -------------------- */

/**
 * Setup hamburger menu toggle
 */
export const setupHamburgerMenu = () => {
  const hamburgerBtn = document.querySelector("#hamburgerBtn");
  const navMenu = document.querySelector("#navMenu");
  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
};

/**
 * Setup basic email form validation
 * @param {string} formSelector CSS selector for the form
 */
export const setupFormValidation = (formSelector) => {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", (event) => {
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !emailField.value.includes("@")) {
      event.preventDefault();
      alert("Please enter a valid email address.");
      emailField.focus();
    }
  });
};

/**
 * Setup scroll-to-top button visibility and click behavior
 * @param {string} buttonSelector CSS selector for the button
 */
export const setupScrollTopButton = (buttonSelector) => {
  const scrollBtn = document.querySelector(buttonSelector);
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/**
 * Fade in elements when scrolled into view
 * @param {string} targetSelector CSS selector for elements
 */
export const setupFadeInOnScroll = (targetSelector) => {
  const targets = document.querySelectorAll(targetSelector);
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

/**
 * Setup a popup with close button and LocalStorage persistence
 * @param {string} popupSelector
 * @param {string} closeSelector
 * @param {string} storageKey
 */
export const setupPopup = (popupSelector, closeSelector, storageKey) => {
  const popupEl = document.querySelector(popupSelector);
  const closeBtn = document.querySelector(closeSelector);
  if (!popupEl || !closeBtn || !storageKey) return;

  if (!localStorage.getItem(storageKey)) {
    popupEl.style.display = "block";
  }

  closeBtn.addEventListener("click", () => {
    localStorage.setItem(storageKey, "closed");
    popupEl.style.display = "none";
  });
};

/**
 * Trigger a callback when a target element enters the viewport
 * @param {string} targetSelector
 * @param {Function} onVisible callback
 * @param {number} [threshold=0.1]
 */
export const setupScrollTrigger = (targetSelector, onVisible, threshold = 0.1) => {
  const targetEl = document.querySelector(targetSelector);
  if (!targetEl || typeof onVisible !== "function") return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  observer.observe(targetEl);
};

/**
 * Setup debounced window resize listener
 * @param {Function} callback
 * @param {number} [delay=250]
 */
export const setupDebouncedResize = (callback, delay = 250) => {
  if (typeof callback !== "function") return;

  const debounced = debounce(callback, delay);
  debounced(); // initial call
  window.addEventListener("resize", debounced);
};

/* -------------------- Site Initialization -------------------- */

/**
 * Initialize all core frontend utilities
 */
export const setupSite = () => {
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
