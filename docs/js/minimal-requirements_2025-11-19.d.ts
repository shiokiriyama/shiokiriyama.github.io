/**
 * @fileoverview Core frontend utilities for a personal website (TypeScript)
 */
/** Setup hamburger menu toggle */
export declare const setupHamburgerMenu: () => void;
/** Setup basic email form validation */
export declare const setupFormValidation: (formSelector: string) => void;
/** Setup scroll-to-top button */
export declare const setupScrollTopButton: (buttonSelector: string) => void;
/** Fade in elements when scrolled into view */
export declare const setupFadeInOnScroll: (targetSelector: string) => void;
/** Setup popup with LocalStorage persistence */
export declare const setupPopup: (popupSelector: string, closeSelector: string, storageKey: string) => void;
/** Trigger a callback when a target element enters the viewport */
export declare const setupScrollTrigger: (targetSelector: string, onVisible: (el: HTMLElement) => void, threshold?: number) => void;
/** Setup debounced window resize listener */
export declare const setupDebouncedResize: (callback: () => void, delay?: number) => void;
/** Initialize all core frontend utilities */
export declare const setupSite: () => void;
