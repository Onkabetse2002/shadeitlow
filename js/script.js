// JavaScript for DARKIS website
// Handles mobile menu, smooth scrolling, fade-ins, cart, stock, and other interactions

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

    // Update cart count on page load
    updateCartCount();
});

// Cart and Stock Management Functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function getStock() {
    return JSON.parse(localStorage.getItem('stock')) || {
        1: 10, // Darkis Aviator
        2: 10, // Darkis Wayfarer
        3: 10, // Darkis Round
        4: 10, // Darkis Cat Eye
        5: 10  // Darkis Square
    };
}

function saveStock(stock) {
    localStorage.setItem('stock', JSON.stringify(stock));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    });
}

function addToCart(productId, quantity) {
    const stock = getStock();
    if (stock[productId] < quantity) {
        alert('Not enough stock available.');
        return false;
    }
    const cart = getCart();
    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        const products = getProducts();
        const product = products.find(p => p.id == productId);
        cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity });
    }
    saveCart(cart);
    stock[productId] -= quantity;
    saveStock(stock);
    return true;
}

function removeFromCart(productId) {
    const cart = getCart();
    const stock = getStock();
    const item = cart.find(item => item.id == productId);
    if (item) {
        stock[productId] += item.quantity; // Restore stock
        cart.splice(cart.indexOf(item), 1);
        saveCart(cart);
        saveStock(stock);
    }
}

function updateCartQuantity(productId, newQuantity) {
    const cart = getCart();
    const stock = getStock();
    const item = cart.find(item => item.id == productId);
    if (item) {
        const diff = newQuantity - item.quantity;
        if (stock[productId] < diff) {
            alert('Not enough stock available.');
            return;
        }
        item.quantity = newQuantity;
        stock[productId] -= diff;
        saveCart(cart);
        saveStock(stock);
    }
}

function getProducts() {
    return [
        { id: 1, name: 'Darkis Aviator', price: 150, image: 'shadesimages/products/product1.jpg' },
        { id: 2, name: 'Darkis Wayfarer', price: 140, image: 'https://via.placeholder.com/400x400?text=Darkis+Wayfarer' },
        { id: 3, name: 'Darkis Round', price: 130, image: 'https://via.placeholder.com/400x400?text=Darkis+Round' },
        { id: 4, name: 'Darkis Cat Eye', price: 160, image: 'https://via.placeholder.com/400x400?text=Darkis+Cat+Eye' },
        { id: 5, name: 'Darkis Square', price: 145, image: 'https://via.placeholder.com/400x400?text=Darkis+Square' }
    ];
}