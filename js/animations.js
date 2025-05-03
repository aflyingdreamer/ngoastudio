document.addEventListener('DOMContentLoaded', () => {
    // Animation classes for different elements
    const animationConfig = [
        {
            selector: '.nav-left',
            animation: 'fade-in'
        },
        {
            selector: '.nav-right',
            animation: 'fade-in'
        },
        {
            selector: '.nav-line',
            animation: 'fade-in'
        },
        {
            selector: '.nav-column a',
            animation: 'fade-in'
        },
        {
            selector: '.reservation-btn',
            animation: 'fade-in'
        },
        {
            selector: '.hero-overlay',
            animation: 'fade-in'
        },
        {
            selector: '.hero-footer',
            animation: 'fade-in'
        },
        {
            selector: '.about-section',
            animation: 'fade-in'
        },
        {
            selector: '.journey-section',
            animation: 'fade-in'
        },
        // Add text element animations
        {
            selector: '.hero-text',
            animation: 'fade-in'
        },
        {
            selector: '.hero-info div',
            animation: 'fade-in'
        },
        {
            selector: '.about-text',
            animation: 'fade-in'
        },
        {
            selector: '.journey-text',
            animation: 'fade-in'
        },
        {
            selector: '.journey-description',
            animation: 'fade-in'
        }
    ];

    // Add initial animation classes
    animationConfig.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach(element => {
            element.classList.add(config.animation);
        });
    });

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger point slightly up
    });

    // Observe all animated elements
    animationConfig.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    });

    // Mobile menu animations
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-links a');
    const mobileFooter = document.querySelector('.mobile-menu-footer');

    function resetMobileMenuAnimations() {
        mobileLinks.forEach(link => {
            link.classList.remove('visible');
        });
        mobileFooter.classList.remove('visible');
    }

    function animateMobileMenu() {
        // Reset any existing animations first
        resetMobileMenuAnimations();

        // Animate each link with a delay
        mobileLinks.forEach((link, index) => {
            setTimeout(() => {
                link.classList.add('visible');
            }, index * 100); // 100ms delay between each link
        });

        // Animate footer after all links
        setTimeout(() => {
            mobileFooter.classList.add('visible');
        }, mobileLinks.length * 100);
    }

    // Add event listeners for mobile menu toggle
    const hamburgerBtn = document.querySelector('.hamburger-btn:not(.close-btn)');
    const closeBtn = document.querySelector('.close-btn');

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            // Wait for the menu to be visible before starting animations
            setTimeout(animateMobileMenu, 50);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            resetMobileMenuAnimations();
            mobileMenu.classList.remove('active');
        });
    }

    // Journey Image Parallax Effect
    const journeyImage = document.querySelector('.journey-image');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;
        
        if (journeyImage) {
            const currentTransform = parseFloat(getComputedStyle(journeyImage).transform.split(',')[5] || 0);
            const newTransform = currentTransform + scrollDiff * 0.5;
            journeyImage.style.transform = `translateY(${newTransform}px)`;
        }
        
        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll);
}); 