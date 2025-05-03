document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.querySelector('.progress-bar');
    const loadingScreen = document.querySelector('.loading-screen');
    
    // List of assets to preload
    const assets = [
        'assets/logo.png',
        'assets/herobg.mp4',
        'assets/video-bg.mp4',
        'css/styles.css',
        'js/main.js'
    ];
    
    let loadedAssets = 0;
    
    // Function to update progress
    function updateProgress() {
        loadedAssets++;
        const progress = Math.floor((loadedAssets / assets.length) * 100);
        progressBar.style.width = `${progress}%`;
        
        if (loadedAssets === assets.length) {
            // Add fade out animation
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            // Redirect to main page after fade out
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    }
    
    // Preload all assets
    assets.forEach(asset => {
        const element = document.createElement(asset.includes('.mp4') ? 'video' : 
                                            asset.includes('.css') ? 'link' : 
                                            asset.includes('.js') ? 'script' : 'img');
        
        if (element.tagName === 'LINK') {
            element.rel = 'stylesheet';
            element.href = asset;
        } else if (element.tagName === 'SCRIPT') {
            element.src = asset;
        } else {
            element.src = asset;
        }
        
        element.onload = updateProgress;
        element.onerror = updateProgress; // Handle errors gracefully
        
        if (element.tagName === 'VIDEO') {
            element.oncanplaythrough = updateProgress;
        }
        
        document.head.appendChild(element);
    });
}); 