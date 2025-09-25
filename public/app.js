let currentUser = null;
let token = localStorage.getItem('token');

// Check if user is logged in
if (token) {
    currentUser = JSON.parse(localStorage.getItem('user'));
    updateUI();
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            updateUI();
            closeModal('registerModal');
            alert('Registration successful!');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Registration failed');
    }
}

async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            token = data.token;
            updateUI();
            closeModal('loginModal');
            alert('Login successful!');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Login failed');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    token = null;
    updateUI();
    showProducts();
}

function updateUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (currentUser) {
        authButtons.innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button id="dashboardBtn" onclick="showDashboard()">Dashboard</button>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="openModal('loginModal')">Login</button>
            <button onclick="openModal('registerModal')">Register</button>
        `;
    }
}

async function showProducts() {
    document.getElementById('productsSection').style.display = 'grid';
    document.getElementById('dashboardSection').style.display = 'none';
    
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const productsHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.images[0] || 'https://via.placeholder.com/250'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <p>Seller: ${product.seller.name}</p>
                <button class="btn">Add to Cart</button>
            </div>
        `).join('');
        
        document.getElementById('productsSection').innerHTML = productsHTML;
    } catch (error) {
        document.getElementById('productsSection').innerHTML = '<p>Failed to load products</p>';
    }
}

async function showDashboard() {
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    if (currentUser.role === 'admin') {
        showAdminDashboard();
    } else if (currentUser.role === 'seller') {
        showSellerDashboard();
    } else {
        showCustomerDashboard();
    }
}

async function showAdminDashboard() {
    try {
        const response = await fetch('/api/admin/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await response.json();
        
        document.getElementById('dashboardContent').innerHTML = `
            <h3>Admin Dashboard</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1rem 0;">
                <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">
                    <h4>Total Users</h4>
                    <p style="font-size: 2rem; color: #ff6b35;">${stats.totalUsers}</p>
                </div>
                <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">
                    <h4>Total Products</h4>
                    <p style="font-size: 2rem; color: #ff6b35;">${stats.totalProducts}</p>
                </div>
                <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">
                    <h4>Total Orders</h4>
                    <p style="font-size: 2rem; color: #ff6b35;">${stats.totalOrders}</p>
                </div>
                <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">
                    <h4>Total Revenue</h4>
                    <p style="font-size: 2rem; color: #ff6b35;">$${stats.totalRevenue}</p>
                </div>
            </div>
            <div style="margin-top: 2rem;">
                <h4>Commission Settings</h4>
                <input type="number" id="commissionInput" placeholder="Commission %" style="padding: 8px; margin-right: 10px;">
                <button class="btn" onclick="updateCommission()">Update Commission</button>
            </div>
        `;
    } catch (error) {
        document.getElementById('dashboardContent').innerHTML = '<p>Failed to load dashboard</p>';
    }
}

function showSellerDashboard() {
    document.getElementById('dashboardContent').innerHTML = `
        <h3>Seller Dashboard</h3>
        <div style="margin: 1rem 0;">
            <h4>Add New Product</h4>
            <form onsubmit="addProduct(event)" style="max-width: 500px;">
                <div class="form-group">
                    <input type="text" id="productName" placeholder="Product Name" required>
                </div>
                <div class="form-group">
                    <textarea id="productDescription" placeholder="Description" rows="3" style="width: 100%; padding: 8px;"></textarea>
                </div>
                <div class="form-group">
                    <input type="number" id="productPrice" placeholder="Price" required>
                </div>
                <div class="form-group">
                    <input type="text" id="productCategory" placeholder="Category" required>
                </div>
                <div class="form-group">
                    <input type="number" id="productStock" placeholder="Stock Quantity" required>
                </div>
                <button type="submit" class="btn">Add Product</button>
            </form>
        </div>
    `;
}

function showCustomerDashboard() {
    document.getElementById('dashboardContent').innerHTML = `
        <h3>Customer Dashboard</h3>
        <p>View your orders, wishlist, and account settings here.</p>
        <button class="btn" onclick="loadMyOrders()">My Orders</button>
    `;
}

async function addProduct(event) {
    event.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        category: document.getElementById('productCategory').value,
        stock: document.getElementById('productStock').value,
        images: ['https://via.placeholder.com/250']
    };
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            alert('Product added successfully! Waiting for admin approval.');
            event.target.reset();
        } else {
            alert('Failed to add product');
        }
    } catch (error) {
        alert('Error adding product');
    }
}

async function updateCommission() {
    const percentage = document.getElementById('commissionInput').value;
    
    try {
        const response = await fetch('/api/admin/commission', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ percentage })
        });
        
        if (response.ok) {
            alert('Commission updated successfully!');
        } else {
            alert('Failed to update commission');
        }
    } catch (error) {
        alert('Error updating commission');
    }
}

// Load products on page load
showProducts();