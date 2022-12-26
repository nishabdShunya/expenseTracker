const Razorpay = require('razorpay');
const Order = require('../models/order');

exports.getPremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: 'rzp_test_qrOcSDJiM63bIP',
            key_secret: 'uSYQXElrOFv5ia0jESuutarN'
        });
        rzp.orders.create({ amount: 3000, currency: 'INR' }, async (err, order) => {
            try {
                if (err) {
                    throw new Error(err);
                }
                await req.user.createOrder({
                    orderId: order.id,
                    status: 'PENDING'
                });
                res.status(200).json({ order, key_id: rzp.key_id });
            } catch (error) {
                throw new Error(error);
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}

exports.updateTransaction = async (req, res, next) => {
    try {
        const order = await Order.findOne({ where: { orderId: req.body.order_id } });
        const promise1 = await order.update({ paymentId: req.body.payment_id, status: 'SUCCESSFUL' });
        const promise2 = await req.user.update({ isPremiumUser: true });
        await Promise.all([promise1, promise2]);
        // .then(result => {
        res.status(202).json({ success: true, message: 'Transaction Successful.' });
        // })
        // .catch(err => console.log(err))
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}