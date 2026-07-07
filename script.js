// Mock Product Database Objects Array
const PRODUCTS = [
    { id: 101, title: "Wireless Headphones", price: 2499.00, icon: "fa-headphones" },
    { id: 102, title: "Smart Fitness Watch", price: 3999.00, icon: "fa-stopwatch" },
    { id: 103, title: "Mechanical Keyboard", price: 4500.00, icon: "fa-keyboard" },
    { id: 104, title: "Ergonomic Gaming Mouse", price: 1250.00, icon: "fa-mouse" },
    { id: 105, title: "Portable Bluetooth Speaker", price: 1899.00, icon: "fa-volume-high" },
    { id: 106, title: "USB-C Fast Charger Dock", price: 999.00, icon: "fa-bolt" }
];

// App Memory State Tracking
let cartState = [];

// Element Selectors References
const productsGrid = document.getElementById('products-grid-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartIconBtn = document.getElementById('cart-icon-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartBadge = document.getElementById('cart-badge');
const checkoutActionBtn = document.getElementById('checkout-action-btn');

// App Initialization Lifecycles
document.addEventListener('DOMContentLoaded', () => {
    initProductCatalog();
    initDOMEvents();
});

// Render Catalog Grid Items Automatically 
function initProductCatalog() {
    productsGrid.innerHTML = PRODUCTS.map(prod => `
        <div class="product-card">
            <div class="product-image-box">
                <i class="fa-solid ${prod.icon}"></i>
            </div>
            <h3 class="product-title">${prod.title}</h3>
            <div class="product-price">₹${prod.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${prod.id})">Add To Cart</button>
        </div>
    `).join('');
}

// Attach Open/Close Event Handlers
function initDOMEvents() {
    cartIconBtn.addEventListener('click', openCartDrawer);
    closeCartBtn.addEventListener('click', closeCartDrawer);
    sidebarOverlay.addEventListener('click', closeCartDrawer);
    
    checkoutActionBtn.addEventListener('click', () => {
        if (cartState.length === 0) {
            alert("Your cart is empty! Add products before checking out.");
            return;
        }
        alert("Thank you for your order! This application is in UI sandbox mode.");
        cartState = [];
        syncCartStateToUI();
        closeCartDrawer();
    });
}

function openCartDrawer() {
    cartSidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
}

function closeCartDrawer() {
    cartSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
}

// Add Item Event Flow Logic
function handleAddToCart(productId) {
    const targetProduct = PRODUCTS.find(p => p.id === productId);
    const existingInCart = cartState.find(item => item.id === productId);

    if (existingInCart) {
        existingInCart.quantity += 1;
    } else {
        cartState.push({
            ...targetProduct,
            quantity: 1
        });
    }

    syncCartStateToUI();
    openCartDrawer(); // Interactive feedback loop
}

// Change Quantity Counter Core Logic
function updateItemQuantity(id, step) {
    const cartItem = cartState.find(item => item.id === id);
    if (!cartItem) return;

    cartItem.quantity += step;

    // Delete item if counter value drops below 1
    if (cartItem.quantity <= 0) {
        removeItemFromCart(id);
        return;
    }

    syncCartStateToUI();
}

function removeItemFromCart(id) {
    cartState = cartState.filter(item => item.id !== id);
    syncCartStateToUI();
}

// Component State Synced Engine
function syncCartStateToUI() {
    // 1. Calculate Badge Count
    const totalItemsCount = cartState.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItemsCount;

    // 2. Calculate Final Cart Price Values
    const overallPriceSum = cartState.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `₹${overallPriceSum.toFixed(2)}`;

    // 3. Render Cart Content Inside Modal
    if (cartState.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is currently empty.</p>`;
        return;
    }

    cartItemsContainer.innerHTML = cartState.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateItemQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateItemQuantity(${item.id}, 1)">+</button>
            </div>
            <i class="fa-solid fa-trash-can delete-item-btn" onclick="removeItemFromCart(${item.id})"></i>
        </div>
    `).join('');
}