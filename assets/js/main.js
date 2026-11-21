// --- Theme Management (Light / Dark) ---
export function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    function updateToggleIcon(theme) {
        themeToggleBtn.innerText = theme === 'dark' ? '☀' : '☾';
        themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateToggleIcon(currentTheme);

    // Remove existing listener to avoid duplicates if re-init
    const newBtn = themeToggleBtn.cloneNode(true);
    themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);

    newBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleIcon(next);
    });
}

// --- Reading Progress Bar ---
export function initProgressBar() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
            const scrolled = (window.scrollY / totalScroll) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        }
    }, { passive: true });
}

// --- Navbar Active Link Highlighting (IntersectionObserver) ---
export function initScrollSpy() {
    const navSections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!navSections.length || !navLinks.length) return;

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    });

    navSections.forEach(section => navObserver.observe(section));
}

// --- Copy Email & Toast Notification ---
export function initEmailCopy() {
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        toast.innerText = message;
        toast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('monowarhusainomi@gmail.com').then(() => {
                showToast('Email copied to clipboard');
            }).catch(() => {
                showToast('Failed to copy email');
            });
        });
    }
}

// --- Interactive Project Filtering ---
export function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectTiers = document.querySelectorAll('.project-tier');
    if (!filterTabs.length || !projectTiers.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            projectTiers.forEach(tier => {
                const tierType = tier.getAttribute('data-type');
                if (filter === 'all' || tierType === filter) {
                    tier.style.display = 'block';
                } else {
                    tier.style.display = 'none';
                }
            });
        });
    });
}

// --- Expandable Architecture Details ---
export function initExpandToggles() {
    const expandToggles = document.querySelectorAll('.expand-toggle');

    expandToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const drawer = document.getElementById(targetId);
            if (!drawer) return;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                drawer.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                const icon = toggle.querySelector('.toggle-icon');
                if (icon) icon.innerText = '▾';
            } else {
                drawer.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
                const icon = toggle.querySelector('.toggle-icon');
                if (icon) icon.innerText = '▴';
            }
        });
    });
}

