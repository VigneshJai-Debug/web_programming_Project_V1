/**
 * app.js
 * Application entry point — initialises all modules.
 */
import { initSidebar } from './sidebar.js';
import { initRouter } from './router.js';
import { initTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();   // Apply persisted theme before anything renders
    initSidebar();
    initRouter();
});
