import { initTheme, initProgressBar, initScrollSpy, initEmailCopy, initProjectFilters, initExpandToggles } from './main.js';
import { initContactForm } from './contact.js';

// Section Loader Mapping
const SECTIONS = [
    { id: 'section-navbar', file: 'sections/navbar.html' },
    { id: 'section-hero', file: 'sections/hero.html' },
    { id: 'section-projects', file: 'sections/projects.html' },
    { id: 'section-education', file: 'sections/education.html' },
    { id: 'section-skills', file: 'sections/skills.html' },
    { id: 'section-service', file: 'sections/service.html' },
    { id: 'section-certifications', file: 'sections/certifications.html' },
    { id: 'section-contact', file: 'sections/contact.html' }
];

async function loadAllSections() {
    try {
        await Promise.all(SECTIONS.map(async ({ id, file }) => {
            const container = document.getElementById(id);
            if (!container) return;

            try {
                const response = await fetch(file);
                if (response.ok) {
                    const html = await response.text();
                    container.outerHTML = html;
                } else {
                    console.error(`Failed to load section: ${file} (Status: ${response.status})`);
                }
            } catch (err) {
                console.error(`Error fetching section ${file}:`, err);
            }
        }));

        // Initialize all interaction modules after sections are mounted
        initTheme();
        initProgressBar();
        initScrollSpy();
        initEmailCopy();
        initProjectFilters();
        initExpandToggles();
        initContactForm();

        // Handle direct anchor link scroll if URL contains hash (e.g., #projects)
        if (window.location.hash) {
            const targetEl = document.querySelector(window.location.hash);
            if (targetEl) {
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }
        }
    } catch (error) {
        console.error("Critical error loading modular sections:", error);
    }
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllSections);
} else {
    loadAllSections();
}
