// Originele fotogalerie code
const photos = [
    {
        main: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        alt: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
        caption: 'Mountains at Sunset'
    },
    {
        main: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        alt: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        caption: 'Nature in its glory'
    },
    {
        main: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
        alt: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
        caption: 'Adventure awaits'
    },
    {
        main: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
        alt: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
        caption: 'Misty forest mornings'
    },
    {
        main: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
        alt: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800',
        caption: 'Serenity by the lake'
    },
    {
        main: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800',
        alt: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        caption: 'Majestic waterfalls'
    },
    {
        main: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
        alt: 'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800',
        caption: 'Abstract light patterns'
    },
    {
        main: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        alt: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800',
        caption: 'Sunset over the hills'
    },
    {
        main: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
        alt: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        caption: 'Endless desert dunes'
    }
];

let currentIndex = 0;
const photosPerLoad = 3;

function createPhotoCard(photo, index) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    
    card.innerHTML = `
        <div class="photo-wrapper">
            <img src="${photo.main}" alt="${photo.caption}" class="photo-img" data-main="${photo.main}" data-alt="${photo.alt}">
            <canvas class="glitch-canvas"></canvas>
            <button class="surprise-btn" data-index="${index}">
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
    
    btn.addEventListener('click', () => {
        const currentSrc = img.src;
        const mainSrc = img.dataset.main;
        const altSrc = img.dataset.alt;
        const newSrc = currentSrc.includes(mainSrc) ? altSrc : mainSrc;
        
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
                glitchCanvas.style.opacity = '0';
            });
        };
        newImg.src = newSrc;
    });

    return card;
}

function animateDataSwap(oldImg, newImg, canvas, ctx, callback) {
    const pixelSize = 800;
    const duration = 800;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const cols = Math.ceil(canvas.width / pixelSize);
        const rows = Math.ceil(canvas.height / pixelSize);
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * pixelSize;
                const y = j * pixelSize;
                
                // Willekeurige offset voor glitch effect
                const offset = (Math.random() - 0.5) * pixelSize * (1 - progress);
                
                // Bepaal welke afbeelding te gebruiken
                const threshold = (i / cols + j / rows) / 2;
                const useNew = progress > threshold;
                
                // Pixelated effect met fade
                if (useNew) {
                    ctx.globalAlpha = Math.min(1, progress * 1.5);
                    ctx.drawImage(
                        newImg,
                        (i / cols) * newImg.width,
                        (j / rows) * newImg.height,
                        newImg.width / cols,
                        newImg.height / rows,
                        x + offset,
                        y,
                        pixelSize,
                        pixelSize
                    );
                } else {
                    ctx.globalAlpha = 1 - progress * 0.8;
                    ctx.drawImage(
                        oldImg,
                        (i / cols) * oldImg.width,
                        (j / rows) * oldImg.height,
                        oldImg.width / cols,
                        oldImg.height / rows,
                        x + offset,
                        y,
                        pixelSize,
                        pixelSize
                    );
                }
                
                // Halftone dots effect
                if (Math.random() > 0.9) {
                    const dotSize = pixelSize * 0.3 * (1 - progress);
                    ctx.fillStyle = `rgba(204, 204, 204, ${0.5 - progress * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(x + pixelSize/2, y + pixelSize/2, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
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