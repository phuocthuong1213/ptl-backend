const express = require('express');
const router = express.Router();
const { checkLoginUser } = require('../controllers/user');

router.post('/requireSignin', checkLoginUser);
module.exports = router;
