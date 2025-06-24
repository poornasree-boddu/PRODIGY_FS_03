const products = [
  {
    id: 1,
    name: "Apple",
    price: 50,
    image: "images/apple.jpg",
    description: "Fresh red apple",
    category: "Fruit"
  },
  {
    id: 2,
    name: "Banana",
    price: 30,
    image: "images/banana.jpg",
    description: "Ripe bananas",
    category: "Fruit"
  },
  {
    id: 3,
    name: "Tomato",
    price: 25,
    image: "images/tomato.jpg",
    description: "Juicy tomatoes",
    category: "Vegetable"
  }
];

let cart = {};
const productList = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const totalDisplay = document.getElementById("total");

function renderProducts(filteredProducts = products) {
  productList.innerHTML = "";
  filteredProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <br>
      <textarea placeholder="Write a review..."></textarea>
      <button onclick="submitReview('${product.name}')">Submit Review</button>
    `;
    productList.appendChild(div);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    cart[productId] = { ...product, quantity: 1 };
  }
  renderCart();
}

function removeFromCart(productId) {
  if (cart[productId]) {
    cart[productId].quantity -= 1;
    if (cart[productId].quantity === 0) {
      delete cart[productId];
    }
  }
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  for (const id in cart) {
    const item = cart[id];
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      ₹${item.price} x ${item.quantity} = ₹${subtotal}
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItems.appendChild(div);
  }

  totalDisplay.textContent = total;
}

function submitReview(productName) {
  alert(`✅ Thanks for reviewing ${productName}!`);
}

function sortProducts() {
  const sortBy = document.getElementById("sort").value;
  if (sortBy === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }
  filterProducts(); // Apply filters after sort
}

function filterProducts() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
  const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

  const filtered = selectedCategories.length === 0
    ? products
    : products.filter(p => selectedCategories.includes(p.category));

  renderProducts(filtered);
}

function placeOrder() {
  if (Object.keys(cart).length === 0) {
    alert("🛒 Your cart is empty.");
    return;
  }

  const trackingId = Math.floor(10000 + Math.random() * 90000); // 5-digit ID
  const orderDetails = {
    id: trackingId,
    items: cart,
    date: new Date().toLocaleString()
  };

  localStorage.setItem(`order_${trackingId}`, JSON.stringify(orderDetails));

  alert(`✅ Order placed! Your tracking ID is ${trackingId}`);
  cart = {}; // clear cart
  renderCart();
}

renderProducts();
