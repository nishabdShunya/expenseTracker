const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseList = document.getElementById('expense-list');

window.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    showExpenses();
});

addExpenseBtn.addEventListener('click', addExpense);

async function addExpense(event) {
    event.preventDefault();
    if (amount.value === '' || description.value === '' || category.value === '') {
        alert('Please enter all the fields.');
    }
    else {
        const expenseDetails = {
            amount: amount.value,
            description: description.value,
            category: category.value
        }
        const response = await axios.post('http://localhost:3000/expenses/add-expense', expenseDetails);
        showNotification(response.data.message);
        showExpenses();
        // Clearing the fields
        amount.value = '';
        description.value = '';
        category.value = '';
    }
}

function showNotification(message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notification');
    notificationDiv.innerHTML = `${message}`;
    document.body.appendChild(notificationDiv);
    setTimeout(() => {
        document.body.removeChild(notificationDiv);
    }, 2500);
};

async function showExpenses() {
    expenseList.innerHTML = '';
    const response = await axios.get('http://localhost:3000/expenses');
    const expenses = response.data.expenses;
    for (let expense of expenses) {
        const expenseItem = `
        <li class="expense-item">
            &#x20B9; ${expense.amount} spent on ${expense.category} (${expense.description}).
            <button class="del-btns" onClick = "deleteExpenseItem('${expense.id}')">DELETE</button>
        </li>`;
        expenseList.innerHTML += expenseItem;
    }
};

async function deleteExpenseItem(expenseId) {
    const response = await axios.delete('http://localhost:3000/expenses/' + expenseId);
    showNotification(response.data.message);
    showExpenses();
};
