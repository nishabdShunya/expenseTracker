const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
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
                to: email, // Change to your recipient
                from: 'nishantchoubisa0@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
            };
            const result = await sgMail.send(msg);
            res.status(result[0].statusCode).json({ success: true, message: 'Link to reset password sent to your email.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}