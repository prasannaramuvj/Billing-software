
// Default initial data to seed LocalStorage
const defaultData = {
    products: [
        { _id: "1", name: "Product A", price: 100, stock: 50 },
        { _id: "2", name: "Product B", price: 200, stock: 30 },
        { _id: "3", name: "Product C", price: 150, stock: 20 },
    ],
    customers: [
        { _id: "1", name: "John Doe", email: "john@example.com", phone: "1234567890" },
        { _id: "2", name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
    ],
    invoices: [],
    users: [
        { _id: "1", name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" }
    ]
};

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get collection from LocalStorage
const getCollection = (collectionName) => {
    const data = localStorage.getItem("billing_app_data");
    let parsedData = data ? JSON.parse(data) : {};

    // Seed if empty or missing collection
    if (!parsedData[collectionName]) {
        parsedData = { ...defaultData, ...parsedData };
        // Ensure the requested collection exists from default if available
        if (!parsedData[collectionName]) {
            parsedData[collectionName] = defaultData[collectionName] || [];
        }
        localStorage.setItem("billing_app_data", JSON.stringify(parsedData));
    }
    return parsedData[collectionName];
};

// Helper to save collection
const saveCollection = (collectionName, items) => {
    const data = localStorage.getItem("billing_app_data");
    const parsedData = data ? JSON.parse(data) : { ...defaultData };
    parsedData[collectionName] = items;
    localStorage.setItem("billing_app_data", JSON.stringify(parsedData));
};

export const mockApi = {
    // Auth
    loginUser: async ({ email, password }) => {
        await delay();
        // For simplicity, allow any login or check against users
        // specific hardcoded check for demo if users collection checks fail
        if (email === "test@example.com" && password === "123456") {
            return { name: "Test User", token: "mock-jwt-token-123" };
        }

        const users = getCollection("users");
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            return { name: user.name, token: "mock-jwt-token-" + user._id };
        } else {
            // Fallback for easy access if they don't know credentials
            if (password === 'admin') return { name: "Admin", token: 'admin-token' };

            throw new Error("Invalid credentials");
        }
    },

    // Generic Get
    fetch: async (collection) => {
        await delay();
        return getCollection(collection);
    },

    // Generic Get One
    fetchOne: async (collection, id) => {
        await delay();
        const items = getCollection(collection);
        const item = items.find(i => i._id === id);
        if (!item) throw new Error("Item not found");
        return item;
    },

    // Generic Create
    create: async (collection, data) => {
        await delay();
        const items = getCollection(collection);
        const newItem = { ...data, _id: Date.now().toString() };
        items.push(newItem);
        saveCollection(collection, items);
        return newItem;
    },

    // Generic Update
    update: async (collection, id, data) => {
        await delay();
        const items = getCollection(collection);
        const index = items.findIndex(i => i._id === id);
        if (index === -1) throw new Error("Item not found");

        items[index] = { ...items[index], ...data };
        saveCollection(collection, items);
        return items[index];
    },

    // Generic Delete
    delete: async (collection, id) => {
        await delay();
        let items = getCollection(collection);
        items = items.filter(i => i._id !== id);
        saveCollection(collection, items);
        return { success: true };
    },

    // Dashboard specialized
    getDashboardSummary: async () => {
        await delay();
        const products = getCollection("products");
        const customers = getCollection("customers");
        const invoices = getCollection("invoices");

        const totalSales = invoices.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
        const paidInvoices = invoices.filter(inv => inv.status === "PAID").length;
        const pendingInvoices = invoices.filter(inv => inv.status !== "PAID").length;

        return {
            totalProducts: products.length,
            totalCustomers: customers.length,
            totalInvoices: invoices.length,
            totalSales: totalSales,
            paidInvoices: paidInvoices,
            pendingInvoices: pendingInvoices
        };
    },

    getSalesChart: async () => {
        await delay();
        return [
            { _id: "Jan", total: 1000 },
            { _id: "Feb", total: 1500 },
            { _id: "Mar", total: 1200 },
            { _id: "Apr", total: 1800 },
            { _id: "May", total: 2000 },
            { _id: "Jun", total: 2400 },
        ];
    }
};
