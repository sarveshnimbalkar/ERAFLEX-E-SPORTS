// --- REAL WORLD KIT DATA WITH PROPER IMAGES ---
const products = [];

async function populate() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();

        data.footballTeams.forEach((t, i) => products.push({ 
            id: `F${i}`, 
            category: 'Football', 
            name: `${t.name} Home Kit 24/25`, 
            price: 1999 + (i*10), 
            img: t.img 
        }));
        data.cricketTeams.forEach((t, i) => products.push({ 
            id: `C${i}`, 
            category: 'Cricket', 
            name: `${t.name} Official Jersey`, 
            price: 2499 + (i*5), 
            img: t.img 
        }));
        data.basketballTeams.forEach((t, i) => products.push({ 
            id: `B${i}`, 
            category: 'Basketball', 
            name: `${t.name} Swingman Edition`, 
            price: 3499 + (i*20), 
            img: t.img 
        }));
    } catch (e) {
        console.error('Error loading products:', e);
    }
}

let cart = [];
let currentPaymentMethod = 'upi';
let allOrders = [];

// --- FORM VALIDATION FUNCTIONS ---
function showError(inputId, show) {
    const errorEl = document.getElementById(inputId + '-error');
    const inputEl = document.getElementById(inputId);
    if (errorEl) {
        errorEl.style.display = show ? 'block' : 'none';
        if (inputEl) {
            if (show) {
                inputEl.classList.add('input-error');
                inputEl.classList.remove('input-success');
            } else {
                inputEl.classList.remove('input-error');
                inputEl.classList.add('input-success');
            }
        }
    }
}

function validateEmail(id) {
    const email = document.getElementById(id).value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    showError(id, !isValid && email !== '');
    return isValid;
}

function validatePassword(id) {
    const pass = document.getElementById(id).value;
    const isValid = pass.length >= 6;
    showError(id, !isValid && pass !== '');
    return isValid;
}

function validateConfirmPassword(passId, confirmId) {
    const pass = document.getElementById(passId).value;
    const confirm = document.getElementById(confirmId).value;
    const isValid = pass === confirm && confirm !== '';
    showError(confirmId, !isValid && confirm !== '');
    return isValid;
}

function validateName(id) {
    const name = document.getElementById(id).value;
    const isValid = name.length >= 2;
    showError(id, !isValid && name !== '');
    return isValid;
}

function validatePhone(id) {
    const phone = document.getElementById(id).value;
    const regex = /^[0-9]{10}$/;
    const isValid = regex.test(phone);
    showError(id, !isValid && phone !== '');
    return isValid;
}

function validatePincode(id) {
    const pincode = document.getElementById(id).value;
    const regex = /^[0-9]{6}$/;
    const isValid = regex.test(pincode);
    showError(id, !isValid && pincode !== '');
    return isValid;
}

function validateRequired(id) {
    const value = document.getElementById(id).value;
    const isValid = value.trim() !== '';
    showError(id, !isValid);
    return isValid;
}

function validateSelect(id) {
    const value = document.getElementById(id).value;
    const isValid = value !== '';
    showError(id, !isValid);
    return isValid;
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    input.value = value;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function validateCVV(input) {
    input.value = input.value.replace(/\D/g, '');
}

// --- AUTHENTICATION ---
auth.onAuthStateChanged(user => {
    const profile = document.getElementById('userProfile');
    const authIcon = document.getElementById('authIcon');
    if(user) {
        profile.classList.replace('hidden', 'flex');
        authIcon.classList.add('hidden');
        document.getElementById('userEmail').innerText = user.email.split('@')[0].toUpperCase();
        document.getElementById('userInitial').innerText = user.email[0].toUpperCase();
    } else {
        profile.classList.replace('flex', 'hidden');
        authIcon.classList.remove('hidden');
    }
});

async function handleAuth(mode) {
    let isValid = true;
    
    if (mode === 'login') {
        isValid = validateEmail('email') && validatePassword('pass');
        if (!isValid) return;
        
        const email = document.getElementById('email').value;
        const pass = document.getElementById('pass').value;
        try {
            await auth.signInWithEmailAndPassword(email, pass);
            showNotification('Access Granted. Welcome back!', 'success');
            showPage('home');
        } catch (e) { 
            showNotification(e.message, 'error');
        }
    } else {
        isValid = validateName('regName') && validateEmail('regEmail') && 
                 validatePassword('regPass') && validateConfirmPassword('regPass', 'regConfirmPass');
        if (!isValid) return;
        
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;
        try {
            await auth.createUserWithEmailAndPassword(email, pass);
            showNotification('Operator Enrolled. Welcome to ERAFLEX!', 'success');
            showPage('home');
        } catch (e) { 
            showNotification(e.message, 'error');
        }
    }
}

function handleSignOut() {
    auth.signOut().then(() => {
        cart = []; updateCart();
        showNotification('Session Terminated.', 'info');
        location.reload();
    });
}

// --- UI LOGIC ---
function showPage(id) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${id}`).classList.add('active');
    if(id === 'shop') renderShop('all');
    if(id === 'admin') loadAdminData();
    window.scrollTo(0,0);
}

function setAuthMode(m) {
    document.getElementById('formLogin').classList.toggle('hidden', m !== 'login');
    document.getElementById('formReg').classList.toggle('hidden', m === 'login');
    document.getElementById('tabLogin').classList.toggle('border-brand-accent', m === 'login');
    document.getElementById('tabLogin').classList.toggle('text-white', m === 'login');
    document.getElementById('tabLogin').classList.toggle('text-gray-500', m !== 'login');
    document.getElementById('tabReg').classList.toggle('border-brand-accent', m !== 'login');
    document.getElementById('tabReg').classList.toggle('text-white', m !== 'login');
    document.getElementById('tabReg').classList.toggle('text-gray-500', m === 'login');
}

function renderShop(cat) {
    const grid = document.getElementById('shopGrid');
    const items = cat === 'all' ? products : products.filter(p => p.category === cat);
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.category === cat) {
            btn.classList.add('bg-brand-accent', 'text-black');
            btn.classList.remove('bg-brand-surface', 'text-white');
        } else {
            btn.classList.remove('bg-brand-accent', 'text-black');
            btn.classList.add('bg-brand-surface', 'text-white');
        }
    });
    
    grid.innerHTML = items.map(p => `
        <div class="p-4 rounded-2xl kit-card hover-trigger">
            <div class="relative overflow-hidden rounded-xl mb-4">
                <img src="${p.img}" class="w-full h-64 object-cover transition transform hover:scale-110" alt="${p.name}">
                <div class="absolute top-2 right-2 bg-brand-accent text-black text-xs font-bold px-2 py-1 rounded">
                    ${p.category}
                </div>
            </div>
            <p class="text-[10px] text-brand-accent font-black tracking-widest uppercase mb-1">${p.category}</p>
            <h3 class="font-bold text-sm mb-4 truncate">${p.name}</h3>
            <div class="flex justify-between items-center">
                <span class="text-xl font-display italic">₹${p.price.toLocaleString()}</span>
                <button onclick="addToCart('${p.id}')" class="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-accent hover:text-white transition flex items-center gap-2 hover-trigger">
                    <i class="fas fa-plus"></i> ADD
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCart();
    
    // Show notification
    showNotification(`${item.name} added to bag!`, 'success');
    
    // Open cart sidebar
    document.getElementById('cartSidebar').classList.remove('translate-x-full');
    
    // Create particle effect
    createParticleEffect();
}

function updateCart() {
    const list = document.getElementById('cartItems');
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cartCount').innerText = cart.length;
    document.getElementById('cartCount').classList.toggle('hidden', cart.length === 0);
    
    if (cart.length === 0) {
        list.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-shopping-bag text-4xl mb-4"></i>
                <p>Your bag is empty</p>
            </div>
        `;
    } else {
        list.innerHTML = cart.map((item, i) => `
            <div class="bg-black p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-brand-accent transition">
                <div class="flex items-center gap-4">
                    <img src="${item.img}" class="w-16 h-16 object-cover rounded-lg">
                    <div>
                        <p class="text-xs font-bold text-brand-accent">${item.category}</p>
                        <p class="text-sm font-bold">${item.name}</p>
                        <p class="text-brand-accent text-sm">₹${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <button onclick="removeItem(${i})" class="text-gray-500 hover:text-brand-accent transition hover-trigger p-2">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    document.getElementById('cartTotal').innerText = `₹${total.toLocaleString()}`;
    document.getElementById('subtotal').innerText = `₹${total.toLocaleString()}`;
    document.getElementById('checkout-total').innerText = `₹${total.toLocaleString()}`;
    document.getElementById('payAmount').innerText = `₹${total.toLocaleString()}`;
    document.getElementById('upiQR').src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=eraflex@okaxis&am=${total}&tn=ERAFLEX Order`;
}

function removeItem(i) { 
    cart.splice(i, 1); 
    updateCart(); 
}

function toggleCart() { 
    document.getElementById('cartSidebar').classList.toggle('translate-x-full'); 
}

function startCheckout() { 
    if(cart.length > 0) { 
        toggleCart(); 
        showPage('checkout'); 
    } else { 
        showNotification('Your bag is empty!', 'error');
    } 
}

function selectPayment(method) {
    currentPaymentMethod = method;
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    document.querySelectorAll('.payment-details').forEach(el => el.classList.add('hidden'));
    document.getElementById(method + '-section').classList.remove('hidden');
}

async function completeOrder() {
    // Validate shipping details
    const isValid = validateName('ship-name') && validatePhone('ship-phone') && 
                  validateRequired('ship-addr') && validateRequired('ship-city') && 
                  validatePincode('ship-pincode') && validateSelect('ship-state');
    
    if (!isValid) {
        showNotification('Please fill all shipping details correctly', 'error');
        return;
    }

    // Validate payment based on method
    if (currentPaymentMethod === 'card') {
        const cardValid = document.getElementById('card-number').value.length >= 19 &&
                        document.getElementById('card-expiry').value.length === 5 &&
                        document.getElementById('card-cvv').value.length === 3 &&
                        document.getElementById('card-name').value !== '';
        if (!cardValid) {
            showNotification('Please enter valid card details', 'error');
            return;
        }
    }

    const user = auth.currentUser;
    if(!user) {
        showNotification('Please login to complete order', 'error');
        showPage('auth');
        return;
    }

    const orderTotal = cart.reduce((s, i) => s + i.price, 0);
    const order = {
        uid: user.uid,
        email: user.email,
        items: cart.map(i => ({ name: i.name, price: i.price, id: i.id })),
        total: orderTotal,
        shipping: {
            name: document.getElementById('ship-name').value,
            phone: document.getElementById('ship-phone').value,
            address: document.getElementById('ship-addr').value,
            city: document.getElementById('ship-city').value,
            pincode: document.getElementById('ship-pincode').value,
            state: document.getElementById('ship-state').value
        },
        paymentMethod: currentPaymentMethod,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const docRef = await db.collection('orders').add(order);
        
        // Show success modal
        document.getElementById('order-id').innerText = '#ERX' + docRef.id.substring(0, 8).toUpperCase();
        document.getElementById('success-modal').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('success-content').classList.remove('scale-0');
            document.getElementById('success-content').classList.add('scale-100');
        }, 100);
        
        cart = []; 
        updateCart();
    } catch (e) {
        showNotification('Error placing order: ' + e.message, 'error');
    }
}

function closeSuccessModal() {
    document.getElementById('success-content').classList.remove('scale-100');
    document.getElementById('success-content').classList.add('scale-0');
    setTimeout(() => {
        document.getElementById('success-modal').classList.add('hidden');
        showPage('home');
    }, 300);
}

// --- ADMIN FUNCTIONS ---
async function loadAdminData() {
    try {
        const ordersSnapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
        allOrders = [];
        ordersSnapshot.forEach(doc => {
            allOrders.push({ id: doc.id, ...doc.data() });
        });
        renderOrders(allOrders);
        updateStats(allOrders);
    } catch (e) {
        console.error('Error loading orders:', e);
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-12 text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No orders found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const date = order.timestamp ? new Date(order.timestamp.toDate()).toLocaleDateString() : 'N/A';
        const items = order.items.map(i => i.name).join(', ');
        const shortItems = items.length > 50 ? items.substring(0, 50) + '...' : items;
        
        return `
            <tr class="order-row border-b border-white/5">
                <td class="p-4 font-mono text-brand-accent">#${order.id.substring(0, 8).toUpperCase()}</td>
                <td class="p-4">
                    <div class="font-bold">${order.shipping?.name || 'N/A'}</div>
                    <div class="text-sm text-gray-400">${order.email}</div>
                </td>
                <td class="p-4 text-sm text-gray-300" title="${items}">${shortItems}</td>
                <td class="p-4 font-bold">₹${order.total?.toLocaleString() || 0}</td>
                <td class="p-4 text-sm text-gray-400">${date}</td>
                <td class="p-4">
                    <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-badge status-${order.status} bg-transparent border-0 cursor-pointer hover-trigger">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td class="p-4">
                    <button onclick="viewOrderDetails('${order.id}')" class="text-brand-accent hover:text-white transition hover-trigger mr-3">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteOrder('${order.id}')" class="text-red-500 hover:text-red-400 transition hover-trigger">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStats(orders) {
    const total = orders.length;
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    document.getElementById('totalOrders').innerText = total;
    document.getElementById('totalRevenue').innerText = '₹' + revenue.toLocaleString();
    document.getElementById('pendingOrders').innerText = pending;
    document.getElementById('deliveredOrders').innerText = delivered;
}

function filterOrders() {
    const status = document.getElementById('statusFilter').value;
    if (status === 'all') {
        renderOrders(allOrders);
    } else {
        const filtered = allOrders.filter(o => o.status === status);
        renderOrders(filtered);
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await db.collection('orders').doc(orderId).update({ status: newStatus });
        showNotification('Order status updated!', 'success');
        loadAdminData();
    } catch (e) {
        showNotification('Error updating status: ' + e.message, 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
        await db.collection('orders').doc(orderId).delete();
        showNotification('Order deleted!', 'success');
        loadAdminData();
    } catch (e) {
        showNotification('Error deleting order: ' + e.message, 'error');
    }
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const details = `
        Order ID: #${order.id.substring(0, 8).toUpperCase()}
        Customer: ${order.shipping?.name}
        Email: ${order.email}
        Phone: ${order.shipping?.phone}
        Address: ${order.shipping?.address}, ${order.shipping?.city}, ${order.shipping?.state} - ${order.shipping?.pincode}
        Items: ${order.items.map(i => i.name).join(', ')}
        Total: ₹${order.total?.toLocaleString()}
        Payment: ${order.paymentMethod?.toUpperCase()}
        Status: ${order.status?.toUpperCase()}
    `;
    alert(details);
}

function refreshOrders() {
    loadAdminData();
    showNotification('Orders refreshed!', 'success');
}

function exportOrders() {
    const csv = allOrders.map(o => ({
        'Order ID': o.id,
        'Customer': o.shipping?.name,
        'Email': o.email,
        'Items': o.items.map(i => i.name).join('; '),
        'Total': o.total,
        'Status': o.status,
        'Date': o.timestamp ? new Date(o.timestamp.toDate()).toISOString() : ''
    }));
    
    const headers = Object.keys(csv[0] || {});
    const csvContent = [
        headers.join(','),
        ...csv.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eraflex_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showNotification('Orders exported!', 'success');
}

// --- CHATBOT FUNCTIONS ---
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

function handleChatKeypress(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Generate response
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
}

function addMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerText = text;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function generateBotResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    const responses = {
        'hello': 'Hello! Welcome to ERAFLEX! How can I assist you with your sports gear needs today?',
        'hi': 'Hi there! 👋 Ready to find your perfect kit?',
        'help': 'I can help you with:\n• Tracking orders\n• Product information\n• Size guides\n• Shipping details\n• Returns & exchanges\n• Payment options\n\nWhat would you like to know?',
        'order': 'To track your order, please provide your order ID (starts with #ERX). You can also check your email for tracking details!',
        'track': 'I can help you track your order! Please share your order ID starting with #ERX, or check your confirmation email for tracking links.',
        'shipping': 'We offer free shipping on orders above ₹999! Standard delivery takes 3-5 business days. Express shipping (1-2 days) available for ₹149.',
        'delivery': 'Standard delivery: 3-5 business days\nExpress delivery: 1-2 business days (₹149)\nFree shipping on orders above ₹999!',
        'return': 'We offer 30-day hassle-free returns! Items must be unused with original tags. Contact our support team to initiate a return.',
        'exchange': 'Exchanges are easy! Within 30 days, unused items with tags can be exchanged for a different size. Start the process from your order history.',
        'size': 'Our kits follow standard sizing:\n• S: Chest 36-38"\n• M: Chest 38-40"\n• L: Chest 40-42"\n• XL: Chest 42-44"\n• XXL: Chest 44-46"\n\nNeed help with a specific product?',
        'payment': 'We accept:\n• UPI (Google Pay, PhonePe, Paytm)\n• Credit/Debit Cards\n• Net Banking\n• Cash on Delivery (₹50 extra)\n\nAll transactions are secure and encrypted!',
        'discount': 'Currently running:\n• FLAT20: 20% off on orders above ₹2999\n• WELCOME10: 10% off for new users\n• Check our homepage for flash sales!',
        'contact': 'You can reach us at:\n📧 support@eraflex.com\n📞 1800-123-4567 (Toll-free)\n💬 WhatsApp: +91 98765 43210\n\nAvailable 9 AM - 9 PM, 7 days a week!',
        'price': 'Our kits range from ₹1,999 to ₹4,999 depending on the team and edition. Premium collections may be priced higher. Check our shop for current prices!',
        'quality': 'All ERAFLEX products are made with premium moisture-wicking fabric, official team logos, and authentic designs. We guarantee 100% genuine merchandise!',
        'authentic': 'Absolutely! We are official partners with major sports leagues. Every product comes with authenticity certificates and holograms.',
        'cancel': 'Orders can be cancelled within 2 hours of placement. After that, please contact our customer care team for assistance.',
        'refund': 'Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method.',
        'offer': 'Current offers:\n🏷️ Buy 2 Get 10% Off\n🏷️ Buy 3 Get 20% Off\n🏷️ Free shipping above ₹999\n🏷️ New user: Extra 10% off\n\nCheck the banner on our homepage for more!',
        'stock': 'Most popular items are in stock! If an item shows "Add to Cart", it\'s available. Sold out items can be pre-ordered with 2-week delivery.',
        'custom': 'Yes! We offer custom name and number printing for ₹299 extra. Add your customization during checkout!',
        'wholesale': 'For bulk orders (10+ pieces), contact our B2B team at wholesale@eraflex.com for special pricing and corporate discounts.',
        'store': 'We currently operate online only. Our flagship store in Mumbai is opening soon! Stay tuned for updates.',
        'gift': 'Gift cards are available! Choose from ₹500, ₹1000, ₹2000, or ₹5000 denominations. They never expire and can be used on any product.',
        'warranty': 'All products come with a 6-month quality warranty against manufacturing defects. Does not cover wear and tear from regular use.'
    };

    // Check for keywords
    for (let key in responses) {
        if (lowerMsg.includes(key)) {
            return responses[key];
        }
    }

    // Default responses
    const defaults = [
        "I'm not sure I understood that. Could you rephrase? Or type 'help' to see what I can assist with!",
        "Interesting question! For detailed assistance, please contact our support team at support@eraflex.com or call 1800-123-4567.",
        "I'd love to help with that! Could you provide more details? You can also browse our FAQ section for quick answers.",
        "Thanks for reaching out! For immediate assistance, try our quick commands:\n• 'track order' for order status\n• 'shipping' for delivery info\n• 'return' for exchange policy",
        "I'm still learning! For complex queries, our human support team is available at support@eraflex.com 😊"
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-6 z-[200] px-6 py-4 rounded-xl font-bold transform translate-x-full transition-transform duration-300 flex items-center gap-3`;
    
    if (type === 'success') {
        notification.classList.add('bg-brand-accent', 'text-white');
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else if (type === 'error') {
        notification.classList.add('bg-red-600', 'text-white');
        notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    } else {
        notification.classList.add('bg-gray-700', 'text-white');
        notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function createParticleEffect() {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.background = ['#ff0033', '#ffcc00', '#ffffff'][Math.floor(Math.random() * 3)];
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: `translateY(-${Math.random() * 300 + 100}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        animation.onfinish = () => particle.remove();
    }
}

// --- CUSTOM CURSOR LOGIC ---
document.addEventListener('mousemove', e => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    
    dot.style.left = e.clientX - 6 + 'px';
    dot.style.top = e.clientY - 6 + 'px';
    
    // Smooth follow for ring
    setTimeout(() => {
        ring.style.left = (e.clientX - 20) + 'px';
        ring.style.top = (e.clientY - 20) + 'px';
    }, 50);
});

// Add hover effect to interactive elements
document.addEventListener('mouseover', e => {
    if (e.target.closest('.hover-trigger') || e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'INPUT') {
        document.getElementById('cursor-ring').classList.add('hover');
    }
});

document.addEventListener('mouseout', e => {
    document.getElementById('cursor-ring').classList.remove('hover');
});

// Initialize
window.onload = async () => {
    await populate();
    showPage('home');
    
    // Add sporty background animation
    setInterval(() => {
        if (Math.random() > 0.7) createParticleEffect();
    }, 5000);
};

// ================= FILTER & SORT LOGIC =================
let filteredProducts = [];

function applyFilters() {
    const name = document.getElementById("filterName").value.toLowerCase();
    const category = document.getElementById("filterCategory").value;
    const brand = document.getElementById("filterBrand").value.toLowerCase();
    const price = parseFloat(document.getElementById("filterPrice").value);
    const rating = parseFloat(document.getElementById("filterRating").value);

    filteredProducts = products.filter(p => {
        return (
            (name === "" || p.name.toLowerCase().includes(name)) &&
            (category === "all" || p.category === category) &&
            (brand === "" || (p.brand && p.brand.toLowerCase().includes(brand))) &&
            (isNaN(price) || p.price <= price) &&
            (rating === 0 || (p.rating && p.rating >= rating))
        );
    });

    renderFilteredProducts();
}

function renderFilteredProducts() {
    const grid = document.getElementById("shopGrid");
    const list = filteredProducts.length ? filteredProducts : products;

    grid.innerHTML = list.map(p => `
        <div class="kit-card p-4 rounded-2xl">
            <img src="${p.img}" class="w-full h-60 object-cover rounded-xl mb-4">
            <p class="text-xs text-brand-accent font-bold">${p.category}</p>
            <h3 class="font-bold text-lg">${p.name}</h3>
            <p class="text-sm text-gray-400">${p.brand || ""}</p>
            <p class="text-brand-accent font-bold text-lg">₹${p.price.toLocaleString()}</p>
            <button onclick="addToCart('${p.id}')"
                class="w-full bg-brand-accent mt-3 py-2 font-bold rounded-xl">
                ADD TO CART
            </button>
        </div>
    `).join("");
}

function sortPriceLowHigh() {
    filteredProducts = (filteredProducts.length ? filteredProducts : products)
        .slice()
        .sort((a, b) => a.price - b.price);
    renderFilteredProducts();
}

function sortRatingHighLow() {
    filteredProducts = (filteredProducts.length ? filteredProducts : products)
        .slice()
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    renderFilteredProducts();
}

function resetFilters() {
    document.getElementById("filterName").value = "";
    document.getElementById("filterCategory").value = "all";
    document.getElementById("filterBrand").value = "";
    document.getElementById("filterPrice").value = "";
    document.getElementById("filterRating").value = "0";

    filteredProducts = [];
    renderFilteredProducts();
}
// ================= END FILTER LOGIC =================
