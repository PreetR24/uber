const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/rides.routes');

app.use(cors({
    origin: ['https://uber-client-rho.vercel.app/','http://localhost:5173'], // or your frontend domain
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
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);

module.exports = app;