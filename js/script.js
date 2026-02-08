// JavaScript for DARKIS website
// Handles mobile menu, smooth scrolling, fade-ins, and other interactions

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
        });
    }

    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // Smooth scrolling for internal links (if any)
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Cart system (localStorage-based, used in product.html)
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Note: Cart logic is embedded in product.html for add-to-cart. Expand here if needed for a cart page.