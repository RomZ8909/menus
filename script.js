document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnMenu = document.getElementById('btn-menu');
  const btnShopping = document.getElementById('btn-shopping');
  const menuSection = document.getElementById('menu-planning');
  const shoppingSection = document.getElementById('shopping-list');

  // Toggle view function
  function showSection(section) {
    if (section === 'menu') {
      menuSection.hidden = false;
      shoppingSection.hidden = true;
      btnMenu.setAttribute('aria-selected', 'true');
      btnShopping.setAttribute('aria-selected', 'false');
    } else {
      menuSection.hidden = true;
      shoppingSection.hidden = false;
      btnMenu.setAttribute('aria-selected', 'false');
      btnShopping.setAttribute('aria-selected', 'true');
    }
  }

  // Initial view
  showSection('menu');

  // Event listeners for nav buttons
  btnMenu.addEventListener('click', () => showSection('menu'));
  btnShopping.addEventListener('click', () => showSection('shopping'));

  // Menu Planning Form Logic
  const menuForm = document.getElementById('menu-form');
  const menuMsg = document.getElementById('menu-msg');
  const btnResetMenu = document.getElementById('reset-menu');

  // Load menus from localStorage or default empty object
  let menus = JSON.parse(localStorage.getItem('menus')) || {};

  // Populate inputs on load
  Object.entries(menus).forEach(([name, value]) => {
    const input = menuForm.elements[name];
    if (input) input.value = value;
  });

  menuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Gather form data
    const data = new FormData(menuForm);
    menus = {};
    for (const [key, val] of data.entries()) {
      menus[key] = val.trim();
    }
    // Save to localStorage
    localStorage.setItem('menus', JSON.stringify(menus));
    menuMsg.textContent = 'Menus enregistrés avec succès !';
    setTimeout(() => {
      menuMsg.textContent = '';
    }, 3000);
  });

  btnResetMenu.addEventListener('click', () => {
    // Clear localStorage menus
    localStorage.removeItem('menus');
    menus = {};
    // Clear form inputs
    Array.from(menuForm.elements).forEach(el => {
      if (el.tagName === 'INPUT' && el.type === 'text') el.value = '';
    });
    menuMsg.textContent = 'Menus réinitialisés.';
    setTimeout(() => {
      menuMsg.textContent = '';
    }, 3000);
  });

  // Shopping List Logic
  const shoppingForm = document.getElementById('shopping-form');
  const inputNewItem = document.getElementById('new-item');
  const itemsList = document.getElementById('items-list');
  const btnResetShopping = document.getElementById('reset-shopping');

  // Load items from localStorage or empty
  let items = JSON.parse(localStorage.getItem('shoppingItems')) || [];

  // Render shopping list items
  function renderItems() {
    itemsList.innerHTML = '';
    if (items.length === 0) {
      const li = document.createElement('li');
      li.style.color = '#ff6868aa';
      li.textContent = 'Votre liste de courses est vide.';
      itemsList.appendChild(li);
      return;
    }
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.textContent = item;
      const delBtn = document.createElement('button');
      delBtn.className = 'delete';
      delBtn.setAttribute('aria-label', `Supprimer ${item}`);
      delBtn.innerHTML = '×';
      delBtn.addEventListener('click', () => {
        items.splice(idx, 1);
        saveItems();
        renderItems();
      });
      li.appendChild(delBtn);
      itemsList.appendChild(li);
    });
  }

  function saveItems() {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
  }

  shoppingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = inputNewItem.value.trim();
    if (val === '') return;
    items.push(val);
    saveItems();
    renderItems();
    inputNewItem.value = '';
    inputNewItem.focus();
  });

  btnResetShopping.addEventListener('click', () => {
    // Clear localStorage shopping list
    localStorage.removeItem('shoppingItems');
    items = [];
    renderItems();
  });

  renderItems();
});
