// Launch Quests Professional Website JavaScript
// Fixed navigation and functionality issues

// Global variables
let currentTestimonial = 0;
let isLoading = true;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeNavigation();
    initializeMobileMenu();
    initializeTestimonials();
    initializeScrollEffects();
    initializeFormHandling();
    initializeAnimations();
    initializeInteractiveElements();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                isLoading = false;
                triggerInitialAnimations();
            }, 500);
        }
    }, 3000);
}

// Navigation System - Fixed
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const ctaButtons = document.querySelectorAll('button[data-page], .btn[data-page]');
    
    console.log('Initializing navigation with', navLinks.length, 'nav links and', ctaButtons.length, 'CTA buttons');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this.getAttribute('data-page'));
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                navigateToPage(targetPage);
                updateActiveNav(this);
                closeMobileMenu();
            }
        });
    });
    
    // Handle CTA button clicks
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('CTA button clicked:', this.getAttribute('data-page'));
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                navigateToPage(targetPage);
                updateActiveNavByPage(targetPage);
                closeMobileMenu();
            }
        });
    });
    
    // Handle logo click to go home
    const logo = document.querySelector('.company-brand, .brand-name');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('home');
            updateActiveNavByPage('home');
            closeMobileMenu();
        });
        logo.style.cursor = 'pointer';
    }
}

function navigateToPage(targetPage) {
    console.log('Navigating to page:', targetPage);
    
    const pages = document.querySelectorAll('.page');
    const targetPageElement = document.getElementById(targetPage);
    
    if (!targetPageElement) {
        console.error('Target page not found:', targetPage);
        return;
    }
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Show target page with animation
    targetPageElement.style.display = 'block';
    targetPageElement.classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Trigger page-specific animations
    setTimeout(() => {
        triggerPageAnimations(targetPageElement);
    }, 100);
    
    console.log('Successfully navigated to:', targetPage);
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateActiveNavByPage(targetPage) {
    const correspondingNavLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);
    if (correspondingNavLink) {
        updateActiveNav(correspondingNavLink);
    }
}

// Mobile Menu - Fixed
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close when clicking nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMobileMenu, 100);
            });
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

// Testimonials Carousel - Fixed
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    if (!testimonials.length) return;
    
    console.log('Initializing testimonials with', testimonials.length, 'cards');
    
    // Auto-rotate testimonials every 6 seconds
    setInterval(() => {
        if (!document.querySelector('.testimonials-carousel:hover')) {
            nextTestimonial();
        }
    }, 6000);
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevTestimonial();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextTestimonial();
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            showTestimonial(index);
        });
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % 3;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = currentTestimonial === 0 ? 2 : currentTestimonial - 1;
    showTestimonial(currentTestimonial);
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.indicator');
    
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    currentTestimonial = index;
}

// Scroll Effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar effects
        if (scrollTop > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Parallax effect for floating cards
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = 0.3 + (index * 0.1);
            const ypos = -(scrollTop * speed);
            card.style.transform = `translateY(${ypos}px)`;
        });
        
        lastScrollTop = scrollTop;
    });
}

// Form Handling - Fixed
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    const scheduleBtn = document.getElementById('scheduleConsultation');
    
    if (contactForm) {
        console.log('Contact form found, initializing...');
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time field validation
        const fields = contactForm.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });
    } else {
        console.log('Contact form not found');
    }
    
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('contact');
            updateActiveNavByPage('contact');
            
            setTimeout(() => {
                const firstInput = document.getElementById('firstName');
                if (firstInput) {
                    firstInput.focus();
                    firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1000);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    console.log('Form submitted with data:', formObject);
    
    // Validate all fields
    if (!validateForm(formObject)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <span class="btn-arrow">⏳</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showFormSuccess();
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateForm(formData) {
    const required = ['firstName', 'lastName', 'email', 'message'];
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.classList.remove('error');
        clearFieldError({ target: input });
    });
    
    required.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            const input = document.getElementById(field);
            if (input) {
                input.classList.add('error');
                showFieldError(input, 'This field is required');
                isValid = false;
            }
        }
    });
    
    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.classList.add('error');
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        field.classList.add('error');
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    field.classList.remove('error');
    clearFieldError(e);
    return true;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFieldError(field, message) {
    clearFieldError({ target: field });
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        animation: slideDown 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormSuccess() {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B35, #FFA726);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        font-weight: 600;
        max-width: 300px;
    `;
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">✅</span>
            <div>
                <div>Message sent successfully!</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">We'll respond within 2 hours</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => successDiv.remove(), 500);
        }
    }, 5000);
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animate-in');
                entry.target.classList.add('animated');
                
                // Special animation for service cards
                if (entry.target.classList.contains('service-card')) {
                    animateServiceCard(entry.target);
                }
                
                // Special animation for case study cards
                if (entry.target.classList.contains('case-study-card')) {
                    animateCaseStudyCard(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatableElements = document.querySelectorAll(`
        .service-card,
        .case-study-card,
        .testimonial-card,
        .value-item,
        .value-card,
        .service-detail-card,
        .contact-item
    `);
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

function animateServiceCard(card) {
    const tags = card.querySelectorAll('.tag');
    
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.animation = 'slideUp 0.3s ease-out forwards';
        }, index * 100);
    });
}

function animateCaseStudyCard(card) {
    const resultItems = card.querySelectorAll('.result-item');
    
    resultItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'slideUp 0.3s ease-out forwards';
        }, index * 150);
    });
}

// Interactive Elements
function initializeInteractiveElements() {
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button ripple effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        // Skip buttons that already have click handlers for navigation
        if (!button.hasAttribute('data-page')) {
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
        }
    });
    
    // Smooth hover transitions for cards
    const cards = document.querySelectorAll('.service-detail-card, .value-item, .case-study-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Trigger initial animations after loading
function triggerInitialAnimations() {
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-cta, .hero-stats');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'slideUp 0.8s ease-out forwards';
        }, index * 200);
    });
    
    // Animate floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.animation = `float 6s ease-in-out infinite ${index * 2}s`;
        }, 500 + index * 300);
    });
    
    // Animate center logo
    const centerLogo = document.querySelector('.center-logo');
    if (centerLogo) {
        setTimeout(() => {
            centerLogo.style.animation = 'pulse 3s ease-in-out infinite';
        }, 1000);
    }
}

// Trigger page-specific animations
function triggerPageAnimations(pageElement) {
    const animatableElements = pageElement.querySelectorAll(`
        .service-module,
        .mission-content,
        .value-item,
        .contact-item
    `);
    
    animatableElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 100);
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Add custom CSS animations dynamically
const customAnimations = `
    @keyframes slideUp {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateY(-10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        0% {
            opacity: 0;
            transform: translateX(100px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        0% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: slideUp 0.6s ease-out forwards;
    }
    
    .floating-card {
        opacity: 0;
    }
    
    .service-detail-card.error,
    input.error,
    select.error,
    textarea.error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.2) !important;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = customAnimations;
document.head.appendChild(styleSheet);

// Export functions for external use
window.LaunchQuests = {
    navigateToPage,
    showTestimonial,
    nextTestimonial,
    prevTestimonial,
    toggleMobileMenu
};

// Initialize navigation immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM hasn't finished loading yet
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    // DOM is already loaded
    initializeNavigation();
}

console.log('Launch Quests website JavaScript loaded successfully');