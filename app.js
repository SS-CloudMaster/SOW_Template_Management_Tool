// Launchquests Website JavaScript

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeFormHandling();
    initializeScrollEffects();
    initializeAnimations();
    createScrollIndicator();
    addInteractiveEffects();
    manageFocus();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Handle nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
    
    // Handle all CTA button clicks
    const ctaButtons = document.querySelectorAll('[data-page]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            if (targetPage) {
                navigateToPage(targetPage);
                
                // Update nav links if navigating via CTA
                navLinks.forEach(l => l.classList.remove('active'));
                const correspondingNavLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
                
                closeMobileMenu();
            }
        });
    });
}

function navigateToPage(targetPage) {
    const pages = document.querySelectorAll('.page');
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPageElement = document.getElementById(targetPage);
    if (targetPageElement) {
        // Small delay for smooth transition
        setTimeout(() => {
            targetPageElement.classList.add('active');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Trigger animations for the new page
            triggerPageAnimations(targetPageElement);
        }, 100);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.getElementById('mobileToggle');
    
    if (navMenu && mobileToggle) {
        navMenu.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.getElementById('mobileToggle');
    
    if (navMenu && mobileToggle) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
    }
}

// Form handling
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    const scheduleBtn = document.getElementById('scheduleBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
    
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function() {
            navigateToPage('contact');
            
            // Update nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            const contactNavLink = document.querySelector('.nav-link[data-page="contact"]');
            if (contactNavLink) {
                contactNavLink.classList.add('active');
            }
            
            setTimeout(() => {
                const firstInput = contactForm.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 500);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (!validateForm(formObject)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showFormSuccess();
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateForm(formData) {
    const required = ['firstName', 'lastName', 'email'];
    let isValid = true;
    
    // Clear previous error states
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('error');
    });
    
    required.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            const input = document.getElementById(field);
            if (input) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    // Validate email format
    if (formData.email && !isValidEmail(formData.email)) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.classList.add('error');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFormError('Please fill in all required fields correctly.');
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormSuccess() {
    const contactForm = document.getElementById('contactForm');
    let successMessage = document.querySelector('.form-success');
    
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.style.cssText = `
            background: rgba(var(--color-success-rgb), 0.1);
            border: 1px solid rgba(var(--color-success-rgb), 0.2);
            color: var(--color-success);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            text-align: center;
            display: block;
        `;
        contactForm.insertBefore(successMessage, contactForm.firstChild);
    }
    
    successMessage.innerHTML = '✓ Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.';
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }, 5000);
}

function showFormError(message) {
    const contactForm = document.getElementById('contactForm');
    let errorMessage = document.querySelector('.form-error');
    
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'form-error';
        errorMessage.style.cssText = `
            background: rgba(var(--color-error-rgb), 0.1);
            border: 1px solid rgba(var(--color-error-rgb), 0.2);
            color: var(--color-error);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            text-align: center;
            display: block;
        `;
        contactForm.insertBefore(errorMessage, contactForm.firstChild);
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    setTimeout(() => {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }, 5000);
}

// Scroll effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            if (navbar) navbar.classList.add('scrolled');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
        }
        
        // Update scroll indicator
        updateScrollIndicator();
        
        lastScrollTop = scrollTop;
    });
}

// Animation triggers
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatableElements = document.querySelectorAll(
        '.service-card, .feature-item, .value-card, .stat-item, .approach-step, .timeline-item'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

function triggerPageAnimations(pageElement) {
    const animatableElements = pageElement.querySelectorAll(
        '.service-card, .feature-item, .value-card, .stat-item, .approach-step, .timeline-item'
    );
    
    animatableElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, index * 100);
    });
}

// Scroll indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--color-primary);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(indicator);
}

function updateScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        indicator.style.width = scrolled + '%';
    }
}

// Add interactive effects
function addInteractiveEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
}

// Add focus management for accessibility
function manageFocus() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Add dynamic styles
function addDynamicStyles() {
    const styles = `
        /* Mobile menu styles */
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--color-surface);
                border-top: 1px solid var(--color-border);
                flex-direction: column;
                padding: var(--space-20);
                gap: var(--space-16);
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all var(--duration-normal) var(--ease-standard);
                box-shadow: var(--shadow-lg);
                z-index: 999;
            }
            
            .nav-menu.mobile-open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .nav-cta {
                margin-left: 0;
                margin-top: var(--space-16);
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
        
        /* Form validation styles */
        .form-control.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
        }
        
        .form-control.error:focus {
            border-color: var(--color-error);
            outline-color: var(--color-error);
        }
        
        /* Navbar scroll styles */
        .navbar.scrolled {
            background: rgba(var(--color-surface), 0.98);
            backdrop-filter: blur(15px);
            box-shadow: var(--shadow-sm);
        }
        
        /* Ripple animation */
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Keyboard navigation styles */
        .keyboard-navigation *:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        .keyboard-navigation .btn:focus {
            box-shadow: var(--focus-ring);
        }
        
        /* Button hover effects */
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
        }
        
        .btn:hover::before {
            left: 100%;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize dynamic styles
addDynamicStyles();