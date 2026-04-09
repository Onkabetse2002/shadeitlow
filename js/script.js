// --- 1. PRODUCT DATA ---
const products = [
    { id: 1, name: "The Black Out", sku: "DKS-BO-001", price: 250.00 },
    { id: 2, name: "The Gold Standard", sku: "DKS-GS-002", price: 300.00 },
    { id: 3, name: "The Navigator", sku: "DKS-NV-003", price: 280.00 },
    { id: 4, name: "Ocean Breeze", sku: "DKS-OB-004", price: 260.00 },
    { id: 5, name: "Midnight Pulse", sku: "DKS-MP-005", price: 320.00 },
    { id: 6, name: "Urban Edge", sku: "DKS-UE-006", price: 290.00 }
];

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("System Initialized...");
    updateBadge();

    // Check if we are on the Checkout Page
    const summaryContainer = document.getElementById('summary-items');
    if (summaryContainer) {
        console.log("Checkout Page Detected. Rendering Summary...");
        renderCheckoutSummary();
    }

    // LOCK THE BUTTON
    const payBtn = document.getElementById('pay-now-btn');
    if (payBtn) {
        console.log("Pay Button Found. Attaching Listener...");
        payBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent page refresh
            handleOzowPayment();
        });
    } else {
        console.warn("CRITICAL: pay-now-btn not found in HTML!");
    }
});

// --- 3. FUNCTIONS ---
function updateBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach(b => b.textContent = count);
}

function renderCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryContainer = document.getElementById('summary-items');
    const totalDisplay = document.getElementById('summary-total');
    const hiddenAmount = document.getElementById('cart-total-amount');

    if (cart.length === 0) {
        summaryContainer.innerHTML = "<p>Cart is empty</p>";
        return;
    }

    let total = 0;
    summaryContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `<div class="flex justify-between border-b py-2">
                    <span>${item.name} x${item.quantity}</span>
                    <span>R${(item.price * item.quantity).toFixed(2)}</span>
                </div>`;
    }).join('');

    if (totalDisplay) totalDisplay.textContent = `R${total.toFixed(2)}`;
    if (hiddenAmount) hiddenAmount.value = total.toFixed(2);
}

async function handleOzowPayment() {
    // 1. Get the price text and strip everything except numbers and the dot
    let totalText = document.getElementById('summary-total').textContent;
    let cleanAmount = totalText.replace(/[^0-9.]/g, ''); 
    let finalAmount = parseFloat(cleanAmount).toFixed(2); // Forces "1170.00" format

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:3000/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: finalAmount,
                transactionReference: "DKS-" + Date.now(), // Unique ID every time
                customerName: name
            })
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            // This pulls the specific error we logged in the terminal
            alert("Ozow Error: " + data.error);
        }
    } catch (err) {
        alert("Check your VS Code Terminal for the error message!");
    }
}