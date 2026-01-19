const ROOM_KEY = 'kitchenItems';
const itemForm = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');

function getItems(){
    const data = localStorage.getItem(ROOM_KEY);
    return data ? JSON.parse(data) : [];
}

function saveItems(items){
    localStorage.setItem(ROOM_KEY, JSON.stringify(items));
    if (accessToken) {
        syncToDrive(); // Sincronizar tras cada guardado
    }
}

function checkThreshold(item) {
    if (item.qty <= item.threshold) {
        alert(`Alert: The item "${item.name}" is below or at its threshold level! Current quantity: ${item.qty}`);
    }
}

function render() {
    const items = getItems();
    itemList.innerHTML = ''; // Limpiar lista actual

    if (items.length === 0) {
        itemList.innerHTML = '<p style="color: #999; text-align: center;">No items yet. Add one to get started!</p>';
        return;
    }

    items.forEach((item, index) => {
        const isLow = item.qty <= item.threshold;
        const card = document.createElement('div');
        card.className = 'item-card'; // Clase de tu CSS
        card.setAttribute('data-low', isLow);
        
        // Estilo dinámico si el stock es bajo
        if (isLow) card.style.borderLeft = "4px solid #ff4d4f";

        card.innerHTML = `
            <div class="item-info">
                <strong>${item.name}</strong>
                <span class="badge">${item.category}</span>
                <small style="display: block; color: #888;">Mínimo: ${item.threshold}</small>
            </div>
            <div class="item-actions">
                <span style="font-weight: bold; margin-right: 10px;">${item.qty}</span>
                <button class="btn-sm" onclick="updateQty(${index}, 1)">+</button>
                <button class="btn-sm" onclick="updateQty(${index}, -1)">-</button>
                <button class="btn-danger btn-sm" onclick="removeItem(${index})">×</button>
            </div>
        `;
        itemList.appendChild(card);
    });
}

itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newItem = {
        name: document.getElementById('name').value,
        qty: parseInt(document.getElementById('qty').value),
        threshold: parseInt(document.getElementById('threshold').value),
        category: document.getElementById('category').value
    };

    const items = getItems();
    items.push(newItem);
    saveItems(items);

    checkThreshold(newItem); // Notificar si entra con stock bajo
    render();
    itemForm.reset();
});

window.updateQty = (index, change) => {
    const items = getItems();
    items[index].qty = Math.max(0, items[index].qty + change);

    saveItems(items);
    checkThreshold(items[index]); // Verificar tras actualización
    render();
};

window.removeItem = (index) => {
    if (confirm('Are you sure you want to delete this item?')) {
        const items = getItems();
        items.splice(index, 1);
        saveItems(items);
        render();
    }
};

render();