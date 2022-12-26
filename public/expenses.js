const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseList = document.getElementById('expense-list');
const user = document.getElementById('user');
const username = document.getElementById('user-name');
const buyPremiumBtn = document.getElementById('buy-premium-btn');

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
        try {
            const response = await axios.post('http://localhost:3000/expenses/add-expense', expenseDetails, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            showNotification(response.data.message);
            showExpenses();
        } catch (error) {
            showNotification(error);
        }
        // Clearing the fields
        amount.value = '';
        description.value = '';
        category.value = 'Expense Category';
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
    try {
        const response = await axios.get('http://localhost:3000/expenses', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        username.innerText = response.data.user.name;
        if (response.data.user.isPremiumUser) {
            makePremium();
        }
        const expenses = response.data.expenses;
        for (let expense of expenses) {
            const expenseItem = `
            <li class="expense-item">
                &#x20B9; ${expense.amount} spent on ${expense.category} (${expense.description}).
                <button class="del-btns" onClick = "deleteExpenseItem('${expense.id}')">DELETE</button>
            </li>`;
            expenseList.innerHTML += expenseItem;
        }
    } catch (error) {
        showNotification(error.response.data.message);
    }
};

async function deleteExpenseItem(expenseId) {
    try {
        const response = await axios.delete('http://localhost:3000/expenses/' + expenseId, {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        showNotification(response.data.message);
        showExpenses();
    } catch (error) {
        showNotification(error);
    }
};

buyPremiumBtn.addEventListener('click', order);

async function order(event) {
    const response = await axios.get('http://localhost:3000/purchase/premium-membership', {
        headers: { 'Authorization': localStorage.getItem('token') }
    });
    const options = {
        key: response.data.key_id,              // Recognizes your company
        order_id: response.data.order.id,        // Id for one time payment
        handler: async (response) => {    // To handle the successful payment
            const transactionResponse = await axios.post('http://localhost:3000/purchase/update-transaction-status', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': localStorage.getItem('token') } })
            showNotification(transactionResponse.data.message + ' You are now a premium user.');
            makePremium();
        }
    }
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
    event.preventDefault();
    razorpayInstance.on('payment.failed', (response) => {
        console.log(response);
        alert('Something went wrong. Please try again.');
    });
}

function makePremium() {
    buyPremiumBtn.style.display = "none";
    const premiumUser = `<span id="premium-user">(Premium User)</span>`;
    user.innerHTML += premiumUser;
}