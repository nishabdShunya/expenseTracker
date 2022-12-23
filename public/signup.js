const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');

signupBtn.addEventListener('click', addUser);

async function addUser(event) {
    event.preventDefault();
    if (username.value === '' || email.value === '' || password.value === '') {
        alert('Please enter all the fields');
    } else {
        const user = {
            username: username.value,
            email: email.value,
            password: password.value
        }
        try {
            const response = await axios.post('http://localhost:3000/user/signup', user);
            if (response.status === 201) {
                showNotification(response.data.message);
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2500);
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        } catch (error) {
            showNotification(error.response.data.message);
        }
        // Clearing the fields
        username.value = '';
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