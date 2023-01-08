const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');

exports.postForgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            const id = uuid.v4();
            console.log(id);
            await user.createForgotPassword({ id: id, active: true });
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: 'nishantchoubisa0@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `
                <h2>Click on the link below to reset your password</h2>
                <a href="http://54.238.209.110:3000/password/reset-password/${id}">Reset password</a>`
            };
            const result = await sgMail.send(msg);
            res.status(result[0].statusCode).json({ success: true, message: 'Link to reset password sent to your email.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}

exports.getResetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const fp = await ForgotPassword.findOne({ where: { id: id } });
        if (id && fp.active) {
            fp.update({ active: false });
            res.status(200).send(`
                <html>
                    <meta>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
                        <style>
                            *,
                            *::before,
                            *::after {
                                box-sizing: inherit;
                                font-family: inherit;
                                font-size: inherit;
                            }
                            
                            html {
                                box-sizing: border-box;
                                font-family: 'Comfortaa';
                                font-size: 10px;
                            }
                            
                            body {
                                margin: 0;
                                width: 100vw;
                                height: 100vh;
                                background-color: rgb(44, 44, 44);
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                            }

                            h1 {
                                font-size: 2rem;
                                color: rgb(82, 214, 150);
                            }
                            
                            p {
                                font-size: 1.25rem;
                                color: white;
                            }

                            form {
                                margin: 0;
                                width: 50%;
                                padding: 2rem;
                                font-size: 1.25rem;
                                background-color: rgb(35, 35, 35);
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: stretch;
                            }
                            
                            input {
                                margin-bottom: 2rem;
                                padding: 0.5rem;
                                height: 4rem;
                                color: white;
                                background-color: rgb(44, 44, 44);
                                border: none;
                            }
                            
                            form input:focus {
                                outline: none;
                            }
                            
                            input {
                                caret-color: rgb(82, 214, 150);
                            }
                            
                            button {
                                border: 0.2rem solid white;
                                font-weight: bold;
                                color: white;
                                background-color: rgb(35, 35, 35);
                                padding: 1rem;
                                height: 4rem;
                            }

                            button:hover {
                                cursor: pointer;
                                background-color: rgb(82, 214, 150, 0.5);
                            }

                            button:focus {
                                outline: none;
                                background-color: rgb(82, 214, 150, 0.5);
                            }

                            .notification {
                                position: fixed;
                                top: 0;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                background-color: rgba(0, 0, 0, 0.75);
                                color: rgb(82, 214, 150);
                                font-size: 2rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                        </style>
                    </meta>
                    <body>
                        <h1>RESET PASSWORD</h1>
                        <p>Enter a new password of your choice and reset your password</p>
                        <form>
                            <label for="new-password"></label>
                            <input type="password" name="new-password" id="new-password" placeholder="Enter New Password" required>
                            <button id="reset-btn">Reset</button>
                        </form>
                    </body>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js"></script>
                    <script>
                        document.getElementById('reset-btn').addEventListener('click', async (event) => {
                            event.preventDefault();
                            const newPassword = document.getElementById('new-password').value;
                            const response = await axios.get('http://54.238.209.110:3000/password/update-password/${id}?new-password=' + newPassword);
                            const notificationDiv = document.createElement('div');
                            notificationDiv.classList.add('notification');
                            notificationDiv.innerHTML = response.data.message;
                            document.body.appendChild(notificationDiv);
                            setTimeout(() => {
                                document.body.removeChild(notificationDiv);
                            }, 2500);
                            document.getElementById('new-password').value = '';
                        });
                    </script>
                </html>
            `);
            res.end();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}

exports.getUpdatePassword = async (req, res, next) => {
    try {
        const newPassword = req.query['new-password'];
        const id = req.params.id;
        const fp = await ForgotPassword.findOne({ where: { id: id } });
        const user = await User.findOne({ where: { id: fp.userId } });
        if (user) {
            bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err) {
                    throw new Error(err);
                } else {
                    await user.update({ password: hash });
                    res.status(201).json({ success: true, message: 'Password reset successful.' });
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'User does not exists.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}