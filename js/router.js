/**
 * router.js
 * SPA-style view switching with fetch-based partial loading and caching.
 */
import { closeMobileSidebar } from './sidebar.js';
import { bindSettingsControls } from './theme.js';
// Map navigation link IDs to view file names
const VIEW_MAP = {
    'nav-resource': 'resource-allocation',
    'nav-departments': 'departments',
    'nav-faculty': 'faculty',
    'nav-lab-load': 'lab-load',
    'nav-reports': 'reports',
    'nav-grants': 'grant-tracking',
    'nav-settings': 'settings'
};

// Active style classes
const ACTIVE_CLASSES = ['bg-primary/10', 'text-primary', 'font-medium', 'dark:bg-primary/20'];
const INACTIVE_CLASSES = ['text-gray-500', 'hover:bg-gray-50', 'hover:text-gray-900', 'dark:text-gray-400', 'dark:hover:bg-gray-800', 'dark:hover:text-white'];

// Cache for loaded view HTML
const viewCache = {};

/**
 * Fetches a view partial from views/ directory.
 * Uses an in-memory cache to avoid redundant network requests.
 */
async function fetchView(viewName) {
    if (viewCache[viewName]) {
        return viewCache[viewName];
    }

    try {
        const response = await fetch(`views/${viewName}.html`);
        if (!response.ok) throw new Error(`Failed to load view: ${viewName}`);
        const html = await response.text();
        viewCache[viewName] = html;
        return html;
    } catch (error) {
        console.error(error);
        return `<div class="p-8 text-center text-gray-500">
            <span class="material-icons-round text-4xl mb-2 block">error_outline</span>
            <p>Failed to load view. Please try again.</p>
        </div>`;
    }
}

/**
 * Loads a view into the content container.
 */
async function loadView(viewName) {
    const container = document.getElementById('view-container');
    if (!container) return;

    // Show a subtle loading state
    container.style.opacity = '0.5';
    container.style.transition = 'opacity 0.15s ease';

    const html = await fetchView(viewName);
    container.innerHTML = html;

    // Fade in
    requestAnimationFrame(() => {
        container.style.opacity = '1';
    });

    // Wire up settings controls if the Settings view was loaded
    bindSettingsControls();
}

/**
 * Updates navigation link active styles.
 */
function setActiveNav(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove(...ACTIVE_CLASSES);
        link.classList.add(...INACTIVE_CLASSES);
    });

    activeLink.classList.add(...ACTIVE_CLASSES);
    activeLink.classList.remove(...INACTIVE_CLASSES);
}

/**
 * Initialises the router — sets up click handlers on nav links
 * and loads the default view.
 */
export function initRouter() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            const viewName = VIEW_MAP[link.id];
            if (!viewName) return;

            setActiveNav(link);
            await loadView(viewName);

            // Close mobile sidebar after navigation
            if (window.innerWidth < 1024) {
                closeMobileSidebar();
            }
        });
    });

    // Load default view (Resource Allocation)
    loadView('resource-allocation');
}
