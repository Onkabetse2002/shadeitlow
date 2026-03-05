// JavaScript for DARKIS website
// Handles mobile menu, smooth scrolling, fade-ins, cart, stock, and cart drawer

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
    initCartDrawer();
    addCartIconToNavbar();
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
    loadCartDrawer();
}

function getStock() {
    const products = getProducts();
    const stock = {};
    products.forEach(product => {
        stock[product.id] = product.stock;
    });
    return stock;
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

// --- CART DRAWER FUNCTIONALITY ---

// Open cart drawer
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Close cart drawer
function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Load cart drawer items
function loadCartDrawer() {
    const cart = getCart();
    const drawerItems = document.getElementById('cart-drawer-items');
    const drawerTotal = document.getElementById('cart-drawer-total');
    
    if (!drawerItems) return;
    
    drawerItems.innerHTML = '';
    
    if (cart.length === 0) {
        drawerItems.innerHTML = `
            <div class="cart-drawer-empty">
                <p>Your cart is empty</p>
                <a href="shop.html" class="cta-button">Continue Shopping</a>
            </div>
        `;
        drawerTotal.textContent = 'Total: R0';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-drawer-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-drawer-item-details">
                <h4>${item.name}</h4>
                <p>SKU: ${item.sku}</p>
                <p>R${item.price}</p>
                <div class="cart-drawer-item-quantity">
                    <button onclick="updateDrawerQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateDrawerQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="cart-drawer-item-remove" onclick="removeFromCartDrawer(${index})">Remove</button>
        `;
        
        drawerItems.appendChild(itemDiv);
    });
    
    drawerTotal.textContent = 'Total: R' + total;
}

// Update quantity in drawer
function updateDrawerQuantity(index, change) {
    const cart = getCart();
    const item = cart[index];
    
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            saveCart(cart);
            loadCartDrawer();
            updateCartCount();
        }
    }
}

// Remove item from drawer
function removeFromCartDrawer(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCartDrawer();
    updateCartCount();
}

// Initialize cart drawer
function initCartDrawer() {
    if (document.getElementById('cart-drawer')) return;
    
    const drawerHTML = `
        <div class="cart-drawer-overlay" id="cart-drawer-overlay" onclick="closeCartDrawer()"></div>
        <div class="cart-drawer" id="cart-drawer">
            <div class="cart-drawer-header">
                <h3>Your Cart</h3>
                <button class="cart-drawer-close" onclick="closeCartDrawer()">×</button>
            </div>
            <div class="cart-drawer-items" id="cart-drawer-items">
                <!-- Cart items will be loaded here -->
            </div>
            <div class="cart-drawer-footer">
                <div class="cart-drawer-total">
                    <span>Total</span>
                    <span id="cart-drawer-total">R0</span>
                </div>
                <button class="cart-drawer-checkout" onclick="window.location.href='cart.html'">Proceed to Checkout</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
    loadCartDrawer();
}

// Add cart icon button to navbar
function addCartIconToNavbar() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    if (document.querySelector('.cart-icon-btn')) return;
    
    const cartIcon = document.createElement('button');
    cartIcon.className = 'cart-icon-btn';
    cartIcon.innerHTML = '<i class="fas fa-shopping-bag"></i>';
    cartIcon.onclick = openCartDrawer;
    
    const cartLink = navLinks.querySelector('.cart-link');
    if (cartLink) {
        navLinks.insertBefore(cartIcon, cartLink);
    } else {
        navLinks.appendChild(cartIcon);
    }
}

// --- PRODUCT SLIDER FUNCTIONALITY ---

function changeSlide(direction) {
    window.currentSlide += direction;
    const totalSlides = window.productImages.length;
    if (window.currentSlide >= totalSlides) window.currentSlide = 0;
    if (window.currentSlide < 0) window.currentSlide = totalSlides - 1;
    updateSlideDisplay();
}

function setSlide(index) {
    window.currentSlide = index;
    updateSlideDisplay();
}

function updateSlideDisplay() {
    document.getElementById('main-image').src = window.productImages[window.currentSlide];
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === window.currentSlide);
    });
}

function addToCartAndNotify(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const success = addToCart(productId, quantity);
    if (success) {
        alert('Product added to cart!');
    }
}