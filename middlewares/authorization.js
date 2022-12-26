const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authentication = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const tokenDecoded = jwt.verify(token, 'secret_key');
        const user = await User.findOne({ where: { id: tokenDecoded.userId } });
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
}