// Importing third-party packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Invoking the app
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Importing my exports
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotPassword');
const FileDownloaded = require('./models/fileDownloaded');

// Using body-parser and cors for the app
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', resetPasswordRoutes);

// Associations
Expense.belongsTo(User);
User.hasMany(Expense);
Order.belongsTo(User);
User.hasMany(Order);
ForgotPassword.belongsTo(User);
User.hasMany(ForgotPassword);
FileDownloaded.belongsTo(User);
User.hasMany(FileDownloaded);

sequelize.sync()
    .then(app.listen(3000))
    .catch(err => console.log(err));