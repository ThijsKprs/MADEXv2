// Originele fotogalerie code
const photos = [
    {
        main: '/images/MACBOOK1.jpg',
        alt: '/images/MACBOOK2.jpg',
        caption: 'MacBook Pro - Aluminum body'
    },
    {
        main: '/images/GLOSSYCASE1.jpg',
        alt: '',
        caption: 'Glossy plastic case'
    },
    {
        main: '/images/Flower pot textured1.jpg',
        alt: '/images/Flower pot textured2.jpg',
        caption: 'Textured flower pot'
    },
    {
        main: '/images/Pokemon card design1.jpg',
        alt: '/images/Pokemon card design2.jpg',
        caption: 'Pokemon card design'
    },
    
];

let currentIndex = 0;
const photosPerLoad = 3;

function createPhotoCard(photo, index) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    
    // Verberg de knop als er geen alternatieve afbeelding is
    const btnDisplay = photo.alt ? '' : 'style="display: none;"';
    
    card.innerHTML = `
        <div class="photo-wrapper">
            <img src="${photo.main}" alt="${photo.caption}" class="photo-img" data-main="${photo.main}" data-alt="${photo.alt}" data-current="main">
            <canvas class="glitch-canvas"></canvas>
            <button class="surprise-btn" data-index="${index}" ${btnDisplay}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#CCCCCC" stroke-width="2">
                 <path d="M1 10C1 10 4 4 10 4C16 4 19 10 19 10C19 10 16 16 10 16C4 16 1 10 1 10Z" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"/>
                  <circle cx="10" cy="10" r="3"/>
                 <circle cx="10" cy="10" r="1.5" fill="#CCCCCC"/>
                </svg>
            </button>
        </div>
        <p class="photo-caption">${photo.caption}</p>
    `;

    const btn = card.querySelector('.surprise-btn');
    const img = card.querySelector('.photo-img');
    const glitchCanvas = card.querySelector('.glitch-canvas');
    const glitchCtx = glitchCanvas.getContext('2d');
    
    // Alleen event listener toevoegen als er een alternatieve afbeelding is
    if (photo.alt) {
        btn.addEventListener('click', () => {
            const mainSrc = img.dataset.main;
            const altSrc = img.dataset.alt;
            const currentState = img.dataset.current;
            
            // Bepaal de nieuwe afbeelding op basis van de huidige staat
            const newSrc = currentState === 'main' ? altSrc : mainSrc;
            const newState = currentState === 'main' ? 'alt' : 'main';
            
            // Verwijder transform tijdens transitie
            img.style.transform = 'scale(1)';
            
            // Setup canvas
            const wrapper = img.parentElement;
            glitchCanvas.width = wrapper.offsetWidth;
            glitchCanvas.height = wrapper.offsetHeight;
            glitchCanvas.style.opacity = '1';
            
            // Preload nieuwe afbeelding
            const newImg = new Image();
            newImg.crossOrigin = "anonymous";
            newImg.onload = () => {
                animateDataSwap(img, newImg, glitchCanvas, glitchCtx, () => {
                    img.src = newSrc;
                    img.dataset.current = newState;
                    glitchCanvas.style.opacity = '0';
                    // Reset transform na transitie
                    img.style.transform = '';
                });
            };
            newImg.src = newSrc;
        });
    }

    return card;
}

function animateDataSwap(oldImg, newImg, canvas, ctx, callback) {
    const duration = 600;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function voor smooth fade
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Teken oude afbeelding (fade out)
        ctx.globalAlpha = 1 - easeProgress;
        ctx.drawImage(oldImg, 0, 0, canvas.width, canvas.height);
        
        // Teken nieuwe afbeelding (fade in)
        ctx.globalAlpha = easeProgress;
        ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
        
        ctx.globalAlpha = 1;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            callback();
        }
    }
    
    animate();
}

function loadPhotos() {
    const gallery = document.getElementById('gallery');
    const endIndex = Math.min(currentIndex + photosPerLoad, photos.length);
    
    for (let i = currentIndex; i < endIndex; i++) {
        gallery.appendChild(createPhotoCard(photos[i], i));
    }
    
    currentIndex = endIndex;
    
    if (currentIndex >= photos.length) {
        document.getElementById('loadMore').style.display = 'none';
    }
}

document.getElementById('loadMore').addEventListener('click', loadPhotos);

loadPhotos();

// Scroll to top functionaliteit
document.getElementById('scrollTopBtn').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});