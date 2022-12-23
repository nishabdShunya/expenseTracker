const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function generateAccessToken(id) {
    return jwt.sign({ userId: id }, 'secret_key');
}

exports.postAddUser = async (req, res, next) => {
    try {
        if (req.body.username === '' || req.body.email === '' || req.body.password === '') {
            res.status(400).json({ success: false, message: 'Invalid Request' });
        } else {
            const user = await User.findOne({ where: { email: req.body.email } });
            if (user) {
                res.status(403).json({ success: false, message: 'A user with this email already exists.' })
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    await User.create({
                        name: req.body.username,
                        email: req.body.email,
                        password: hash
                    });
                    res.status(201).json({ success: true, message: 'Congratulations! You successfully signed up.' });
                })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
};

exports.postLoginUser = async (req, res, next) => {
    try {
        if (req.body.email === '' || req.body.password === '') {
            res.status(400).json({ success: false, message: 'Invalid Request' });
        } else {
            const emailEntered = req.body.email;
            const user = await User.findOne({ where: { email: emailEntered } });
            if (!user) {
                res.status(404).json({ success: false, message: 'User does not exist. Please enter registered email.' });
            } else {
                const passwordEntered = req.body.password;
                bcrypt.compare(passwordEntered, user.password, (err, result) => {
                    if (!result) {
                        res.status(401).json({ success: false, message: 'Incorrect Password.' });
                    } else {
                        res.status(201).json({ success: true, message: 'Logged in successfully.', token: generateAccessToken(user.id) });
                    }
                });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
};