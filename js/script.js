// ===== MAIN SCRIPT FOR PORTFOLIO WEBSITE =====

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // Use throttled/debounced handlers for better performance
        const throttledScroll = this.throttle(this.handleScroll.bind(this), 16); // ~60fps
        const debouncedResize = this.debounce(this.handleResize.bind(this), 250);
        
        this.setupEventListeners(throttledScroll, debouncedResize);
        this.initScrollReveal();
        this.initTypingEffect();
        this.initNavigation();
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initLazyLoading();
        this.initContactForm();
    }

    setupEventListeners(throttledScroll, debouncedResize) {
        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('resize', debouncedResize, { passive: true });
        window.addEventListener('load', this.handleLoad.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    // ===== SCROLL HANDLING =====
    handleScroll() {
        this.updateNavbar();
        this.revealElements();
        this.updateActiveNavLink();
    }

    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ===== SCROLL REVEAL ANIMATION =====
    initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        this.observeElements(revealElements);
    }

    observeElements(elements) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    revealElements() {
        const elements = document.querySelectorAll('.reveal:not(.active)');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // ===== TYPING EFFECT =====
    initTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Cloud Technologies',
            'Intelligent Web Applications',
            'AI/ML Fundamentals', 
            'Clean UI And Intuitive UX',
            'Real-World Problem Solving',
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            setTimeout(type, typingSpeed);
        };

        type();
    }

    // ===== NAVIGATION =====
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== MOBILE MENU =====
    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            // Set initial ARIA state
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            
            // Create overlay for mobile menu
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            document.body.appendChild(overlay);
            
            const toggleMenu = (isOpen) => {
                mobileMenu.classList.toggle('active', isOpen);
                mobileMenuBtn.classList.toggle('active', isOpen);
                overlay.classList.toggle('active', isOpen);
                mobileMenuBtn.setAttribute('aria-expanded', isOpen);
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = isOpen ? 'hidden' : '';
                
                // Focus management
                if (isOpen) {
                    const firstLink = mobileMenu.querySelector('a');
                    if (firstLink) {
                        setTimeout(() => firstLink.focus(), 100);
                    }
                } else {
                    mobileMenuBtn.focus();
                }
            };
            
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenu.classList.contains('active');
                toggleMenu(!isExpanded);
            });

            // Close mobile menu when clicking on a link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => toggleMenu(false));
            });

            // Close mobile menu when clicking overlay
            overlay.addEventListener('click', () => toggleMenu(false));

            // Close mobile menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        }
    }

    // ===== SMOOTH SCROLLING =====
    initSmoothScrolling() {
        // Already handled in CSS with scroll-behavior: smooth
        // This is a fallback for browsers that don't support it
        if (!CSS.supports('scroll-behavior', 'smooth')) {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        this.smoothScrollTo(targetElement.offsetTop - 80, 800);
                    }
                });
            });
        }
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // ===== LAZY LOADING =====
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // ===== UTILITY FUNCTIONS =====
    handleResize() {
        // Handle any resize-specific logic
        this.updateActiveNavLink();
    }

    handleLoad() {
        // Handle page load
        document.body.classList.add('loaded');
        
        // Initialize any load-dependent features
        this.initParticles();
    }

    handleKeydown(e) {
        // Handle keyboard navigation
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        }
    }

    // ===== PARTICLE ANIMATION (Optional) =====
    initParticles() {
        // Simple particle animation for hero section
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(139, 92, 246, 0.3);
                border-radius: 50%;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }

        hero.appendChild(particlesContainer);
    }

    // ===== CONTACT FORM HANDLING =====
    initContactForm() {
        const contactForm = document.querySelector('#contact-form');
        if (!contactForm) return;

        // Form is handled by Google Forms integration in contact page
        // This is a fallback for any other contact forms
        contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
    }

    handleContactSubmit(e) {
        // This is handled by the Google Forms integration
        // Just ensure proper loading states are applied
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.setAttribute('aria-busy', 'true');
            submitBtn.disabled = true;
        }
    }

    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--border-primary);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

}


// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// ===== UTILITY FUNCTIONS FOR EXTERNAL USE =====
window.PortfolioUtils = {
    // Smooth scroll to element
    scrollToElement: (selector, offset = 80) => {
        const element = document.querySelector(selector);
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Add reveal animation to elements
    addRevealAnimation: (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('reveal');
        });
    },

    // Copy text to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }
};