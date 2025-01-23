const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

app.use(cors({
    origin: 'http://localhost:5173', // or your frontend domain
    credentials: true, 
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const connectToDb = require('./db/db');
connectToDb();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

module.exports = app;