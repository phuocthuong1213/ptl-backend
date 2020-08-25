const express = require('express');
const router = express.Router();
const { checkLoginUser, update, remove, list } = require('../controllers/user');
const { runValidation } = require('../validators');

router.post('/requireSignin', checkLoginUser);
router.put('/update', update);
router.delete('/delete', remove);
router.get('/list', list);
module.exports = router;
