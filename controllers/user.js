const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler')
const formidable = require('formidable');//API upload Avarta
const _ = require('lodash')
const fs = require('fs')
const sha256 = require("js-sha256");
exports.checkLoginUser = (req, res) => {
    const _id = req.body._id;
    // console.log(userId);
    const tokenRequest = req.body.token
    User.findOne({ _id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (err || user.token !== tokenRequest) {
            return res.status(400).json({
                error: 'Token not found'
            });
        }
        const { _id, username, firstname, lastname, email, roleType, token } = user;
        return res.json({
            user: { _id, username, firstname, lastname, email, roleType, token }
        });
    });
}


exports.list = (req, res) => {
    const token = req.body.token
    User.findOne({ token }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User does not exist'
            });
        }
        if (user.roleType !== "0") {
            return res.status(400).json({
                error: 'The account is not authorized'
            });
        }
        User.find({}, function (err, users) {
            var userMap = {};

            users.forEach(function (user) {
                userMap[user._id] = user;
            });

            res.send(userMap);
        });
    })
}

exports.update = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const _id = req.body._id
    const username = req.body.username
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const password = req.body.password

    User.findOne({ username }).exec((err, user) => {
        if (token !== user.token) {
            return res.status(400).json({
                error: 'Token not found'
            });
        }

        const id = JSON.stringify(user._id)
        if (JSON.stringify(_id) !== id) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password less than 6 characters'
            });
        }

        user.firstname = firstname
        user.lastname = lastname
        user.password = sha256(password + process.env.JWT_SECRET)
        user.save();

        return res.json({
            message: 'Update success!!!'
        });
    })
};

exports.updateimages = (req, res) => { }

exports.remove = (req, res) => {
    const token = req.body.token;
    const _id = req.body._id;
    User.findOne({ _id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User does not exist'
            });
        }
        const id = JSON.stringify(user._id)
        if (JSON.stringify(_id) !== id) {
            return res.status(400).json({
                error: 'User not found'
            });
        } else if (token !== user.token) {
            return res.status(400).json({
                error: 'Token not found'
            });
        } else {
            User.remove({ _id }).exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({
                    message: 'User deleted successfully'
                });
            })
        }

    })
}