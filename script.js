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
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('header');
                const offset = targetId === '#home' ? 0 : (header?.offsetHeight || 80);
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[type="text"]');
            const phone = contactForm.querySelector('input[type="tel"]');
            const message = contactForm.querySelector('textarea');
            let isValid = true;

            [name, phone, message].forEach(input => {
                const formGroup = input.parentElement;
                if (!input.value.trim()) {
                    formGroup.classList.add('invalid');
                    isValid = false;
                } else {
                    formGroup.classList.remove('invalid');
                }
            });

            if (isValid) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });

        // Real-time validation
        contactForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', () => {
                const formGroup = input.parentElement;
                if (input.value.trim()) {
                    formGroup.classList.remove('invalid');
                }
            });
        });
    }

    // Gallery and Lightbox
    const galleryCategories = [
        { id: "all", displayName: "All", folderName: "", imageFiles: [] }, // Added "All" category
        { id: "bed", displayName: "Bed", folderName: "Bed", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg"] },
        { id: "tv-unit", displayName: "TV Unit", folderName: "TV_Unit", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"] },
        { id: "dining-table", displayName: "Dining Table", folderName: "Dining_Table", imageFiles: ["1.jpg"] },
        { id: "sofa", displayName: "Sofa", folderName: "Sofa", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"] },
        { id: "wooden-ceiling", displayName: "Wooden Ceiling", folderName: "Wooden_Ceiling", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg"] },
        { id: "kitchen", displayName: "Kitchen", folderName: "Kitchen", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"] },
        { id: "cupboard", displayName: "Cupboard", folderName: "Cupboard", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg"] },
        { id: "pataisan", displayName: "Pataisan", folderName: "Pataisan", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"] },
        { id: "furniture", displayName: "Furniture", folderName: "Furniture", imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"] }
    ];

    const galleryGrid = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
    const lightboxPrevBtn = document.querySelector('.lightbox-prev-btn');
    const lightboxNextBtn = document.querySelector('.lightbox-next-btn');
    let currentLightboxImagePaths = [];
    let currentImageIndex = 0;
    let categorySlideshowIntervals = [];

    function createGalleryFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'gallery-filter';
        galleryCategories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.displayName;
            button.dataset.category = category.id;
            if (category.id === 'all') button.classList.add('active');
            button.addEventListener('click', () => {
                document.querySelectorAll('.gallery-filter button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterGallery(category.id);
            });
            filterContainer.appendChild(button);
        });
        galleryGrid.parentElement.insertBefore(filterContainer, galleryGrid);
    }

    function filterGallery(categoryId) {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            const itemCategory = item.dataset.category;
            if (categoryId === 'all' || itemCategory === categoryId) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    function populateGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        categorySlideshowIntervals.forEach(clearInterval);
        categorySlideshowIntervals = [];

        galleryCategories.slice(1).forEach((category, categoryIndex) => { // Skip "All" category
            if (!category.imageFiles.length) {
                console.warn(`No image files for category: ${category.displayName}`);
                return;
            }

            const item = document.createElement('div');
            item.className = 'gallery-item animate-on-scroll scale-up';
            item.dataset.category = category.id;
            item.style.transitionDelay = `${categoryIndex * 0.05}s`;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'gallery-item-image-container';

            const slider = document.createElement('div');
            slider.className = 'gallery-image-slider';

            category.imageFiles.forEach((imageFileName, imgIndex) => {
                const img = document.createElement('img');
                img.src = `images/${category.folderName}/${imageFileName}`;
                img.alt = `${category.displayName} - Image ${imgIndex + 1}`;
                img.loading = 'lazy'; // Lazy loading
                img.onerror = () => {
                    console.error(`Error loading image: ${img.src}`);
                    img.style.display = 'none';
                };
                if (imgIndex === 0) img.classList.add('active-slide');
                slider.appendChild(img);
            });
            imageContainer.appendChild(slider);

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fas fa-search-plus';
            overlay.appendChild(viewIcon);
            imageContainer.appendChild(overlay);

            item.appendChild(imageContainer);

            const titleDiv = document.createElement('div');
            titleDiv.className = 'gallery-item-title';
            titleDiv.textContent = category.displayName;
            item.appendChild(titleDiv);

            galleryGrid.appendChild(item);

            startItemSlideshow(slider, category.imageFiles.length);

            imageContainer.addEventListener('click', () => {
                openLightbox(category.id, 0);
            });
        });

        initializeScrollAnimations();
    }

    function startItemSlideshow(sliderElement, numImages, intervalTime = 3000) {
        if (numImages <= 1) return;
        const images = sliderElement.querySelectorAll('img');
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            images[currentIndex].classList.remove('active-slide');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active-slide');
        }, intervalTime);
        categorySlideshowIntervals.push(intervalId);
    }

    function openLightbox(categoryId, imgIndex) {
        const category = galleryCategories.find(cat => cat.id === categoryId);
        if (!category || !lightbox || !category.imageFiles.length) return;

        currentLightboxImagePaths = category.imageFiles.map(fileName => `images/${category.folderName}/${fileName}`);
        currentImageIndex = imgIndex;

        document.body.style.overflow = 'hidden';
        updateLightboxImage(category.displayName);
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function updateLightboxImage(categoryDisplayName) {
        if (!currentLightboxImagePaths.length || !lightboxImage || !lightboxCaption || !lightboxPrevBtn || !lightboxNextBtn) return;

        lightboxImage.src = currentLightboxImagePaths[currentImageIndex];
        lightboxImage.alt = `${categoryDisplayName} - Image ${currentImageIndex + 1} of ${currentLightboxImagePaths.length}`;
        lightboxCaption.textContent = `${categoryDisplayName} - Image ${currentImageIndex + 1} of ${currentLightboxImagePaths.length}`;

        const showNav = currentLightboxImagePaths.length > 1;
        lightboxPrevBtn.style.display = showNav ? 'block' : 'none';
        lightboxNextBtn.style.display = showNav ? 'block' : 'none';
    }

    function showNextImage() {
        if (currentLightboxImagePaths.length <= 1) return;
        currentImageIndex = (currentImageIndex + 1) % currentLightboxImagePaths.length;
        const currentCategory = galleryCategories.find(cat => {
            const pathParts = currentLightboxImagePaths[currentImageIndex].split('/');
            return pathParts.length > 1 && cat.folderName === pathParts[pathParts.length - 2];
        });
        updateLightboxImage(currentCategory?.displayName || 'Image');
    }

    function showPrevImage() {
        if (currentLightboxImagePaths.length <= 1) return;
        currentImageIndex = (currentImageIndex - 1 + currentLightboxImagePaths.length) % currentLightboxImagePaths.length;
        const currentCategory = galleryCategories.find(cat => {
            const pathParts = currentLightboxImagePaths[currentImageIndex].split('/');
            return pathParts.length > 1 && cat.folderName === pathParts[pathParts.length - 2];
        });
        updateLightboxImage(currentCategory?.displayName || 'Image');
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
        if (lightbox?.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft' && currentLightboxImagePaths.length > 1) showPrevImage();
            else if (e.key === 'ArrowRight' && currentLightboxImagePaths.length > 1) showNextImage();
        }
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Touch Swipe for Lightbox
    let touchstartX = 0;
    let touchendX = 0;
    const lightboxContentWrapper = document.querySelector('.lightbox-content-wrapper');
    if (lightboxContentWrapper) {
        lightboxContentWrapper.addEventListener('touchstart', (e) => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxContentWrapper.addEventListener('touchend', (e) => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX - 50) showNextImage();
            if (touchendX > touchstartX + 50) showPrevImage();
        }, { passive: true });
    }

    // Scroll Animations
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.15 });
            animatedElements.forEach(el => observer.observe(el));
        } else {
            animatedElements.forEach(el => el.classList.add('animated'));
        }
    }

    // Back to Top Button
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize
    createGalleryFilters();
    populateGallery();
});
