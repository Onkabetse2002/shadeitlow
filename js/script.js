// JavaScript for DARKIS website
// Handles mobile menu, smooth scrolling, fade-ins, cart, stock, and other interactions

// NOTE: Removed the line that was clearing the cart!

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', () => {
            console.log('Toggle button clicked');
            mobileMenu.classList.toggle('show');
            console.log('Mobile menu class:', mobileMenu.classList);
        });
    } else {
        console.log('Toggle button or mobile menu not found');
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

    // Smooth scrolling for internal links
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

    updateCartCount();
});

// Cart and Stock Management Functions
function getCart() {
    const cart = localStorage.getItem('cart');
    if (!cart) return [];
    return JSON.parse(cart);
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function getStock() {
    const products = getProducts();
    const stock = {};
    products.forEach(product => {
        stock[product.id] = product.stock;
    });
    return stock;
}

function saveStock(stock) {
    // Don't save to localStorage
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
    const products = getProducts();
    const product = products.find(p => p.id == productId);
    
    if (!product) return false;
    
    const cart = getCart();
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id == productId);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            sku: product.sku,
            price: product.price,
            image: product.images.front,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    return true;
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
}

function updateCartQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        saveCart(cart);
    }
}

// Your Products - 8 Products
function getProducts() {
    return [
        { 
            id: 1, 
            name: 'The Havenlight Dusk', 
            sku: '3503 C3',
            price: 550, 
            stock: 1,
            images: {
                front: 'shadesimages/shades/The Heavenlight Dusk F.jpg',
                left: 'shadesimages/shades/The Heavenlight Dusk L.jpg',
                right: 'shadesimages/shades/The Heavenlight Dusk R.jpg'
            }
        },
        { 
            id: 2, 
            name: 'The Havenlight Sky', 
            sku: '3503 C7',
            price: 600, 
            stock: 1,
            images: {
                front: 'shadesimages/shades/The Havenlight Sky F.jpg',
                left: 'shadesimages/shades/The Havenlight Sky L.jpg',
                right: 'shadesimages/shades/The Havenlight Sky R.jpg'
            }
        },
        { 
            id: 3, 
            name: 'The Havenlight Green', 
            sku: '3503 C8',
            price: 600, 
            stock: 1,
            images: {
                front: 'shadesimages/shades/The Havenlight Green F.jpg',
                left: 'shadesimages/shades/The Havenlight Green L.jpg',
                right: 'shadesimages/shades/The Havenlight Green R.jpg'
            }
        },
        { 
            id: 4, 
            name: 'The Havenlight Dawn', 
            sku: '3503 C5',
            price: 600, 
            stock: 3,
            images: {
                front: 'shadesimages/shades/The Heaven Light Dawn F.jpg',
                left: 'shadesimages/shades/The Heaven Light Dawn L.jpg',
                right: 'shadesimages/shades/The Heaven Light Dawn R.jpg'
            }
        },
        { 
            id: 5, 
            name: 'The Luminous Blue', 
            sku: '3503 C9',
            price: 600, 
            stock: 1,
            images: {
                front: 'shadesimages/shades/The Luminous Blue F.jpg',
                left: 'shadesimages/shades/The Luminous Blue L.jpg',
                right: 'shadesimages/shades/The Luminous Blue R.jpg'
            }
        },
        {
            id: 6,
            name: 'The Luminous Orange',
            sku: '3503 C10',
            price: 600,
            stock: 1,
            images: {
                front: 'shadesimages/shades/The Luminous Orange F.jpg',
                left: 'shadesimages/shades/The Luminous Orange L.jpg',
                right: 'shadesimages/shades/The Luminous Orange R.jpg'
            }
        },
        {
            id: 7,
            name: 'The Luminous Purple',
            sku: '3503 C1',
            price: 600,
            stock: 1,
            images: {
                front: 'shadesimages/shades/The Luminous Purple F.jpg',
                left: 'shadesimages/shades/The Luminous Purple L.jpg',
                right: 'shadesimages/shades/The Luminous Purple R.jpg'
            }
        },
        {
            id: 8,
            name: 'The Solora',
            sku: '58266 C1',
            price: 600,
            stock: 1,
            images: {
                front: 'shadesimages/shades/The Solora F.jpg',
                left: 'shadesimages/shades/The Solora L.jpg',
                right: 'shadesimages/shades/The Solora R.jpg'
            }
        }
    ];
}