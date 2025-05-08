document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTIONS ---
    const hamburger = document.getElementById('hamburger');
    const navMenuLinks = document.getElementById('navLinks'); // Renamed for clarity
    const contactForm = document.getElementById('contactForm');
    const galleryGrid = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
    const lightboxPrevBtn = document.querySelector('.lightbox-prev-btn');
    const lightboxNextBtn = document.querySelector('.lightbox-next-btn');
    const lightboxContentWrapper = document.querySelector('.lightbox-content-wrapper');
    const navLinksForScrollHighlight = document.querySelectorAll('.nav-links a[href^="#"]'); // For active link and smooth scroll

    // --- GALLERY DATA ---
    const galleryCategories = [
        { id: "bed", displayName: "Bed", folderName: "Bed", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg" ] },
        { id: "tv-unit", displayName: "TV Unit", folderName: "TV_Unit", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg" ] },
        { id: "dining-table", displayName: "Dining Table", folderName: "Dining_Table", imageFiles: ["1.jpg"] },
        { id: "sofa", displayName: "Sofa", folderName: "Sofa", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg" ] },
        { id: "wooden-ceiling", displayName: "Wooden Ceiling", folderName: "Wooden_Ceiling", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg" ] },
        { id: "kitchen", displayName: "Kitchen", folderName: "Kitchen", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg" ] },
        { id: "cupboard", displayName: "Cupboard", folderName: "Cupboard", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg" ] },
        { id: "pataisan", displayName: "Pataisan", folderName: "Pataisan", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg" ] },
        { id: "furniture", displayName: "Furniture", folderName: "Furniture", imageFiles: [ "1.jpg", "2.jpg", "3.jpg", "4.jpg" ] }
    ];
    let currentLightboxImagePaths = [];
    let currentImageIndex = 0;
    let categorySlideshowIntervals = [];
    let touchstartX = 0;
    let touchendX = 0;

    // --- HEADER OFFSET & SECTIONS FOR SCROLL HIGHLIGHT ---
    let headerOffset = 70;
    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerOffset = headerElement.offsetHeight > 0 ? headerElement.offsetHeight : 70;
    }
    const sectionsForScrollHighlight = [];
    navLinksForScrollHighlight.forEach(link => {
        const sectionId = link.getAttribute('href');
        if (sectionId.length > 1) {
            const section = document.querySelector(sectionId);
            if (section) sectionsForScrollHighlight.push(section);
        }
    });


    // --- FUNCTION DEFINITIONS ---

    // Mobile Navigation Toggle
    function toggleMobileNav() {
        if (navMenuLinks && hamburger) {
            navMenuLinks.classList.toggle('active');
            hamburger.innerHTML = navMenuLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        }
    }

    function closeMobileNavOnClick() {
        if (navMenuLinks && navMenuLinks.classList.contains('active') && hamburger) {
            navMenuLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Smooth Scroll & Active Nav Link Highlight
    function handleNavLinkClick(e) {
        const link = e.currentTarget;
        const sectionId = link.getAttribute('href');
        if (sectionId && sectionId.startsWith('#') && sectionId.length > 1) {
            e.preventDefault();
            const targetSection = document.querySelector(sectionId);
            if (targetSection) {
                let currentOffset = headerOffset;
                if (sectionId === '#home') currentOffset = 0;
                window.scrollTo({
                    top: targetSection.offsetTop - currentOffset,
                    behavior: 'smooth'
                });
                closeMobileNavOnClick(); // Close mobile nav if open
            }
        } else {
            // If it's a link to another page, just let it behave normally
            // and close mobile nav if it was open.
            closeMobileNavOnClick();
        }
    }

    function highlightActiveNavLinkOnScroll() {
        if (sectionsForScrollHighlight.length === 0) return;

        let currentSectionId = '';
        const scrollPosition = window.scrollY + headerOffset + 50; // Buffer

        sectionsForScrollHighlight.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (window.scrollY < sectionsForScrollHighlight[0].offsetTop - headerOffset) {
            currentSectionId = sectionsForScrollHighlight[0].getAttribute('id');
        }

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            const lastSection = sectionsForScrollHighlight[sectionsForScrollHighlight.length - 1];
            if (lastSection) currentSectionId = lastSection.id;
        }

        navLinksForScrollHighlight.forEach(link => {
            link.classList.remove('active-nav-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-nav-link');
            }
        });
    }

    // Contact Form Submission
    function handleContactFormSubmit(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        if (contactForm) contactForm.reset();
    }

    // Gallery: Populate
    function populateGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        categorySlideshowIntervals.forEach(clearInterval);
        categorySlideshowIntervals = [];

        galleryCategories.forEach((category, categoryIndex) => {
            if (!category.imageFiles || category.imageFiles.length === 0) return;

            const item = document.createElement('div');
            item.className = 'gallery-item animate-on-scroll scale-up';
            item.style.transitionDelay = `${categoryIndex * 0.05}s`;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'gallery-item-image-container';
            const slider = document.createElement('div');
            slider.className = 'gallery-image-slider';

            category.imageFiles.forEach((imageFileName, imgIndex) => {
                const img = document.createElement('img');
                img.src = `images/${category.folderName}/${imageFileName}`;
                img.alt = `${category.displayName} - Image ${imgIndex + 1}`;
                img.onerror = () => { img.style.display = 'none'; console.error(`Error loading: ${img.src}`); };
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
            imageContainer.addEventListener('click', () => openLightbox(category.id, 0));
        });
        initializeScrollAnimations(); // Initialize after gallery items are added
    }

    // Gallery: Item Slideshow
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

    // Lightbox: Open/Close/Update
    function openLightbox(categoryId, imgIndex) {
        const category = galleryCategories.find(cat => cat.id === categoryId);
        if (!category || !lightbox || !category.imageFiles || category.imageFiles.length === 0) return;
        currentLightboxImagePaths = category.imageFiles.map(fileName => `images/${category.folderName}/${fileName}`);
        currentImageIndex = imgIndex;
        document.body.style.overflow = 'hidden';
        updateLightboxImage(category.displayName);
        if(lightbox) lightbox.classList.add('active');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
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

    function showNextLightboxImage() {
        if (currentLightboxImagePaths.length <= 1) return;
        currentImageIndex = (currentImageIndex + 1) % currentLightboxImagePaths.length;
        const currentCategory = galleryCategories.find(cat => currentLightboxImagePaths[currentImageIndex].includes(`/${cat.folderName}/`));
        updateLightboxImage(currentCategory ? currentCategory.displayName : 'Image');
    }

    function showPrevLightboxImage() {
        if (currentLightboxImagePaths.length <= 1) return;
        currentImageIndex = (currentImageIndex - 1 + currentLightboxImagePaths.length) % currentLightboxImagePaths.length;
        const currentCategory = galleryCategories.find(cat => currentLightboxImagePaths[currentImageIndex].includes(`/${cat.folderName}/`));
        updateLightboxImage(currentCategory ? currentCategory.displayName : 'Image');
    }

    // Lightbox: Swipe
    function handleLightboxSwipe() {
        if (currentLightboxImagePaths.length <= 1) return;
        const swipeThreshold = 50;
        if (touchendX < touchstartX - swipeThreshold) showNextLightboxImage();
        if (touchendX > touchstartX + swipeThreshold) showPrevLightboxImage();
    }

    // Scroll Animations (general)
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('animated');
                });
            }, { threshold: 0.1 });
            animatedElements.forEach(el => observer.observe(el));
        } else {
            animatedElements.forEach(el => el.classList.add('animated'));
        }
    }

    // Scroll-based Gradient Animation for Body Background
    function handleScrollGradientAnimation() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) {
            document.documentElement.style.setProperty('--gradient-scroll-y', `0%`);
            return;
        }
        const scrollTop = window.scrollY;
        let scrollPercent = (scrollTop / scrollableHeight) * 100;
        scrollPercent = Math.min(100, Math.max(0, scrollPercent));
        document.documentElement.style.setProperty('--gradient-scroll-y', `${scrollPercent}%`);
    }


    // --- EVENT LISTENERS ---
    if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
    // All nav links (including those not for sections, e.g., to other pages) should close mobile nav
    document.querySelectorAll('#navLinks a').forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    if (contactForm) contactForm.addEventListener('submit', handleContactFormSubmit);

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevLightboxImage);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextLightboxImage);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    if (lightboxContentWrapper) {
        lightboxContentWrapper.addEventListener('touchstart', (e) => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        lightboxContentWrapper.addEventListener('touchend', (e) => { touchendX = e.changedTouches[0].screenX; handleLightboxSwipe(); }, { passive: true });
    }
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') showPrevLightboxImage();
            else if (e.key === 'ArrowRight') showNextLightboxImage();
        }
    });

    window.addEventListener('scroll', highlightActiveNavLinkOnScroll, { passive: true });
    window.addEventListener('scroll', handleScrollGradientAnimation, { passive: true });


    // --- INITIAL CALLS ---
    if (galleryGrid) { // Only populate gallery if the grid exists on the current page
        populateGallery(); // This also calls initializeScrollAnimations for gallery items
    } else {
        initializeScrollAnimations(); // Call for non-gallery pages/elements
    }
    highlightActiveNavLinkOnScroll(); // Set active link on page load
    handleScrollGradientAnimation();  // Set initial body background gradient position
});
