const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user.routes')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectToDb = require('./db/db');
connectToDb();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/users', userRoutes);

module.exports = app;