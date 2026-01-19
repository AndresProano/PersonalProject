const BANK_KEY = 'moneyItems';
const EXPENSE_KEY = 'expenseItems';

const bankListContainer = document.getElementById('bankListContainer');
const expenseListContainer = document.getElementById('expenseList');
const accountSelect = document.getElementById('expenseAccount');
const totalBalanceDisplay = document.getElementById('totalBalance');

function getBank(){
    const items = localStorage.getItem(BANK_KEY);
    return items ? JSON.parse(items) : [];
}

function saveBank(money){
    localStorage.setItem(ROOM_KEY, JSON.stringify(money));
    if (accessToken) {
        syncToDrive(); // Sincronizar tras cada guardado
    }
}

function getExpenses(){
    const data = localStorage.getItem('expenseItems');
    return data ? JSON.parse(data) : [];
}

function saveExpenses(items){
    localStorage.setItem('expenseItems', JSON.stringify(items));
    if (accessToken) {
        syncToDrive(); // Sincronizar tras cada guardado
    }
}

function updateDashboard() {
    const banks = getBank();
    const total = banks.reduce((sum, bank) => sum + bank.amount, 0);
    totalBalanceDisplay.innerText = `$${total.toLocaleString()}`;
    
    accountSelect.innerHTML = '<option value="">Select an account...</option>';
    banks.forEach(bank => {
        const option = document.createElement('option');
        option.value = bank.name;
        option.textContent = `${bank.name} ($${bank.amount})`;
        accountSelect.appendChild(option);
    });
}

function renderBank() {
    const banks = getBank();
    bankListContainer.innerHTML = '';

    banks.forEach((bank, index) => {
        const isLow = bank.amount <= 30;
        const card = document.createElement('div');
        card.className = 'item-card';
        if (isLow) card.style.borderLeft = "4px solid #ff4d4f";

        card.innerHTML = `
            <div class="item-info">
                <strong>${bank.name}</strong>
                <p>$${bank.amount}</p>
            </div>
            <div class="item-actions">
                <button class="btn-sm" onclick="changeBalance(${index}, 10)">+$10</button>
                <button class="btn-danger btn-sm" onclick="removeBank(${index})">×</button>
            </div>
        `;
        bankListContainer.appendChild(card);
    });
    updateDashboard();
}

function renderExpenses() {
    const expenses = getExpenses();
    expenseListContainer.innerHTML = '';

    expenses.forEach((expense, index) => {
        const card = document.createElement('div');
        card.className = 'item-card expense-item';
        card.innerHTML = `
            <div class="item-info">
                <strong>${expense.name}</strong>
                <small>${expense.accountId} | ${new Date().toLocaleDateString()}</small>
            </div>
            <div class="item-actions">
                <span class="expense-amount">-$${expense.amount}</span>
                <button class="btn-danger btn-sm" onclick="removeExpense(${index})">×</button>
            </div>
        `;
        expenseListContainer.appendChild(card);
    });
}
document.getElementById('formBank').addEventListener('submit', (e) => {
    e.preventDefault();
    const banks = getBank();
    banks.push({
        name: document.getElementById('bankName').value,
        amount: parseInt(document.getElementById('bankAmount').value)
    });
    saveBank(banks);
    renderBank();
    e.target.reset();
});

document.getElementById('formExpenses').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseInt(document.getElementById('expenseAmount').value);
    const accountName = accountSelect.value;
    
    let banks = getBank();
    const accIndex = banks.findIndex(b => b.name === accountName);

    if (accIndex !== -1 && banks[accIndex].amount >= amount) {
        banks[accIndex].amount -= amount;
        saveBank(banks);

        const expenses = getExpenses();
        expenses.push({
            name: document.getElementById('expenseName').value,
            amount: amount,
            accountId: accountName
        });
        saveExpenses(expenses);

        renderBank();
        renderExpenses();
        e.target.reset();
    } else {
        alert("Fondos insuficientes o cuenta no seleccionada");
    }
});


window.changeBalance = (index, change) => {
    const banks = getBank();
    banks[index].amount += change;
    saveBank(banks);
    renderBank();
};

window.removeBank = (index) => {
    if(confirm("Delete this account?")) {
        const banks = getBank();
        banks.splice(index, 1);
        saveBank(banks);
        renderBank();
    }
};

window.removeExpense = (index) => {
    const expenses = getExpenses();
    const banks = getBank();
    const expense = expenses[index];

    const accIndex = banks.findIndex(b => b.name === expense.accountId);
    if(accIndex !== -1) {
        banks[accIndex].amount += expense.amount;
        saveBank(banks);
    }

    expenses.splice(index, 1);
    saveExpenses(expenses);
    renderBank();
    renderExpenses();
};

renderBank();
renderExpenses();


