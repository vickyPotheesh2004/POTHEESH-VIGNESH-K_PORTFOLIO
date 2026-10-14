/**
 * Runs before first paint, in <head>, synchronously.
 *
 * Sets `data-theme` on <html> from the stored preference, falling back to the
 * operating system setting. Because this executes before the body renders,
 * there is never a flash of the wrong theme — and because the value lives on
 * the DOM rather than in React state, there is no hydration mismatch either.
 */
export const THEME_STORAGE_KEY = "pv-theme";

export const themeScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=(s==="dark"||s==="light")?s:(d?"dark":"light");var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
