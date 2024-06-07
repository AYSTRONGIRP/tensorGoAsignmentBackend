const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const router = require('./routes/routes');
const authRouter = require('./routes/authRoutes'); // <- NEW LINE
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const auth = require('./middleware/auth');
const  customerRequestController = require('./controllers/customerRequest');
const app = express();
require('dotenv').config(); // <- connecting the enviroment variables
// MIDLEWARES ->>
app.enable('trust proxy');

const corsOptions = {
    origin: true, // Allow requests from any origin
    credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

const limiter = rateLimit({	// <- Limits the number of api calls that can be made per IP address
	max: 1000, // max number of times per windowMS
	windowMs: 60 * 60 * 1000,
	message:
        '!!! Too many requests from this IP, Please try again in 1 hour !!!',
});

// app.use('/api/v1', limiter);

app.use((req, res, next) => {	// <- Serves req time and cookies
	
	req.requestTime = new Date().toISOString();
	console.log(req.requestTime);
	if (req.cookies) console.log("cookie",req.cookies);
	next();
});

app.use((req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	next();
});

app.use(express.json({ limit: '100mb' })); // <- Parses Json data
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // <- Parses URLencoded data

app.use(compression());

app.use('/api/v1/auth/', authRouter); // <- NEW LINE
app.use('/api/v1/', router);

app.post('/request', auth.googleAuth , customerRequestController);
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorController); // <- Error Handling Middleware

app.listen(8000, () => {
    console.log(`Server is running on port ${8000}`);
});

module.exports = app;