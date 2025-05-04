document.addEventListener('DOMContentLoaded', () => {
    console.log('Scroll animation script loaded');
    
    const aboutSection = document.querySelector('.about-section');
    const aboutImage = document.querySelector('.about-section .about-image');
    const aboutImageContainer = document.querySelector('.about-section .about-image-container');
    const aboutContent = document.querySelector('.about-section .about-content');
    const aboutHeader = document.querySelector('.about-section .section-header');
    const aboutLine = document.querySelector('.about-section .section-line');
    const aboutText = document.querySelector('.about-section .about-text');
    
    if (!aboutSection || !aboutImage || !aboutImageContainer || !aboutContent || !aboutHeader || !aboutLine || !aboutText) {
        console.error('Required elements not found');
        return;
    }

    console.log('Elements found:', { aboutSection, aboutImage, aboutImageContainer, aboutContent, aboutHeader, aboutLine, aboutText });

    let lastScrollTop = 0;
    let currentScrollPosition = 0;
    const scrollStep = 20; // Pixels to move per scroll event
    let isMobile = window.innerWidth <= 768;

    // Update mobile state on resize
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    });

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 1 : -1;
        lastScrollTop = scrollTop;

        // Get section position
        const rect = aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        const triggerPoint = viewportHeight * 0.5;

        // Only animate if section is in view and we've scrolled past the trigger point
        if (rect.top < viewportHeight && rect.bottom > 0 && sectionTop <= triggerPoint) {
            const scrollPastTrigger = Math.max(0, triggerPoint - sectionTop);
            currentScrollPosition = Math.max(0, Math.min(scrollPastTrigger, viewportHeight));

            const progress = Math.min(Math.max(currentScrollPosition / viewportHeight, 0), 1);
            const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            // Mobile-specific adjustments
            const maxScale = isMobile ? 2.5 : 3.0;
            const minScale = isMobile ? 0.5 : 0.3;
            const initialHeight = isMobile ? 240 : 480;

            if (progress <= 0) {
                // Reset state
                aboutImageContainer.style.position = 'relative';
                aboutImageContainer.style.top = 'auto';
                aboutImageContainer.style.left = 'auto';
                aboutImageContainer.style.width = '100%';
                aboutImageContainer.style.height = `${initialHeight}px`;
                aboutImage.style.transform = `scale(${minScale})`;
                aboutImageContainer.style.setProperty('--overlay-opacity', '0');
                
                aboutText.style.transform = 'translateY(0)';
                aboutHeader.style.opacity = '1';
                aboutLine.style.opacity = '1';
                
                updateTextColors('black');
            } else {
                // Animate state
                if (!isMobile) {
                    aboutImageContainer.style.position = 'fixed';
                    aboutImageContainer.style.top = '0';
                    aboutImageContainer.style.left = '0';
                    aboutImageContainer.style.width = '100%';
                    aboutImageContainer.style.height = '100%';
                } else {
                    aboutImageContainer.style.position = 'relative';
                    aboutImageContainer.style.height = `${initialHeight}px`;
                }
                
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
                
                aboutImage.style.transform = `scale(${scale})`;
                
                // Calculate overlay opacity based on scale
                const overlayOpacity = Math.min(1, (scale - minScale) / (maxScale - minScale) * 0.8);
                aboutImageContainer.style.setProperty('--overlay-opacity', overlayOpacity);
                
                if (!isMobile) {
                    const textHeight = aboutText.offsetHeight;
                    const translateY = (viewportHeight - textHeight) / 2;
                    aboutText.style.transform = `translateY(${translateY}px)`;
                }
                
                const headerOpacity = Math.max(0, 1 - (scale - minScale) / ((maxScale - minScale) * 0.5));
                aboutHeader.style.opacity = headerOpacity;
                aboutLine.style.opacity = headerOpacity;
                
                // Update text colors based on scale with smooth transition
                const textColor = scale > (minScale + (maxScale - minScale) * 0.3) ? 'white' : 'black';
                updateTextColors(textColor);
            }
        } else if (rect.top > viewportHeight) {
            // Reset to initial state when section is above viewport
            aboutImageContainer.style.position = 'relative';
            aboutImageContainer.style.top = 'auto';
            aboutImageContainer.style.left = 'auto';
            aboutImageContainer.style.width = '100%';
            aboutImageContainer.style.height = `${initialHeight}px`;
            aboutImage.style.transform = `scale(${minScale})`;
            aboutImageContainer.style.setProperty('--overlay-opacity', '0');
            
            aboutText.style.transform = 'translateY(0)';
            aboutHeader.style.opacity = '1';
            aboutLine.style.opacity = '1';
            
            updateTextColors('black');
        } else if (rect.bottom < 0) {
            // Set to final state when section is below viewport
            if (!isMobile) {
                aboutImageContainer.style.position = 'fixed';
                aboutImageContainer.style.top = '0';
                aboutImageContainer.style.left = '0';
                aboutImageContainer.style.width = '100%';
                aboutImageContainer.style.height = '100%';
            }
            aboutImage.style.transform = `scale(${maxScale})`;
            aboutImageContainer.style.setProperty('--overlay-opacity', '0.8');
            
            if (!isMobile) {
                const textHeight = aboutText.offsetHeight;
                const translateY = (viewportHeight - textHeight) / 2;
                aboutText.style.transform = `translateY(${translateY}px)`;
            }
            
            aboutHeader.style.opacity = '0';
            aboutLine.style.opacity = '0';
            
            updateTextColors('white');
        }
    }

    // Helper function to update text colors
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

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
        // Reset scroll position on resize
        currentScrollPosition = 0;
        handleScroll();
    }, { passive: true });
}); 