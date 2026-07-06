class App {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check authentication
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    this.showAuthenticatedUI();
                } else {
                    this.showLoginUI();
                }
            } catch (error) {
                this.showLoginUI();
            }
        } else {
            this.showLoginUI();
        }

        // Set up navigation
        this.setupNavigation();
    }

    showLoginUI() {
        document.getElementById('login-form')?.classList.remove('hidden');
        document.getElementById('app-content')?.classList.add('hidden');
        document.getElementById('logout-btn')?.classList.add('hidden');
    }

    showAuthenticatedUI() {
        document.getElementById('login-form')?.classList.add('hidden');
        document.getElementById('app-content')?.classList.remove('hidden');
        document.getElementById('logout-btn')?.classList.remove('hidden');
        document.getElementById('user-name').textContent = this.currentUser?.username;
        
        // Load dashboard
        this.loadDashboard();
    }

    setupNavigation() {
        // Navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateTo(page);
            });
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.reload();
        });
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        
        // Show target page
        const target = document.getElementById(`page-${page}`);
        if (target) {
            target.classList.remove('hidden');
        }

        // Load page data
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'sales':
                this.loadSales();
                break;
        }
    }

    async loadDashboard() {
        try {
            const stats = await api.getSalesStats();
            const lowStock = await api.getProducts({ low_stock: true });
            
            // Update stats
            document.getElementById('total-sales').textContent = stats.reduce((sum, s) => sum + s.total_sales, 0) || 0;
            document.getElementById('total-revenue').textContent = `$${stats.reduce((sum, s) => sum + s.total_revenue, 0).toFixed(2) || '0.00'}`;
            document.getElementById('low-stock-count').textContent = lowStock.length || 0;
            
            // Show recent sales
            const recentSales = await api.getSales({ limit: 5 });
            // Render recent sales table...
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    async loadProducts() {
        try {
            const { products } = await api.getProducts();
            // Render products table
            const tbody = document.querySelector('#products-table tbody');
            tbody.innerHTML = products.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.stock_quantity}</td>
                    <td>${product.category || '-'}</td>
                    <td>
                        <button onclick="app.editProduct(${product.id})">Edit</button>
                        <button onclick="app.deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    async loadSales() {
        try {
            const sales = await api.getSales();
            // Render sales table
            const tbody = document.querySelector('#sales-table tbody');
            tbody.innerHTML = sales.map(sale => `
                <tr>
                    <td>#${sale.id}</td>
                    <td>${sale.username}</td>
                    <td>$${sale.total_amount.toFixed(2)}</td>
                    <td>${sale.payment_method}</td>
                    <td>${sale.item_count}</td>
                    <td>${new Date(sale.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading sales:', error);
        }
    }
}

// Initialize app
const app = new App();
window.app = app;
