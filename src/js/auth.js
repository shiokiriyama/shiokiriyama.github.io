// auth.js
/**
 * Sets up password-protected links on the page.
 *
 * Call the returned `init` function when you want to attach handlers (e.g., after DOM is ready).
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.selector=".protected-link"] - CSS selector for target links
 * @param {string} [options.password="pass"] - Password required for access
 * @param {"redirect"|"silent"} [options.errorMode="redirect"] - Behavior on authentication failure
 * @param {string} [options.promptMessage="パスワードを入力してください"] - Message shown in prompt()
 *
 * @example
 * const initProtected = setupProtectedLinks({
 *   selector: ".protected-link",
 *   password: "secret123",
 *   errorMode: "redirect",
 *   promptMessage: "管理用パスワードを入力してください"
 * });
 *
 * // call when appropriate, e.g.:
 * document.addEventListener("DOMContentLoaded", initProtected);
 */
function setupProtectedLinks(options = {}) {
  const {
    selector = '.protected-link',
    password = 'pass',
    errorMode = 'redirect',
    promptMessage = 'パスワードを入力してください',
  } = options;

  const validAuth = btoa(password);

  /**
   * Redirects to /404.html if errorMode is "redirect".
   * If errorMode is "silent", does nothing.
   */
  const redirectToError = () => {
    if (errorMode === 'redirect') {
      location.href = '/404.html';
    }
  };

  /**
   * Click handler factory for a link element.
   * @param {HTMLAnchorElement} link
   * @returns {Function}
   */
  const makeHandler = (link) => (e) => {
    e.preventDefault();

    const input = prompt(promptMessage);
    if (!input) {
      redirectToError();
      return;
    }

    if (btoa(input) === validAuth) {
      // Respect target attribute if present and equals "_blank"
      if (link.target && link.target.toLowerCase() === '_blank') {
        window.open(link.href, '_blank');
      } else {
        location.href = link.href;
      }
    } else {
      redirectToError();
    }
  };

  /**
   * Attach handlers to matching links.
   * Safe to call multiple times; same element won't get duplicate handlers.
   */
  const init = () => {
    const links = document.querySelectorAll(selector);
    links.forEach((link) => {
      if (link._protectedBound) return;
      const handler = makeHandler(link);
      link.addEventListener('click', handler);
      link._protectedBound = true;
    });
  };

  return init;
}
