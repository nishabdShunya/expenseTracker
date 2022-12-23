const email = document.getElementById('email');
const password = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', loginUser);

async function loginUser(event) {
    event.preventDefault();
    if (email.value === '' || password.value === '') {
        alert('Please enter all the fields.');
    } else {
        const loginDetails = {
            email: email.value,
            password: password.value
        }
        try {
            const response = await axios.post('http://localhost:3000/user/login', loginDetails);
            if (response.status === 201) {
                showNotification(response.data.message);
                setTimeout(() => {
                    window.location.href = './expenses.html';
                }, 2500);
            } else if (response.status === 401) {
                showNotification(response.data.message);
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        } catch (error) {
            showNotification(error.response.data.message);
        }
        // Clearing the fields
        email.value = '';
        password.value = '';
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
}