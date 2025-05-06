// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburgerBtn = document.querySelector('.hamburger-btn:not(.close-btn)');
    const closeBtn = document.querySelector('.close-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    // Debug elements
    console.log('Hamburger button:', hamburgerBtn);
    console.log('Close button:', closeBtn);
    console.log('Mobile menu:', mobileMenu);

    function toggleMenu() {
        if (!mobileMenu) {
            console.error('Mobile menu element not found');
            return;
        }
        mobileMenu.classList.toggle('active');
        if (body) {
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    } else {
        console.error('Hamburger button not found');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    } else {
        console.error('Close button not found');
    }

    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-menu-links a');
    mobileLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', () => {
                if (!link.classList.contains('coming-soon')) {
                    toggleMenu();
                }
            });
        }
    });

    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for navigation links
    const smoothScrollLinks = document.querySelectorAll('nav a:not(.coming-soon)');
    smoothScrollLinks.forEach(anchor => {
        if (anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const section = document.querySelector(this.getAttribute('href'));
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // Add active class to current section in viewport
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (pageYOffset >= sectionTop - 60) {
                        current = section.getAttribute('id');
                    }
                }
            });

            navLinks.forEach(link => {
                if (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === current) {
                        link.classList.add('active');
                    }
                }
            });
        });
    }

    const nav = document.querySelector('.main-nav');
    if (nav) {
        function updateNavStyle() {
            const hero = document.querySelector('.hero');
            if (hero) {
                const heroBottom = hero.getBoundingClientRect().bottom;
                if (heroBottom <= 0) {
                    // Removed background and backdrop-filter
                } else {
                    // Removed background and backdrop-filter
                }
            }
        }

        window.addEventListener('scroll', updateNavStyle);
        updateNavStyle(); // Initial check
    }

    // Reel section scroll animation (precise overlap, max 40% of image width)
    (function() {
        const reelSection = document.querySelector('.reel-section');
        const reelContent = document.querySelector('.reel-content');
        const left = document.querySelector('.reel-left');
        const right = document.querySelector('.reel-right');
        if (!reelSection || !reelContent || !left || !right) return;

        function clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        }

        function onScroll() {
            const rect = reelSection.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const sectionHeight = rect.height;
            // Progress: 0 when centered, 1 when scrolled past the section
            const scrollY = clamp((windowHeight/2 - rect.top) / (sectionHeight/2), 0, 1);
            // Max translation: 40% of the reel-content width (px)
            const maxTranslate = 0.4 * reelContent.offsetWidth;
            left.style.transform = `translate(-50%, -50%) translateX(-${scrollY * maxTranslate}px)`;
            right.style.transform = `translate(-50%, -50%) translateX(${scrollY * maxTranslate}px)`;
        }

        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll);
        onScroll();
    })();
}); 