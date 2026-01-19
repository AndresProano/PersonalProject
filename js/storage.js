function getItems(roomKey) {
    const data = localStorage.getItem(roomKey);
    return data ? JSON.parse(data) : [];
}

function saveItems(roomKey, items) {
    localStorage.setItem(roomKey, JSON.stringify(items));
}

function checkThreshold(item) {
    if (item.qty <= item.threshold) {
        alert(`Low stock alert: ${item.name} (Only ${item.qty} left!)`);
    }
}