const axios = require('axios');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const oauth2Client = require('../utils/oauth2client');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const User = require('../models/userModel');

// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: 1000*60*60*24*30,
//     });
// };
// Create and send Cookie ->
// const createSendToken = (user, statusCode, res) => {
//     const token = signToken(user.id);

//     console.log(1000*60*60*24*30);
//     const cookieOptions = {
//         expires: new Date(Date.now() +1000*60*60*24*30),
//         httpOnly: true,
//         path: '/',
//         sameSite: "none",
//         secure: false,
//     };
//     if (process.env.NODE_ENV === 'production') {
//         cookieOptions.secure = true;
//         cookieOptions.sameSite = 'none';
//     }

//     user.password = undefined;

//     res.cookie('jwt', token, cookieOptions);

//     // console.log("inside create token:", user);

//     res.status(statusCode).json({
//         message: 'success',
//         token,
//         data: {
//             user,
//         },
//     });
// };
/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
    const code = req.body.code; //get the code from the request body
    console.log("USER CREDENTIAL -> ", code);

    const googleRes = await oauth2Client.oauth2Client.getToken(code);
    // console.log("GOOGLE RESPONSE -> ", googleRes.tokens);
    oauth2Client.oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
	);
	
    // let user = await User.findOne({ email: userRes.data.email });
   
    const user = {
        id: userRes.data.id,
        name: userRes.data.name,
        email: userRes.data.email,
        image: userRes.data.picture,
    };

    res.locals.user=user
    console.log("user" ,user);

    next();
};