// Importing third-party packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Invoking the app
const app = express();

// Importing my exports
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');

// Using body-parser and cors for the app
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/user', userRoutes);

sequelize.sync()
    .then(app.listen(3000))
    .catch(err => console.log(err));