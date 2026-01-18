const ROOM_KEY = 'kitchenItems';
const itemForm = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');

function render() {
    const items = getItems(ROOM_KEY);
    itemList.innerHTML = ''; // Limpiar lista actual

    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-card';
        itemDiv.innerHTML = `
            <span>${item.name} - Qty: ${item.qty}</span>
            <button onclick="updateQty(${index}, 1)">+</button>
            <button onclick="updateQty(${index}, -1)">-</button>
            <button onclick="removeItem(${index})">Delete</button>
        `;
        itemList.appendChild(itemDiv);
    });
}

itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const items = getItems(ROOM_KEY);
    
    const newItem = {
        name: document.getElementById('name').value,
        qty: parseInt(document.getElementById('qty').value),
        threshold: parseInt(document.getElementById('threshold').value)
    };

    items.push(newItem);
    saveItems(ROOM_KEY, items);
    checkThreshold(newItem); // Notificar si entra con stock bajo
    render();
    itemForm.reset();
});

window.updateQty = (index, change) => {
    const items = getItems(ROOM_KEY);
    items[index].qty += change;

    if (items[index].qty < 0) items[index].qty = 0;

    saveItems(ROOM_KEY, items);
    checkThreshold(items[index]); // Verificar tras actualización
    render();
};

window.removeItem = (index) => {
    const items = getItems(ROOM_KEY);
    items.splice(index, 1);
    saveItems(ROOM_KEY, items);
    render();
};

render();