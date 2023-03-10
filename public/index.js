const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseList = document.getElementById('expense-list');
const username = document.getElementById('user-name');
const premiumUser = document.getElementById('premium-user');
const buyPremiumBtn = document.getElementById('buy-premium-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const downloadFileBtn = document.getElementById('download-btn');
const downloadHistoryBtn = document.getElementById('download-history-btn');
const paginationContainer = document.getElementById('pagination-container');
const expensesPerPage = document.getElementById('no-of-expenses-per-page');

window.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    try {
        localStorage.setItem('expenseNum', expensesPerPage.value);
        let page = 1;
        const response = await axios.get(`http://54.238.209.110:3000/expenses?page=${page}`, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'ExpensesPerPage': localStorage.getItem('expenseNum')
            }
        });
        username.innerText = response.data.user.name;
        if (response.data.user.isPremiumUser) {
            makePremium();
        }
        showExpenses(response.data.pageExpenses);
        showPagination(response.data.paginationInfo);
        localStorage.setItem('currentPage', response.data.paginationInfo.currentPage);
    } catch (error) {
        showNotification(error.response.data.message);
    }
});

function showExpenses(expenses) {
    expenseList.innerHTML = '';
    for (let expense of expenses) {
        const expenseItem = `
            <li class="expense-item">
                &#x20B9; ${expense.amount} spent on ${expense.category} (${expense.description}).
                <button class="del-btns" onclick = "deleteExpenseItem(${expense.id})">DELETE</button>
            </li>`;
        expenseList.innerHTML += expenseItem;
    }
};

function showPagination(paginationInfo) {
    paginationContainer.innerHTML = '';
    if (paginationInfo.currentPage !== 1 && paginationInfo.previousPage !== 1) {
        const firstPageBtn = `<button class="pagination-btn" onclick="loadPage(${1})">${1}</button>`;
        paginationContainer.innerHTML += firstPageBtn;
        paginationContainer.innerHTML += `<p>.......</p>`;
    }
    if (paginationInfo.hasPreviousPage) {
        const previousPageBtn = `<button class="pagination-btn" onclick="loadPage(${paginationInfo.previousPage})">${paginationInfo.previousPage}</button>`;
        paginationContainer.innerHTML += previousPageBtn;
    }
    const currentPageBtn = `<button class="pagination-btn active" onclick="loadPage(${paginationInfo.currentPage})">${paginationInfo.currentPage}</button>`;
    paginationContainer.innerHTML += currentPageBtn;
    if (paginationInfo.hasNextPage) {
        const nextPageBtn = `<button class="pagination-btn" onclick="loadPage(${paginationInfo.nextPage})">${paginationInfo.nextPage}</button>`;
        paginationContainer.innerHTML += nextPageBtn;
    }
    if (paginationInfo.currentPage !== paginationInfo.lastPage && paginationInfo.nextPage !== paginationInfo.lastPage && paginationInfo.lastPage !== 0) {
        paginationContainer.innerHTML += `<p>.......</p>`;
        const lastPageBtn = `<button class="pagination-btn" onclick="loadPage(${paginationInfo.lastPage})">${paginationInfo.lastPage}</button>`;
        paginationContainer.innerHTML += lastPageBtn;
    }
}

async function loadPage(page) {
    try {
        const response = await axios.get(`http://54.238.209.110:3000/expenses?page=${page}`, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'ExpensesPerPage': localStorage.getItem('expenseNum')
            }
        });
        showExpenses(response.data.pageExpenses);
        showPagination(response.data.paginationInfo);
        localStorage.setItem('currentPage', response.data.paginationInfo.currentPage);
    } catch (error) {
        showNotification(error.response.data.message);
    }
}

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
            const response = await axios.post('http://54.238.209.110:3000/expenses/add-expense', expenseDetails, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'ExpensesPerPage': localStorage.getItem('expenseNum')
                }
            });
            showNotification(response.data.message);
            loadPage(response.data.lastPage);
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

async function deleteExpenseItem(expenseId) {
    try {
        const response = await axios.delete('http://54.238.209.110:3000/expenses/' + expenseId, {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        showNotification(response.data.message);
        loadPage(localStorage.getItem('currentPage'));
    } catch (error) {
        showNotification(error);
    }
};

buyPremiumBtn.addEventListener('click', order);

async function order(event) {
    const response = await axios.get('http://54.238.209.110:3000/purchase/premium-membership', {
        headers: { 'Authorization': localStorage.getItem('token') }
    });
    const options = {
        key: response.data.key_id,              // Recognizes your company
        order_id: response.data.order.id,        // Id for one time payment
        handler: async (response) => {    // To handle the successful payment
            try {
                const transactionResponse = await axios.post('http://54.238.209.110:3000/purchase/update-transaction-status', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    success: true
                }, { headers: { 'Authorization': localStorage.getItem('token') } });
                showNotification(transactionResponse.data.message + ' You are now a premium user.');
                makePremium();
            } catch (error) {
                showNotification(error.response.data.message)
            }
        }
    }
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
    razorpayInstance.on('payment.failed', async (response) => {
        try {
            const transactionResponse = await axios.post('http://54.238.209.110:3000/purchase/update-transaction-status', {
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
                success: false
            }, { headers: { 'Authorization': localStorage.getItem('token') } });
            razorpayInstance.close();
            showNotification(transactionResponse.data.message + ' Please try again.');
            setTimeout(() => {
                window.location.href = './index.html';
            }, 2500);
        } catch (error) {
            razorpayInstance.close();
            showNotification(error.response.data.message);
            setTimeout(() => {
                window.location.href = './index.html';
            }, 2500);
        }
    });
}

function makePremium() {
    premiumUser.style.display = 'inline';
    buyPremiumBtn.style.display = 'none';
    leaderboardBtn.style.display = 'flex';
    document.getElementById('download-container').style.display = 'flex';
}

leaderboardBtn.addEventListener('click', showLeaderboard);

async function showLeaderboard() {
    try {
        const response = await axios.get('http://54.238.209.110:3000/premium/show-leaderboard');
        const leaderboard = response.data.leaderboard;
        const leaderboardContainer = document.getElementById('leaderboard-container');
        leaderboardContainer.style.display = 'flex';
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        for (let item of leaderboard) {
            const listItem = `
        <li class="list-item">
            <p class="list-item-name"><span>Username:</span> ${item.name}</p>
            <p class="list-item-expense"><span>Total Expenses:</span> &#x20B9; ${item.totalExpenses}</p>
        </li>`;
            leaderboardList.innerHTML += listItem;
        }
        document.getElementById('leaderboard-close-btn').addEventListener('click', (event) => {
            leaderboardContainer.style.display = 'none';
        })
    } catch (error) {
        showNotification(error.response.data.message);
    }
}

downloadFileBtn.addEventListener('click', downloadFile);

async function downloadFile(event) {
    event.preventDefault();
    try {
        const response = await axios.get('http://54.238.209.110:3000/expenses/download-expenses', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        if (response.status === 200) {
            showNotification('Your file is downloading.');
            const a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            showNotification('Something went wrong. Please try again.');
        }
    } catch (error) {
        showNotification(error.response.data.message);
    }
}

downloadHistoryBtn.addEventListener('click', showDownloadHistory);

async function showDownloadHistory(event) {
    event.preventDefault();
    try {
        const response = await axios.get('http://54.238.209.110:3000/expenses/download-history', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const filesDownloaded = response.data.filesDownloaded;
        const downloadHistoryContainer = document.getElementById('download-history-container');
        downloadHistoryContainer.style.display = 'flex';
        const downloadHistoryList = document.getElementById('download-history-list');
        downloadHistoryList.innerHTML = '';
        for (let fileDownloaded of filesDownloaded) {
            const file = `<li class="file"><a href="${fileDownloaded.fileURL}" target="_blank">${fileDownloaded.createdAt}</a></li>`;
            downloadHistoryList.innerHTML += file;
        }
        document.getElementById('download-history-close-btn').addEventListener('click', (event) => {
            downloadHistoryContainer.style.display = 'none';
        })
    } catch (error) {
        showNotification(error.response.data.message);
    }
}

expensesPerPage.addEventListener('change', (event) => {
    event.preventDefault();
    localStorage.setItem('expenseNum', expensesPerPage.value);
    loadPage(1);
});