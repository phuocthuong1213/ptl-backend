const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const sha256 = require("js-sha256");
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
exports.signup = (req, res) => {
    console.log(req.body);
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
        const { firstname, lastname, email, password, username, roleType } = req.body;
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        let newUser = new User({
            firstname,
            lastname,
            email,
            password: sha256(password + process.env.JWT_SECRET),
            profile,
            username,
            roleType,
            resetPasswordLink: '',
            avatar: ''
        });
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: 'Signup success! Please signin.'
            });
        });
    });
};

exports.signin = async (req, res) => {
    const { username, password } = req.body;
    // check if user exist
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            });
        }
        if (user.password !== sha256(password + process.env.JWT_SECRET)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
        }



        // generate a token and send to client
        const token = uuidv4();
        user.token = token;
        user.save()
        const { _id, username, firstname, lastname, email, roleType } = user;
        return res.json({
            token,
            user: { _id, username, firstname, lastname, email, roleType }
        });
    });
};



exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.checkLoginUser = (req, res, next) => {
    const _id = req.body.id;
    
    // console.log(userId);
    const token = req.body.token
    User.findOne({ _id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (err || user.token !== token) {
            return res.status(400).json({
                error: 'Token not found'
            });
        }
        const { _id, username, firstname, lastname, email, roleType } = user;
        return res.json({
            user: { _id, username, firstname, lastname, email, roleType }
        });
    });
}

// exports.adminMiddleware = (req, res, next) => {
//     const adminUserId = req.user._id;
//     User.findById({ _id: adminUserId }).exec((err, user) => {
//         if (err || !user) {
//             return res.status(400).json({
//                 error: 'User not found'
//             });
//         }

//         if (user.role !== 1) {
//             return res.status(400).json({
//                 error: 'Admin resource. Access denied'
//             });
//         }

//         req.profile = user;
//         next();
//     });
// };
