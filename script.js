// Product Database (Simulated)
const products = [
  {
    id: 1,
    name: "Ultra Slim Laptop",
    price: 1200,
    category: "Laptops",
    image: "https://placehold.co/600x400?text=Laptop",
    description: "High performance laptop with 16GB RAM and SSD."
  },
  {
    id: 2,
    name: "Pro Smart Phone",
    price: 800,
    category: "Phones",
    image: "https://placehold.co/600x400?text=Phone",
    description: "Latest 5G smartphone with OLED screen."
  },
  {
    id: 3,
    name: "Noise Cancelling Headphones",
    price: 250,
    category: "Audio",
    image: "https://placehold.co/600x400?text=Headphone",
    description: "Best in class sound quality and comfort."
  },
  {
    id: 4,
    name: "4K Monitor",
    price: 400,
    category: "Monitors",
    image: "https://placehold.co/600x400?text=Monitor",
    description: "Ultra HD display for creators and gamers."
  },
  {
    id: 5,
    name: "Smart Watch Series 5",
    price: 300,
    category: "Wearables",
    image: "https://placehold.co/600x400?text=Watch",
    description: "Track your health and fitness metrics."
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 150,
    category: "Accessories",
    image: "https://placehold.co/600x400?text=Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches."
  }
];

const STORAGE_KEYS = {
  cart: "eshop_cart",
  products: "eshop_products"
};

function getStoredProducts() {
  const saved = localStorage.getItem(STORAGE_KEYS.products);
  if (!saved) return [...products];
  try {
    const parsed = JSON.parse(saved);
    return [...products, ...parsed];
  } catch (e) {
    console.error("Failed to parse saved products", e);
    return [...products];
  }
}

function setStoredProducts(newOnes) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(newOnes));
}

function getCart() {
  const saved = localStorage.getItem(STORAGE_KEYS.cart);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse cart", e);
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = getCart().length;
  }
}

function addToCart(id) {
  const cart = getCart();
  cart.push(Number(id));
  setCart(cart);
  alert("Added to cart!");
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const allProducts = getStoredProducts();
  grid.innerHTML = allProducts
    .map(
      (p) => `
      <article class="card">
        <img src="${p.image}" alt="${p.name}">
        <div class="pill">${p.category}</div>
        <h3>${p.name}</h3>
        <p class="muted">${p.description}</p>
        <div class="price">$${p.price}</div>
        <div class="card-actions">
          <a class="btn secondary" href="product.html?id=${p.id}">View Details</a>
          <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderProductDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const allProducts = getStoredProducts();
  const product = allProducts.find((p) => p.id == id);
  if (!product) {
    container.innerHTML = `<div class="empty">Product not found.</div>`;
    return;
  }
  container.innerHTML = `
    <div class="detail-card">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="detail-card">
      <p class="pill">${product.category}</p>
      <h2 style="margin: 10px 0;">${product.name}</h2>
      <div class="price" style="font-size: 1.4rem;">$${product.price}</div>
      <p class="muted" style="margin: 12px 0 20px;">${product.description}</p>
      <div class="card-actions">
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        <a class="btn secondary" href="cart.html">Go to Cart</a>
      </div>
    </div>
  `;
}

function renderCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;
  const cart = getCart();
  const allProducts = getStoredProducts();
  if (!cart.length) {
    container.innerHTML = `<div class="empty">Your cart is empty. <a href="index.html">Browse products</a>.</div>`;
    return;
  }
  const items = cart.map((id) => allProducts.find((p) => p.id == id)).filter(Boolean);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.category}</td>
              <td>$${item.price}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table>
    <div class="detail-card" style="margin-top: 16px;">
      <div class="flex-between">
        <strong>Total</strong>
        <strong>$${total}</strong>
      </div>
      <button class="btn" style="margin-top: 12px; width: 100%;" onclick="checkout()">Checkout</button>
    </div>
  `;
}

function checkout() {
  localStorage.removeItem(STORAGE_KEYS.cart);
  alert("Order Placed Successfully!");
  renderCart();
  updateCartCount();
}

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  if (email === "admin@shop.com" && pass === "123") {
    window.location.href = "admin.html";
  } else {
    alert("Invalid credentials");
  }
}

function addNewProduct() {
  const name = document.getElementById("new-name").value.trim();
  const price = Number(document.getElementById("new-price").value);
  const category = document.getElementById("new-category").value.trim() || "Misc";
  const image = document.getElementById("new-image").value.trim() || "https://placehold.co/600x400?text=New";
  const description = document.getElementById("new-description").value.trim() || "New product";
  if (!name || !price) {
    alert("Please provide a name and price.");
    return;
  }
  const saved = localStorage.getItem(STORAGE_KEYS.products);
  let savedProducts = [];
  if (saved) {
    try {
      savedProducts = JSON.parse(saved);
    } catch (e) {
      savedProducts = [];
    }
  }
  const newProduct = {
    id: Date.now(),
    name,
    price,
    category,
    image,
    description
  };
  savedProducts.push(newProduct);
  setStoredProducts(savedProducts);
  renderProducts();
  renderAdminList();
  alert("Product added!");
  document.getElementById("new-name").value = "";
  document.getElementById("new-price").value = "";
  document.getElementById("new-category").value = "";
  document.getElementById("new-image").value = "";
  document.getElementById("new-description").value = "";
}

function renderAdminList() {
  const container = document.getElementById("admin-product-list");
  if (!container) return;
  const allProducts = getStoredProducts();
  container.innerHTML = allProducts
    .map(
      (p) => `
      <article class="card">
        <img src="${p.image}" alt="${p.name}">
        <div class="pill">${p.category}</div>
        <h4>${p.name}</h4>
        <div class="price">$${p.price}</div>
      </article>
    `
    )
    .join("");
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initPage() {
  updateCartCount();
  renderProducts();
  renderProductDetail();
  renderCart();
  renderAdminList();
  initYear();
}

document.addEventListener("DOMContentLoaded", initPage);
