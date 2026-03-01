/**
 * theme.js
 * Manages dark / light / system theme with localStorage persistence.
 * The chosen preference is stored under the key 'theme-preference'.
 * Possible values: 'light', 'dark', 'system' (default).
 */

const STORAGE_KEY = 'theme-preference';

/**
 * Applies the correct class to <html> based on the resolved theme.
 */
function applyTheme(preference) {
    const root = document.documentElement;

    if (preference === 'dark') {
        root.classList.add('dark');
    } else if (preference === 'light') {
        root.classList.remove('dark');
    } else {
        // system — follow OS preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
}

/**
 * Returns the currently stored preference ('light' | 'dark' | 'system').
 */
export function getThemePreference() {
    return localStorage.getItem(STORAGE_KEY) || 'system';
}

/**
 * Persists + applies a new theme preference.
 * @param {'light'|'dark'|'system'} preference
 */
export function setThemePreference(preference) {
    localStorage.setItem(STORAGE_KEY, preference);
    applyTheme(preference);
}

/**
 * Binds the radio buttons inside the Settings view (if present)
 * to the theme manager.  Safe to call at any time — silently
 * does nothing when the Settings view is not loaded.
 */
export function bindSettingsControls() {
    const radios = document.querySelectorAll('input[name="theme-mode"]');
    if (!radios.length) return;

    const current = getThemePreference();

    // Map each radio to a preference value via data attribute
    radios.forEach(radio => {
        const pref = radio.dataset.theme;
        if (!pref) return;

        // Reflect current preference in the UI
        radio.checked = (pref === current);

        // Update styling on the parent containers
        updateRadioStyles(radio);

        radio.addEventListener('change', () => {
            setThemePreference(pref);
            // Update all radio container styles
            radios.forEach(r => updateRadioStyles(r));
        });
    });
}

/**
 * Toggles the highlighted border on the radio-button container
 * so the "selected" option looks distinct.
 */
function updateRadioStyles(radio) {
    const container = radio.closest('.theme-option');
    if (!container) return;

    if (radio.checked) {
        container.classList.add('border-primary/30', 'bg-primary/5', 'dark:bg-primary/10');
        container.classList.remove('border-gray-200', 'dark:border-border-dark', 'bg-gray-50', 'dark:bg-gray-800/50');
    } else {
        container.classList.remove('border-primary/30', 'bg-primary/5', 'dark:bg-primary/10');
        container.classList.add('border-gray-200', 'dark:border-border-dark', 'bg-gray-50', 'dark:bg-gray-800/50');
    }
}

/**
 * Initialise: apply persisted preference and listen for OS changes.
 */
export function initTheme() {
    applyTheme(getThemePreference());

    // React to OS theme changes when preference is 'system'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getThemePreference() === 'system') {
            applyTheme('system');
        }
    });
}
