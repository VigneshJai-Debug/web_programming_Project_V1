/**
 * sidebar.js
 * Handles sidebar collapse/expand, mobile drawer, and window resize.
 */
export function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Desktop Collapse Toggle
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-collapsed');
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('sidebar-show');
            sidebarOverlay.classList.add('overlay-show');
        });
    }

    // Close Sidebar (Overlay click)
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            closeMobileSidebar();
        });
    }

    // Handle Window Resize — reset mobile states
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            closeMobileSidebar();
        }
    });

    return { sidebar, sidebarOverlay };
}

/**
 * Closes the mobile sidebar drawer and overlay.
 */
export function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('sidebar-show');
    sidebarOverlay.classList.remove('overlay-show');
}
