const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler')
const formidable = require('formidable');//API upload Avarta
const _ = require('lodash')
const fs = require('fs')
exports.read = async (req, res) => {
    req.profile.password = await undefined;
    return res.json(req.profile);
};



exports.checkLoginUser = (req, res, next) => {
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
        console.log(user);
        const { _id, username, firstname, lastname, email, roleType, token } = user;
        return res.json({
            user: { _id, username, firstname, lastname, email, roleType, token }
        });
    });
}


exports.update = (req, res) => {
    console.log(req.body);
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Avatar could not be uploaded'
            });
        }

        let user = req.profile;

        if (fields && fields.firstname && fields.firstname.length > 12) {
            return res.status(400).json({
                error: 'Firstname should be less than 12 characters long'
            });
        }

        if (fields.firstname) {
            fields.firstname = slugify(fields.firstname).toLowerCase();
        }

        if (fields && fields.lastname && fields.lastname.length > 12) {
            return res.status(400).json({
                error: 'Lastname should be less than 12 characters long'
            });
        }

        if (fields.lastname) {
            fields.lastname = slugify(fields.lastname).toLowerCase();
        }


        if (fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: 'Password should be min 6 characters long'
            });
        }

        user = _.extend(user, fields);

        if (files.avatar) {
            if (files.avatar.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            user.avatar.data = fs.readFileSync(files.avatar.path);
            user.avatar.contentType = files.avatar.type;
        }

        user.save((err, result) => {
            if (err) {
                console.log('profile udpate error', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            user.password = undefined;
            user.salt = undefined;
            user.avatar = undefined;
            res.json(user);
        });
    });
};


//token,Id nằm ở head
//body: fname,lname,password

exports.avatar = (req, res) => {
    console.log(req.body);
    const username = req.params.username;
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.avatar.data) {
            res.set('Content-Type', user.avatar.contentType);
            return res.send(user.avatar.data);
        }
    });
};