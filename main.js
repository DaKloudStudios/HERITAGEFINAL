document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const bars = mobileBtn.querySelectorAll('span');
            // Animate hamburger to X
            if (navLinks.classList.contains('active')) {
                mobileBtn.innerHTML = '&times;';
                mobileBtn.style.fontSize = '2rem';
            } else {
                mobileBtn.innerHTML = '&#9776;';
                mobileBtn.style.fontSize = '1.5rem';
            }
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits bottom
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileBtn) {
                        mobileBtn.innerHTML = '&#9776;';
                        mobileBtn.style.fontSize = '1.5rem';
                    }
                }

                // Calculate offset for fixed header
                const headerOffset = navbar ? navbar.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ========================================
    // GALLERY FILTER TABS
    // ========================================
    const filterTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ========================================
    // CUSTOM WRENCH CURSOR
    // ========================================
    const customCursor = document.createElement('div');
    customCursor.id = 'custom-cursor';
    document.body.appendChild(customCursor);

    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        customCursor.classList.add('turning');
    });

    document.addEventListener('mouseup', () => {
        customCursor.classList.remove('turning');
    });
});

// ========================================
// LIGHTBOX FUNCTIONS (global scope)
// ========================================
function openLightbox(btn) {
    event.stopPropagation();
    const item = btn.closest('.gallery-item');
    const img = item.querySelector('img');
    const modal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    if (e.target === document.getElementById('lightboxImage')) return;
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('lightboxModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ========================================
// WATER RIPPLE CLICK EFFECT
// ========================================
document.addEventListener('click', function (e) {
    // Create the ripple element
    const ripple = document.createElement('div');
    ripple.classList.add('water-ripple');

    // Calculate position
    // We want the ripple to be centered on the cursor
    const diameter = 40; // Base size of the ripple
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - diameter / 2}px`;
    ripple.style.top = `${e.clientY + window.scrollY - diameter / 2}px`;

    // Add to body
    document.body.appendChild(ripple);

    // Remove the element after the animation finishes
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
});

// ========================================
// TEXT PRESSURE CLASS
// ========================================
class TextPressure {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.options = Object.assign({
            fontFamily: 'Compressa VF',
            fontUrl: 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
            weight: true,
            width: true,
            italic: true
        }, options);

        this.mouse = { x: 0, y: 0 };
        this.cursor = { x: 0, y: 0 };
        this.init();
    }

    init() {
        if (!document.getElementById('text-pressure-font')) {
            const style = document.createElement('style');
            style.id = 'text-pressure-font';
            style.innerHTML = `
                @font-face {
                    font-family: '${this.options.fontFamily}';
                    src: url('${this.options.fontUrl}');
                    font-style: normal;
                }
            `;
            document.head.appendChild(style);
        }

        const content = this.element.innerHTML;
        this.element.innerHTML = '';
        this.element.style.fontFamily = this.options.fontFamily;

        const parts = content.split(/<br\s*\/?>/i);
        parts.forEach((part, index) => {
            // decode HTML entities if any
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = part;
            const text = tempDiv.textContent;

            const chars = text.split('');
            chars.forEach(char => {
                const span = document.createElement('span');
                span.innerText = char;
                span.style.display = 'inline-block';
                // Adjust margin slightly for a cohesive block look
                span.style.margin = '0 -0.01em';
                if (char === ' ') span.innerHTML = '&nbsp;';
                this.element.appendChild(span);
            });

            if (index < parts.length - 1) {
                this.element.appendChild(document.createElement('br'));
            }
        });

        // Initialize mouse pos to center
        const rect = this.element.getBoundingClientRect();
        this.mouse.x = rect.left + rect.width / 2;
        this.mouse.y = rect.top + rect.height / 2;
        this.cursor.x = this.mouse.x;
        this.cursor.y = this.mouse.y;

        window.addEventListener('mousemove', (e) => {
            this.cursor.x = e.clientX;
            this.cursor.y = e.clientY;
        });
        window.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            this.cursor.x = t.clientX;
            this.cursor.y = t.clientY;
        }, { passive: true });

        this.animate();
    }

    getAttr(distance, maxDist, minVal, maxVal) {
        const val = maxVal - Math.abs((maxVal * distance) / maxDist);
        return Math.max(minVal, val + minVal);
    }

    animate() {
        this.mouse.x += (this.cursor.x - this.mouse.x) / 15;
        this.mouse.y += (this.cursor.y - this.mouse.y) / 15;

        if (this.element) {
            const titleRect = this.element.getBoundingClientRect();
            const maxDist = titleRect.width / 2;

            Array.from(this.element.children).forEach(span => {
                if (span.tagName.toLowerCase() === 'br') return;

                const rect = span.getBoundingClientRect();
                const charCenter = {
                    x: rect.x + rect.width / 2,
                    y: rect.y + rect.height / 2
                };

                const dx = this.mouse.x - charCenter.x;
                const dy = this.mouse.y - charCenter.y;
                const d = Math.sqrt(dx * dx + dy * dy);

                const wdth = this.options.width ? Math.floor(this.getAttr(d, maxDist, 5, 200)) : 100;
                const wght = this.options.weight ? Math.floor(this.getAttr(d, maxDist, 100, 900)) : 400;
                const italVal = this.options.italic ? this.getAttr(d, maxDist, 0, 1).toFixed(2) : 0;

                span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
            });
        }

        requestAnimationFrame(() => this.animate());
    }
}
