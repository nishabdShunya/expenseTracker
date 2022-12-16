const User = require('../models/user');

exports.postAddUser = async (req, res, next) => {
    try {
        if (req.body.username === '' || req.body.email === '' || req.body.password === '') {
            res.status(400).json({ success: false, message: 'Invalid Request' });
        } else {
            const user = await User.findOne({ where: { email: req.body.email } });
            if (user) {
                res.status(403).json({ success: false, message: 'A user with this email already exists.' })
            } else {
                const newUser = await User.create({
                    name: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });
                res.status(201).json({ success: true, message: 'Congratulations! You successfully signed up.' });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
};