import { debounce } from './debounce.js';
/**
 * @fileoverview Core frontend utilities for a personal website (TypeScript)
 */
/* -------------------- Core Utilities -------------------- */
/** Setup hamburger menu toggle */
export const setupHamburgerMenu = () => {
    const hamburgerBtn = document.querySelector("#hamburgerBtn");
    const navMenu = document.querySelector("#navMenu");
    if (!hamburgerBtn || !navMenu)
        return;
    hamburgerBtn.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });
};
/** Setup basic email form validation */
export const setupFormValidation = (formSelector) => {
    const form = document.querySelector(formSelector);
    if (!form)
        return;
    form.addEventListener("submit", (event) => {
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && !emailField.value.includes("@")) {
            event.preventDefault();
            alert("Please enter a valid email address.");
            emailField.focus();
        }
    });
};
/** Setup scroll-to-top button */
export const setupScrollTopButton = (buttonSelector) => {
    const scrollBtn = document.querySelector(buttonSelector);
    if (!scrollBtn)
        return;
    window.addEventListener("scroll", () => {
        scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
};
/** Fade in elements when scrolled into view */
export const setupFadeInOnScroll = (targetSelector) => {
    const targets = document.querySelectorAll(targetSelector);
    if (!targets.length)
        return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    targets.forEach((el) => observer.observe(el));
};
/** Setup popup with LocalStorage persistence */
export const setupPopup = (popupSelector, closeSelector, storageKey) => {
    const popupEl = document.querySelector(popupSelector);
    const closeBtn = document.querySelector(closeSelector);
    if (!popupEl || !closeBtn || !storageKey)
        return;
    if (!localStorage.getItem(storageKey)) {
        popupEl.style.display = "block";
    }
    closeBtn.addEventListener("click", () => {
        localStorage.setItem(storageKey, "closed");
        popupEl.style.display = "none";
    });
};
/** Trigger a callback when a target element enters the viewport */
export const setupScrollTrigger = (targetSelector, onVisible, threshold = 0.1) => {
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl)
        return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                onVisible(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold });
    observer.observe(targetEl);
};
/** Setup debounced window resize listener */
export const setupDebouncedResize = (callback, delay = 250) => {
    if (typeof callback !== "function")
        return;
    const debounced = debounce(callback, delay);
    debounced(); // initial call
    window.addEventListener("resize", debounced);
};
/* -------------------- Site Initialization -------------------- */
/** Initialize all core frontend utilities */
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
