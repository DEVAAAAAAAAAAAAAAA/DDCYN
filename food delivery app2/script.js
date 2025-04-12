const menuItems = [
  {
    id: 1,
    name: "Cheeseburger",
    price: 150,
    image: "images/burger.jpg"
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 200,
    image: "images/pizza.jpg"
  },
  {
    id: 3,
    name: "Creamy Pasta",
    price: 199,
    image: "images/pasta.jpg"
  },
  {
    id: 4,
    name: "Fresh Salad",
    price: 149,
    image: "images/salad.jpg"
  },
  {
    id: 5,
    name: "Crispy Fries",
    price: 99,
    image: "images/fries.jpg"
  },
  {
    id: 6,
    name: "Chocolate Milkshake",
    price: 120,
    image: "images/Chocolate Milkshake.jpg"
  },
  {
    id: 7,
    name: "Tandoori Chicken",
    price: 250,
    image: "images/Tandoori-Chicken.jpg"
  },
  {
    id: 8,
    name: "Paneer Wrap",
    price: 130,
    image: "images/paneer wrap.jpg"
  },
  {
    id: 9,
    name: "Veggie Sandwich",
    price: 110,
    image: "images/Veggie Sandwich.jpg"
  },
  {
    id: 10,
    name: "Strawberry Ice Cream",
    price: 90,
    image: "images/Strawberry Ice Cream.jpg"
  },
  {
    id: 11,
    name: "Cold Coffee",
    price: 100,
    image: "images/Cold Coffee.jpg"
  }
    ];

const cart = [];
const members = [];
const memberOrders = {};

function renderMenu(filterText = "") {
  const menuDiv = document.getElementById("menu-list");
  menuDiv.innerHTML = "";

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  filteredItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="food-img" />
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <button onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    menuDiv.appendChild(div);
  });
}


function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  cart.push(item);
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total");
  cartList.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    cartList.appendChild(li);
  });

  totalDisplay.textContent = `Total: ₹${total}`;
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Thank you for your order!");
  cart.length = 0;
  updateCart();
}

// ------------------ Group Order Features ------------------

function addMember() {
  const input = document.getElementById("member-name");
  const name = input.value.trim();

  if (name && !members.includes(name)) {
    members.push(name);
    memberOrders[name] = [];
    updateMemberList();
    input.value = "";
  } else {
    alert("Name is empty or already added!");
  }
}

function updateMemberList() {
  const list = document.getElementById("members-list");
  list.innerHTML = "";
  members.forEach(name => {
    const li = document.createElement("li");
    li.innerHTML = `${name} <button onclick="assignItemTo('${name}')">Assign Item</button>`;
    list.appendChild(li);
  });
}

function assignItemTo(name) {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const item = cart.pop(); // Assign the last item added
  memberOrders[name].push(item);
  updateCart(); // Refresh cart
  alert(`${item.name} assigned to ${name}`);
}

function splitBill() {
  const resultsDiv = document.getElementById("split-results");
  resultsDiv.innerHTML = "<h3>Split Summary:</h3>";

  if (members.length === 0) {
    resultsDiv.innerHTML += `
  <div id="pay-${idSafeName}" class="split-member">
    <p>👤 ${name}: ₹${formatted}</p>
    <button onclick="markPaid('${name}')" id="pay-btn-${idSafeName}">Pay</button>
    <span id="status-${idSafeName}" style="margin-left:10px;color:green;"></span>
  </div>
`;

    return;
  }

  let grandTotal = 0;

  members.forEach(name => {
    const total = memberOrders[name].reduce((sum, item) => sum + item.price, 0);
    grandTotal += total;
    const formatted = total.toLocaleString("en-IN");
    const idSafeName = name.replace(/\s+/g, '-');

    resultsDiv.innerHTML += `
      <div id="pay-${idSafeName}" class="split-member">
        <p>👤 ${name}: ₹${formatted}</p>
        <input type="checkbox" id="paid-${idSafeName}" onchange="markPaid('${name}')"/>
        <label for="paid-${idSafeName}">Mark as Paid</label>
        <span id="status-${idSafeName}" style="margin-left:10px;color:green;"></span>
      </div>
    `;
  });

  const formattedGrandTotal = grandTotal.toLocaleString("en-IN");
  resultsDiv.innerHTML += `<hr><p><strong>Total Group Bill: ₹${formattedGrandTotal}</strong></p>`;
}
function markPaid(name) {
  const idSafeName = name.replace(/\s+/g, '-');
  const status = document.getElementById(`status-${idSafeName}`);
  const payBtn = document.getElementById(`pay-btn-${idSafeName}`);

  status.textContent = "✅ Paid";
  payBtn.disabled = true;
  payBtn.textContent = "Paid";
  payBtn.style.backgroundColor = "#ccc";
}



  window.onload = () => {
    renderMenu();
  
    const input = document.getElementById("member-name");
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        addMember();
      }
    });
  
    const searchInput = document.getElementById("search-bar");
    searchInput.addEventListener("input", function (e) {
      renderMenu(e.target.value);
    });
  };
  



// Helper function to reset payment checkboxes
function resetPayments() {
  members.forEach(name => {
    const idSafeName = name.replace(/\s+/g, '-');
    const checkbox = document.getElementById(`paid-${idSafeName}`);
    const status = document.getElementById(`status-${idSafeName}`);
    if (checkbox) checkbox.checked = false;
    if (status) status.textContent = "";
  });
}

// Helper function to show unpaid members
function showUnpaidMembers() {
  const unpaid = members.filter(name => {
    const idSafe = name.replace(/\s+/g, '-');
    const checkbox = document.getElementById(`paid-${idSafe}`);
    return checkbox && !checkbox.checked;
  });

  if (unpaid.length === 0) {
    alert("All members have paid ✅");
  } else {
    alert("Unpaid Members:\n" + unpaid.join('\n'));
  }
}


