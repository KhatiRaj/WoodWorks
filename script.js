document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) {
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let offset = 70;
                const header = document.querySelector('header');
                if (header) {
                    offset = header.offsetHeight > 0 ? header.offsetHeight : 70;
                }

                if (targetId === '#home') {
                    offset = 0;
                }
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // --- GALLERY AND LIGHTBOX CODE ---
    const galleryCategories = [
        // ... (Your existing galleryCategories array remains unchanged) ...
        {
            id: "bed",
            displayName: "Bed",
            folderName: "Bed",
            imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg" ]
        },
        { id: "tv-unit", displayName: "TV Unit", folderName: "TV_Unit", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg" ] },
        { id: "dining-table", displayName: "Dining Table", folderName: "Dining_Table", imageFiles: [ "1.jpg" ] },
        { id: "sofa", displayName: "Sofa", folderName: "Sofa", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg" ] },
        { id: "wooden-ceiling", displayName: "Wooden Ceiling", folderName: "Wooden_Ceiling", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg" ] },
        { id: "kitchen", displayName: "Kitchen", folderName: "Kitchen", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg" ] },
        { id: "cupboard", displayName: "Cupboard", folderName: "Cupboard", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg" ] },
        { id: "pataisan", displayName: "Pataisan", folderName: "Pataisan", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg" ] },
        { id: "furniture", displayName: "Furniture", folderName: "Furniture", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg" ] }
    ];

    const galleryGrid = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxThumbnailsContainer = document.getElementById('lightboxThumbnails');
    const lightboxLoader = document.getElementById('lightboxLoader');
    const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
    const lightboxPrevBtn = document.querySelector('.lightbox-prev-btn');
    const lightboxNextBtn = document.querySelector('.lightbox-next-btn');

    let currentLightboxImagePaths = [];
    let currentImageIndex = 0;
    let currentLightboxCategoryName = '';

    function populateGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        galleryCategories.forEach((category, categoryIndex) => {
            if (!category.imageFiles || category.imageFiles.length === 0) {
                console.warn(`No image files listed for category: ${category.displayName}`);
                return;
            }

            const item = document.createElement('div');
            item.className = 'gallery-item animate-on-scroll scale-up';
            item.style.transitionDelay = `${categoryIndex * 0.05}s`;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'gallery-item-image-container';

            const firstImageFileName = category.imageFiles[0];
            const img = document.createElement('img');
            img.src = `images/${category.folderName}/${firstImageFileName}`;
            img.alt = `${category.displayName} - Preview`;
            img.loading = 'lazy'; // Add lazy loading for grid images
            img.onerror = () => {
                console.error(`Error loading image: ${img.src}.`);
                img.style.display = 'none';
            };
            imageContainer.appendChild(img);

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            
            const overlayContent = document.createElement('div');
            overlayContent.className = 'gallery-overlay-content';
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fas fa-search-plus';
            overlayContent.appendChild(viewIcon);

            const imageCountText = document.createElement('p');
            imageCountText.className = 'gallery-item-image-count';
            imageCountText.textContent = `${category.imageFiles.length} image${category.imageFiles.length > 1 ? 's' : ''}`;
            overlayContent.appendChild(imageCountText);
            
            overlay.appendChild(overlayContent);
            imageContainer.appendChild(overlay);
            item.appendChild(imageContainer);

            const titleDiv = document.createElement('div');
            titleDiv.className = 'gallery-item-title';
            titleDiv.textContent = category.displayName;
            item.appendChild(titleDiv);

            galleryGrid.appendChild(item);

            imageContainer.addEventListener('click', () => {
                openLightbox(category.id, 0);
            });
        });

        initializeScrollAnimations();
    }

    function openLightbox(categoryId, imgIndex) {
        const category = galleryCategories.find(cat => cat.id === categoryId);
        if (!category || !lightbox || !category.imageFiles || category.imageFiles.length === 0) return;

        currentLightboxImagePaths = category.imageFiles.map(fileName => `images/${category.folderName}/${fileName}`);
        currentImageIndex = imgIndex;
        currentLightboxCategoryName = category.displayName;

        document.body.style.overflow = 'hidden';
        updateLightboxImage();
        populateLightboxThumbnails();
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (lightboxLoader) {
            lightboxLoader.style.display = 'none';
        }
        if (lightboxImage) {
            lightboxImage.src = ""; // Clear image src to stop loading/display
        }
    }

    function populateLightboxThumbnails() {
        if (!lightboxThumbnailsContainer) return;
        lightboxThumbnailsContainer.innerHTML = '';

        if (currentLightboxImagePaths.length <= 1) {
            lightboxThumbnailsContainer.style.display = 'none';
            return;
        }
        lightboxThumbnailsContainer.style.display = 'flex';

        currentLightboxImagePaths.forEach((path, index) => {
            const thumbImg = document.createElement('img');
            thumbImg.src = path;
            thumbImg.alt = `${currentLightboxCategoryName} - Thumbnail ${index + 1}`;
            thumbImg.className = 'lightbox-thumbnail-img';
            thumbImg.loading = 'lazy'; // Lazy load thumbnails too
            if (index === currentImageIndex) {
                thumbImg.classList.add('active-thumbnail');
            }
            thumbImg.addEventListener('click', () => {
                currentImageIndex = index;
                updateLightboxImage();
            });
            lightboxThumbnailsContainer.appendChild(thumbImg);
        });
        scrollActiveThumbnailIntoView();
    }

    function updateLightboxImage() {
        if (currentLightboxImagePaths.length === 0 || !lightboxImage || !lightboxCaption || !lightboxPrevBtn || !lightboxNextBtn || !lightboxLoader) return;

        lightboxLoader.style.display = 'block';
        lightboxImage.style.opacity = '0';
        
        const imageIndexToLoad = currentImageIndex; // Capture current index for closure

        const newImage = new Image();
        newImage.onload = () => {
            if (currentImageIndex === imageIndexToLoad && lightbox.classList.contains('active')) { // Check if still relevant
                lightboxImage.src = newImage.src;
                lightboxImage.alt = `${currentLightboxCategoryName} - Image ${currentImageIndex + 1} of ${currentLightboxImagePaths.length}`;
                lightboxCaption.textContent = `${currentLightboxCategoryName} - Image ${currentImageIndex + 1} of ${currentLightboxImagePaths.length}`;
                lightboxLoader.style.display = 'none';
                lightboxImage.style.opacity = '1';
            }
        };
        newImage.onerror = () => {
            if (currentImageIndex === imageIndexToLoad && lightbox.classList.contains('active')) {
                lightboxCaption.textContent = 'Error loading image.';
                lightboxLoader.style.display = 'none';
                lightboxImage.style.opacity = '1'; // Show broken image icon if src was set or placeholder
                console.error("Error loading lightbox image: " + newImage.src);
            }
        };
        newImage.src = currentLightboxImagePaths[currentImageIndex];


        const showNav = currentLightboxImagePaths.length > 1;
        lightboxPrevBtn.style.display = showNav ? 'block' : 'none';
        lightboxNextBtn.style.display = showNav ? 'block' : 'none';

        if (lightboxThumbnailsContainer && currentLightboxImagePaths.length > 1) {
            lightboxThumbnailsContainer.style.display = 'flex';
            const thumbnails = lightboxThumbnailsContainer.querySelectorAll('.lightbox-thumbnail-img');
            thumbnails.forEach((thumb, idx) => {
                thumb.classList.toggle('active-thumbnail', idx === currentImageIndex);
            });
            scrollActiveThumbnailIntoView();
        } else if (lightboxThumbnailsContainer) {
            lightboxThumbnailsContainer.style.display = 'none';
        }
    }

    function scrollActiveThumbnailIntoView() {
        if (!lightboxThumbnailsContainer) return;
        const activeThumb = lightboxThumbnailsContainer.querySelector('.active-thumbnail');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function showNextImage() {
        if (currentLightboxImagePaths.length <= 1) return;
        currentImageIndex = (currentImageIndex + 1) % currentLightboxImagePaths.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        if (currentLightboxImagePaths.length <= 1) return;
        currentImageIndex = (currentImageIndex - 1 + currentLightboxImagePaths.length) % currentLightboxImagePaths.length;
        updateLightboxImage();
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft' && currentLightboxImagePaths.length > 1) showPrevImage();
            else if (e.key === 'ArrowRight' && currentLightboxImagePaths.length > 1) showNextImage();
        }
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    let touchstartX = 0;
    let touchendX = 0;
    const lightboxContentWrapper = document.querySelector('.lightbox-content-wrapper');

    if (lightboxContentWrapper) {
        lightboxContentWrapper.addEventListener('touchstart', function (event) {
            touchstartX = event.changedTouches[0].screenX;
        }, { passive: true });

        lightboxContentWrapper.addEventListener('touchend', function (event) {
            touchendX = event.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        if (currentLightboxImagePaths.length <= 1) return;
        const swipeThreshold = 50;
        if (touchendX < touchstartX - swipeThreshold) showNextImage();
        if (touchendX > touchstartX + swipeThreshold) showPrevImage();
    }

    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.1 });
            animatedElements.forEach(el => observer.observe(el));
        } else {
            animatedElements.forEach(el => el.classList.add('animated'));
        }
    }

    populateGallery();
});
