document.addEventListener('DOMContentLoaded', () => {
    // GSAP Hero Section Animations
    gsap.fromTo(
        ".hero",
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
    );
    gsap.fromTo(
        ".hero-headline",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(
        ".hero-subline",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.7 }
    );
    gsap.fromTo(
        ".hero .btn",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.9 }
    );

    // Scroll-Triggered Animations for Sections
    const sections = ["services", "gallery", "about", "contact"];
    sections.forEach((section) => {
        const sectionElement = document.querySelector(`#${section}`);
        const title = sectionElement.querySelector(".section-title h2");
        const cards = sectionElement.querySelectorAll(".service-card, .gallery-item, .about-image, .about-text, .contact-info, .contact-form");

        gsap.from(title, {
            scrollTrigger: {
                trigger: sectionElement,
                start: "top 80%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
        });

        cards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
                duration: 0.8,
                ease: "power3.out",
                delay: index * 0.2,
            });
        });
    });

    // Parallax Effect for Hero Background
    gsap.to(".hero", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
        },
        backgroundPosition: "50% 60%",
        ease: "none",
    });

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
            gsap.fromTo(
                ".nav-links a",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
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
                gsap.to(window, {
                    scrollTo: {
                        y: targetElement.offsetTop - offset,
                        autoKill: false,
                    },
                    duration: 1,
                    ease: "power2.out",
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

    // Gallery and Lightbox Code
    const galleryCategories = [
        {
            id: "bed",
            displayName: "Bed",
            folderName: "Bed",
            imageFiles: [
                "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg",
                "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg",
                "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg"
            ]
        },
        {
            id: "tv-unit",
            displayName: "TV Unit",
            folderName: "TV_Unit",
            imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"]
        },
        {
            id: "dining-table",
            displayName: "Dining Table",
            folderName: "Dining_Table",
            imageFiles: ["1.jpg"]
        },
        {
            id: "sofa",
            displayName: "Sofa",
            folderName: "Sofa",
            imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"]
        },
        {
            id: "wooden-ceiling",
            displayName: "Wooden Ceiling",
            folderName: "Wooden_Ceiling",
            imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg"]
        },
        {
            id: "kitchen",
            displayName: "Kitchen",
            folderName: "Kitchen",
            imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"]
        },
        {
            id: "cupboard",
            displayName: "Cupboard",
            folderName: "Cupboard",
            imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg"]
        },
        {
            id: "pataisan",
            displayName: "Pataisan",
            folderName: "Pataisan",
            imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"]
        },
        {
            id: "furniture",
            displayName: "Furniture",
            folderName: "Furniture",
            imageFiles: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"]
        }
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

    function populateGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        categorySlideshowIntervals.forEach(clearInterval);
        categorySlideshowIntervals = [];

        galleryCategories.forEach((category, categoryIndex) => {
            if (!category.imageFiles || category.imageFiles.length === 0) {
                console.warn(`No image files listed for category: ${category.displayName}`);
                return;
            }

            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.transitionDelay = `${categoryIndex * 0.05}s`;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'gallery-item-image-container';

            const slider = document.createElement('div');
            slider.className = 'gallery-image-slider';

            category.imageFiles.forEach((imageFileName, imgIndex) => {
                const img = document.createElement('img');
                img.src = `images/${category.folderName}/${imageFileName}`;
                img.alt = `${category.displayName} - Image ${imgIndex + 1}`;
                img.onerror = () => {
                    console.error(`Error loading image: ${img.src}`);
                    img.style.display = 'none';
                };
                if (imgIndex === 0) {
                    img.classList.add('active-slide');
                }
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
    }

    function startItemSlideshow(sliderElement, numImages, intervalTime = 2500) {
        if (numImages <= 1) return;
        const images = sliderElement.querySelectorAll('img');
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            if (images[currentIndex]) images[currentIndex].classList.remove('active-slide');
            currentIndex = (currentIndex + 1) % images.length;
            if (images[currentIndex]) images[currentIndex].classList.add('active-slide');
        }, intervalTime);
        categorySlideshowIntervals.push(intervalId);
    }

    function openLightbox(categoryId, imgIndex) {
        const category = galleryCategories.find(cat => cat.id === categoryId);
        if (!category || !lightbox || !category.imageFiles || category.imageFiles.length === 0) return;

        currentLightboxImagePaths = category.imageFiles.map(fileName => `images/${category.folderName}/${fileName}`);
        currentImageIndex = imgIndex;

        document.body.style.overflow = 'hidden';
        updateLightboxImage(category.displayName);
        lightbox.classList.add('active');

        gsap.fromTo(
            ".lightbox-image",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }

    function closeLightbox() {
        if (!lightbox) return;
        gsap.to(".lightbox-image", {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            },
        });
    }

    function updateLightboxImage(categoryDisplayName) {
        if (currentLightboxImagePaths.length === 0 || !lightboxImage || !lightboxCaption || !lightboxPrevBtn || !lightboxNextBtn) return;

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
        updateLightboxImage(currentCategory ? currentCategory.displayName : 'Image');
        gsap.fromTo(
            ".lightbox-image",
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
    }

    function showPrevImage() {
        if (currentLightboxImagePaths.length <= 1) return;
        currentImageIndex = (currentImageIndex - 1 + currentLightboxImagePaths.length) % currentLightboxImagePaths.length;
        const currentCategory = galleryCategories.find(cat => {
            const pathParts = currentLightboxImagePaths[currentImageIndex].split('/');
            return pathParts.length > 1 && cat.folderName === pathParts[pathParts.length - 2];
        });
        updateLightboxImage(currentCategory ? currentCategory.displayName : 'Image');
        gsap.fromTo(
            ".lightbox-image",
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft' && currentLightboxImagePaths.length > 1) {
                showPrevImage();
            } else if (e.key === 'ArrowRight' && currentLightboxImagePaths.length > 1) {
                showNextImage();
            }
        }
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    let touchstartX = 0;
    let touchendX = 0;
    const lightboxContentWrapper = document.querySelector('.lightbox-content-wrapper');

    if (lightboxContentWrapper) {
        lightboxContentWrapper.addEventListener('touchstart', function (event) {
            touchstartX = event.changedTouches[0].screenX;
        }, { passive: true });

        lightboxContentWrapper.addEventListener('touchend', function ( event) {
            touchendX = event.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        if (currentLightboxImagePaths.length <= 1) return;
        const swipeThreshold = 50;
        if (touchendX < touchstartX - swipeThreshold) {
            showNextImage();
        }
        if (touchendX > touchstartX + swipeThreshold) {
            showPrevImage();
        }
    }

    // Initial population of gallery
    populateGallery();
});
