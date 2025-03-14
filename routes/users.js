const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchasync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware/middlewares');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchasync(users.registerUser))

router.route('/login')
    .get(storeReturnTo, users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)

router.get('/logout', users.logout)

module.exports = router;