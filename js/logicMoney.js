const ROOM_KEY = 'moneyItems';
const itemBank = document.getElementById('itemBank');
const itemExpenses = document.getElementById('itemExpenses');

function getBank(){
    const items = localStorage.getItem(ROOM_KEY);
    return items ? JSON.parse(items) : [];
}

function saveBank(money){
    localStorage.setItem(ROOM_KEY, JSON.stringify(money));
}

function getExpenses(){
    const data = localStorage.getItem('expenseItems');
    return data ? JSON.parse(data) : [];
}

function saveExpenses(items){
    localStorage.setItem('expenseItems', JSON.stringify(items));
}

function checkThreshold(money) {
    if (money.amount <= 30) {
        alert(`Alert: The bank "${money.name}" has low balance! Current amount: ${money.amount}`);
    }
}

function renderBank(){
    const moneyItems = getBank();
    itemBank.innerHTML = ''; // Limpiar lista actual

    if (moneyItems.length === 0) {
        itemBank.innerHTML = '<p style="color: #999; text-align: center;">No money items yet. Add one to get started!</p>';
        return;
    }

    moneyItems.forEach((money, index) => {
        const isLow = money.amount <= 30;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.setAttribute('data-low', isLow);

        if (isLow) card.style.borderLeft = "4px solid #ff4d4f";

        card.innerHTML = `
            <div class="item-info">
                <strong>${money.name}</strong>
                <small style="display: block; color: #888;">Amount: $${money.amount}</small>
            </div>
            <div class="item-actions">
                <button class="btn-sm" onclick="updateMoney(${index}, 50)">+ $50</button>
                <button class="btn-sm" onclick="updateMoney(${index}, -50)">- $50</button>
                <button class="btn-danger btn-sm" onclick="removeMoney(${index})">×</button>
            </div>
        `;
        itemBank.appendChild(card);
    });
}

itemBank.addEventListener('submit', (e) => {
    e.preventDefault();

    const newMoney = {
        name: document.getElementById('Bank').value,
        amount: parseInt(document.getElementById('money').value)
    };

    const moneyItems = getBank();
    moneyItems.push(newMoney);
    saveBank(moneyItems);
    checkThreshold(newMoney);
    renderBank();
    itemBank.reset();
});

window.updateMoney = function(index, change) {
    const moneyItems = getBank();
    moneyItems[index].amount += change;

    saveBank(moneyItems);
    renderBank();
};

window.removeMoney = function(index) {
    if (confirm('Are you sure you want to remove this money item?')){
        const moneyItems = getBank();
        moneyItems.splice(index, 1);
        saveBank(moneyItems);
        renderBank();
    }
};

renderBank();

function renderExpenses(){
    const expenseItems = getExpenses();
    itemExpenses.innerHTML = ''; // Limpiar lista actual

    if (expenseItems.length === 0) {
        itemExpenses.innerHTML = '<p style="color: #999; text-align: center;">No expenses yet. Add one to get started!</p>';
        return;
    }

    expenseItems.forEach((expense, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        card.innerHTML = `
            <div class="item-info">
                <strong>${expense.name}</strong>
                <small style="display: block; color: #888;">Amount: $${expense.amount}</small>
            </div>
            <div class="item-actions">
                <button class="btn-danger btn-sm" onclick="removeExpense(${index})">×</button>
            </div>
        `;
        itemExpenses.appendChild(card);
    });
}

itemExpenses.addEventListener('submit', (e) => {
    e.preventDefault();

    const newExpense = {
        name: document.getElementById('expenseName').value,
        amount: parseInt(document.getElementById('expenseAmount').value),
        accountId: document.getElementById('expenseAccount').value
    };

    let accountId = getBank();

    const accountIndex = accountId.findIndex(acc => acc.name === newExpense.accountId);

    if (accountIndex !== -1) {

        if (accountId[accountIndex].amount < newExpense.amount) {
            alert('Insufficient funds in the selected account!');
            return;
        }

        accountId[accountIndex].amount -= newExpense.amount;

        saveBank(accountId);

        const expenseItems = getExpenses();
        expenseItems.push(newExpense);
        saveExpenses(expenseItems);
        renderExpenses();

        if(typeof updateMoney === 'function'){
            renderBank();
        }
        
        itemExpenses.reset();
    } else {
        alert('Selected account not found!');
    }
});

window.updateExpense = function(index, change) {
    const expenseItems = getExpenses();
    expenseItems[index].amount += change;

    saveExpenses(expenseItems);
    renderExpenses();
};  

window.removeExpense= function(index) {
    if (confirm('Are you sure you want to delete this expense?')) {

        const expenses = getExpenses();
        const bank = getBank();

        const expenseToRemove = expenses[index];

        const accountIndex = bank.findIndex(acc => acc.name === expenseToRemove.accountId);

        if (accountIndex !== -1) {
            bank[accountIndex].amount += expenseToRemove.amount;
            saveBank(bank);
            renderBank();
        }else {
            alert('Associated account not found!');
        }
    
        expenses.splice(index, 1);
        saveExpenses(expenses);
        renderExpenses();
    }   
};

renderExpenses();



