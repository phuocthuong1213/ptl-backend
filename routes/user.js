const express = require('express');
const router = express.Router();
const { checkLoginUser, update } = require('../controllers/user');

router.post('/requireSignin', checkLoginUser);
router.put('/update', update);
module.exports = router;
