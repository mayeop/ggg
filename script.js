
// ========================================
// THREAD & CO. - JAVASCRIPT
// ========================================

// PRODUCT DATABASE (SAMPLE DATA)

const products = [
  {
    id: 1,
    name: "Classic White Shirt",
    category: "Men",
    price: 899,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"
  },
  {
    id: 2,
    name: "Elegant Summer Dress",
    category: "Women",
    price: 1299,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600"
  },
  {
    id: 3,
    name: "Casual Denim Jacket",
    category: "Men",
    price: 1599,
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600"
  },
  {
    id: 4,
    name: "Minimalist Handbag",
    category: "Accessories",
    price: 1099,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
  },
  {
    id: 5,
    name: "Casual Beige Outfit",
    category: "Women",
    price: 1499,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
  },
  {
    id: 6,
    name: "Classic Sneakers",
    category: "Accessories",
    price: 1899,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
  },
  {
    id: 7,
    name: "Everyday Casual Tee",
    category: "Men",
    price: 599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
  },
  {
    id: 8,
    name: "Modern Fashion Top",
    category: "Women",
    price: 799,
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600"
  }
];

// ========================================
// LOCAL STORAGE
// ========================================

function loadCart() {
  try {
    const saved = localStorage.getItem("threadCoCart");
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(item =>
      Number.isInteger(item.id) &&
      products.some(product => product.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    console.warn("Could not load cart:", error);
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  try {
    localStorage.setItem("threadCoCart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Cart could not be saved in this browser.");
  }
}

// ========================================
// PRODUCT DISPLAY
// ========================================

const productContainer =
  document.getElementById("productContainer");

const searchInput =
  document.getElementById("searchInput");

const categoryFilter =
  document.getElementById("categoryFilter");

const sortFilter =
  document.getElementById("sortFilter");

const resultCount =
  document.getElementById("resultCount");

function displayProducts(items) {
  productContainer.innerHTML = "";

  resultCount.textContent =
    `Showing ${items.length} product(s)`;

  if (items.length === 0) {
    productContainer.innerHTML = `
      <div class="col-12">
        <div class="no-products">
          <i class="bi bi-search fs-1"></i>
          <h4 class="mt-3">No products found</h4>
          <p>Try another search or category.</p>
        </div>
      </div>
    `;
    return;
  }

  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "col-6 col-md-4 col-lg-3";

    const article = document.createElement("article");
    article.className = "card product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.className = "product-image";
    img.loading = "lazy";
    img.onerror = () => {
      img.src = "https://placehold.co/600x750/f7f4ee/252525?text=Fashion";
    };

    imageWrap.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body px-0";

    const category = document.createElement("p");
    category.className = "product-category mb-1";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.className = "product-title";
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price mb-0";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "btn btn-dark add-cart-btn";
    button.type = "button";
    button.dataset.productId = product.id;
    button.textContent = "Add to Cart";

    body.append(category, name, price, button);
    article.append(imageWrap, body);
    card.appendChild(article);

    productContainer.appendChild(card);
  });
}

function formatPrice(price) {
  return "₱" + price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ========================================
// SEARCH, FILTER AND SORT
// ========================================

function filterProducts() {
  const searchTerm =
    searchInput.value.trim().toLowerCase();

  const selectedCategory = categoryFilter.value;
  const sortOption = sortFilter.value;

  let filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (sortOption === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
sortFilter.addEventListener("change", filterProducts);

// ========================================
// ADD TO CART
// ========================================

productContainer.addEventListener("click", event => {
  const button = event.target.closest("[data-product-id]");

  if (!button) return;

  const productId = Number(button.dataset.productId);

  addToCart(productId);
});

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  updateCart();

  const button = productContainer.querySelector(
    `[data-product-id="${productId}"]`
  );

  if (button) {
    const originalText = button.textContent;
    button.textContent = "Added ✓";
    button.disabled = true;

    // Restore button without using an external timer dependency
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 900);
  }
}

// ========================================
// UPDATE SHOPPING CART
// ========================================

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  cartCount.textContent = totalQuantity;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-4">
        <i class="bi bi-bag-x fs-1 text-muted"></i>
        <p class="mt-2">Your shopping bag is empty.</p>
      </div>
    `;

    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return;

    const subtotal = product.price * item.quantity;
    total += subtotal;

    const row = document.createElement("div");
    row.className = "cart-product";

    const details = document.createElement("div");

    const name = document.createElement("div");
    name.className = "cart-product-name";
    name.textContent = product.name;

    const quantity = document.createElement("small");
    quantity.className = "text-muted";
    quantity.textContent =
      `Qty: ${item.quantity} × ${formatPrice(product.price)}`;

    details.append(name, quantity);

    const actions = document.createElement("div");
    actions.className = "text-end";

    const price = document.createElement("div");
    price.className = "fw-bold";
    price.textContent = formatPrice(subtotal);

    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.textContent = "Remove";
    remove.type = "button";
    remove.dataset.removeId = item.id;
    remove.setAttribute("aria-label", `Remove ${product.name}`);

    actions.append(price, remove);
    row.append(details, actions);

    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatPrice(total);
}

// ========================================
// REMOVE FROM CART
// ========================================

document.getElementById("cartItems").addEventListener(
  "click", event => {
    const button = event.target.closest("[data-remove-id]");

    if (!button) return;

    const productId = Number(button.dataset.removeId);

    cart = cart.filter(item => item.id !== productId);

    saveCart();
    updateCart();
  }
);

// ========================================
// CHECKOUT DEMONSTRATION
// ========================================

document.getElementById("checkoutBtn").addEventListener(
  "click", () => {
    if (cart.length === 0) {
      alert("Your shopping bag is empty!");
      return;
    }

    alert(
      "Thank you for shopping with THREAD & CO.!\n\n" +
      "This is a frontend demonstration. No actual payment or order has been processed."
    );
  }
);

// ========================================
// CONTACT FORM VALIDATION
// ========================================

const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("customerName");
  const email = document.getElementById("customerEmail");
  const message = document.getElementById("customerMessage");

  // Check browser-native validation rules
  if (!contactForm.checkValidity()) {
    contactForm.classList.add("was-validated");

    formFeedback.textContent =
      "Please correct the highlighted fields.";

    formFeedback.className = "mt-3 text-danger";
    contactForm.querySelector(":invalid")?.focus();
    return;
  }

  // Successful frontend demonstration
  formFeedback.textContent =
    `Thank you, ${name.value.trim()}! Your message has been received in this demo.`;

  formFeedback.className = "mt-3 text-success fw-semibold";

  contactForm.reset();
  contactForm.classList.remove("was-validated");
});

// ========================================
// INITIALIZE APPLICATION
// ========================================

displayProducts(products);
updateCart();
