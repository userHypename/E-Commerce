const products = [
  { id: 1, name: "Headphones", price: 1000 },
  { id: 2, name: "Apple Watch", price: 1500 },
  { id: 3, name: "iPhone 13 Pro", price: 45000 },
  { id: 4, name: "MacBook", price: 55000 },
  { id: 5, name: "Notebook", price: 120 },
  { id: 6, name: "Ballpen", price: 20 },
];

let cart = [];

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  let product;

  if (existing) {
    existing.qty++;
    product = existing;
  } else {
    product = products.find((p) => p.id === id);
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
  showToast(product.name);
}
function showToast(productName) {
  const toastMessage = document.getElementById("toastMessage");
  toastMessage.textContent = `${productName} added to cart`;

  const toastElement = document.getElementById("cartToast");
  const toast = new bootstrap.Toast(toastElement);

  toast.show();
}

function renderCart() {
  const tbody = document.getElementById("cartTableBody");
  tbody.innerHTML = "";

  cart.forEach((item) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₱${item.price}</td>
        <td>
          <button onclick="updateQty(${item.id}, ${item.qty - 1})">-</button>
          ${item.qty}
          <button onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
        </td>
        <td>₱${item.price * item.qty}</td>
        <td>
          <button class="btn btn-danger btn-sm"
            onclick="removeItem(${item.id})">X</button>
        </td>
      </tr>
    `;
  });

  computeTotals();
}

function updateQty(id, qty) {
  if (qty <= 0) {
    removeItem(id);
    return;
  }
  const item = cart.find((p) => p.id === id);
  item.qty = qty;
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function computeTotals() {
  let subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let discount = subtotal >= 1000 ? subtotal * 0.1 : 0;
  let tax = (subtotal - discount) * 0.12;
  let shipping = subtotal >= 500 ? 0 : 80;
  let grandTotal = subtotal - discount + tax + shipping;

  document.getElementById("summary").innerHTML = `
    Subtotal: ₱${subtotal.toFixed(2)} <br>
    Discount: ₱${discount.toFixed(2)} <br>
    Tax (12%): ₱${tax.toFixed(2)} <br>
    Shipping: ₱${shipping.toFixed(2)} <br>
    <strong>Grand Total: ₱${grandTotal.toFixed(2)}</strong>
  `;
}

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const payment = document.getElementById("payment").value;
    const delivery = document.getElementById("delivery").value;
    const address = document.getElementById("address").value.trim();

    if (!name || !email || !payment || !delivery) {
      alert("Please fill all required fields.");
      return;
    }

    if (delivery === "Delivery" && !address) {
      alert("Address is required for delivery.");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    generateReceipt();
  });

function generateReceipt() {
  const orderId = "ORD-2026-" + Math.floor(Math.random() * 100000);
  const date = new Date().toLocaleString();

  let itemsHTML = "";

  cart.forEach((item) => {
    itemsHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₱${item.price}</td>
        <td>₱${item.price * item.qty}</td>
      </tr>
    `;
  });

  document.getElementById("receiptContent").innerHTML = `
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Date:</strong> ${date}</p>
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>${itemsHTML}</tbody>
    </table>
  `;

  const modal = new bootstrap.Modal(document.getElementById("receiptModal"));
  modal.show();
}
