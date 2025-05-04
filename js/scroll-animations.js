document.addEventListener('DOMContentLoaded', () => {
    console.log('Scroll animation script loaded');
    
    const aboutSection = document.querySelector('.about-section');
    const aboutImage = document.querySelector('.about-section .about-image');
    const aboutImageContainer = document.querySelector('.about-section .about-image-container');
    const aboutContent = document.querySelector('.about-section .about-content');
    const aboutHeader = document.querySelector('.about-section .section-header');
    const aboutLine = document.querySelector('.about-section .section-line');
    const aboutText = document.querySelector('.about-section .about-text');
    const textContents = document.querySelectorAll('.about-text .text-content');
    
    console.log('Found text contents:', textContents.length);
    textContents.forEach((content, i) => {
        console.log(`Text content ${i}:`, content.textContent);
    });

    if (!aboutSection || !aboutImage || !aboutImageContainer || !aboutContent || !aboutHeader || !aboutLine || !aboutText || !textContents.length) {
        console.error('Required elements not found');
        return;
    }

    console.log('Elements found:', { aboutSection, aboutImage, aboutImageContainer, aboutContent, aboutHeader, aboutLine, aboutText });

    let lastScrollTop = 0;
    let currentScrollPosition = 0;
    let isMobile = window.innerWidth <= 768;
    let currentTextIndex = 0;
    let isAnimating = false;
    let animationFrame;

    // Mobile-specific adjustments
    const maxScale = isMobile ? 2.5 : 3.0;
    const minScale = isMobile ? 0.5 : 0.3;
    const initialHeight = isMobile ? 240 : 480;

    // Update mobile state on resize
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    });

    function updateTextContent(index) {
        if (index === currentTextIndex) return;
        
        textContents[currentTextIndex]?.classList.remove('active');
        currentTextIndex = index;
        textContents[currentTextIndex]?.classList.add('active');
    }

    function updateTextColors(color) {
        const textElements = aboutSection.querySelectorAll('.about-content, .dot, .section-title, .about-text');
        const lineElement = aboutSection.querySelector('.section-line');
        
        textElements.forEach(el => {
            if (el.classList.contains('dot')) {
                el.style.background = color;
            } else {
                el.style.color = color;
            }
        });
        
        if (lineElement) {
            lineElement.style.background = color;
        }
    }

    function handleScroll() {
        if (isAnimating) return;
        isAnimating = true;

        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const rect = aboutSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionTop = rect.top;
            const triggerPoint = viewportHeight * 0.5;

            // Reset state if section is out of view
            if (rect.bottom <= 0 || rect.top >= viewportHeight) {
                aboutImageContainer.style.position = 'relative';
                aboutImageContainer.style.top = 'auto';
                aboutImageContainer.style.left = 'auto';
                aboutImageContainer.style.width = '100%';
                aboutImageContainer.style.height = `${initialHeight}px`;
                aboutImage.style.transform = `scale(${minScale})`;
                aboutImageContainer.style.setProperty('--overlay-opacity', '0');
                aboutText.style.transform = 'translateY(0)';
                updateTextContent(0);
                if (aboutHeader) aboutHeader.style.opacity = '1';
                if (aboutLine) aboutLine.style.opacity = '1';
                updateTextColors('#000000');
                aboutSection.classList.remove('expanded');
                isAnimating = false;
                return;
            }

            // Only animate if section is in view and we've scrolled past the trigger point
            if (rect.top < viewportHeight && rect.bottom > 0 && sectionTop <= triggerPoint) {
                const scrollPastTrigger = Math.max(0, triggerPoint - sectionTop);
                currentScrollPosition = Math.max(0, Math.min(scrollPastTrigger, viewportHeight));

                const progress = Math.min(Math.max(currentScrollPosition / viewportHeight, 0), 1);
                const easedProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : -1 + (4 - 2 * progress) * progress;

                // Calculate scale with mobile-specific adjustments
                let scale;
                if (isMobile) {
                    scale = minScale + (easedProgress * (maxScale - minScale));
                    const containerWidth = aboutImageContainer.offsetWidth;
                    const imageWidth = aboutImage.naturalWidth || containerWidth;
                    const requiredScale = containerWidth / imageWidth;
                    scale = Math.max(scale, requiredScale);
                } else {
                    scale = minScale + (easedProgress * (maxScale - minScale));
                }

                // Animate state
                if (!isMobile || (isMobile && scale >= maxScale)) {
                    aboutImageContainer.style.position = 'fixed';
                    aboutImageContainer.style.top = '0';
                    aboutImageContainer.style.left = '0';
                    aboutImageContainer.style.width = '100vw';
                    aboutImageContainer.style.height = '100vh';
                } else {
                    aboutImageContainer.style.position = 'relative';
                    aboutImageContainer.style.height = `${initialHeight}px`;
                }
                
                aboutImage.style.transform = `scale(${scale})`;
                
                // Calculate overlay opacity based on scale
                const overlayOpacity = Math.min(1, (scale - minScale) / (maxScale - minScale) * 0.8);
                aboutImageContainer.style.setProperty('--overlay-opacity', overlayOpacity);
                
                if (!isMobile) {
                    const textHeight = aboutText.offsetHeight;
                    const translateY = (viewportHeight - textHeight) / 2;
                    aboutText.style.transform = `translateY(${translateY}px)`;
                } else {
                    aboutText.style.transform = 'translateY(0)';
                }

                // Hide header and line when progress is high enough
                if (progress > 0.3) {
                    if (aboutHeader) aboutHeader.style.opacity = '0';
                    if (aboutLine) aboutLine.style.opacity = '0';
                } else {
                    if (aboutHeader) aboutHeader.style.opacity = '1';
                    if (aboutLine) aboutLine.style.opacity = '1';
                }

                // Update text colors based on progress
                const textColor = progress > 0.3 ? '#ffffff' : '#000000';
                updateTextColors(textColor);

                // Update text content based on scale
                const scaleProgress = (scale - minScale) / (maxScale - minScale);
                if (scaleProgress >= 0.8) {
                    updateTextContent(2); // Show third text at 80% scale
                } else if (scaleProgress >= 0.5) {
                    updateTextContent(1); // Show second text at 50% scale
                } else {
                    updateTextContent(0); // Show first text by default
                }
            }

            isAnimating = false;
        });
    }

    // Add scroll event listener with passive flag
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
        currentScrollPosition = 0;
        handleScroll();
    }, { passive: true });

    // Add tap/click event for mobile to cycle text
    if (isMobile && aboutText) {
        aboutText.addEventListener('click', function () {
            const nextIndex = (currentTextIndex + 1) % textContents.length;
            updateTextContent(nextIndex);
        });
    }
}); 