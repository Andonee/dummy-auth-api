const express = require('express')
const router = express.Router()
const Authentication = require('../controllers/authController')
const passportService = require('../services/passport')
const passport = require('passport')

// session false becasue I dont use cookies but token
const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

router.post('/signup', Authentication.signUp)
router.post('/signin', requireSignin, Authentication.logIn)
router.get('/', requireAuth, (req, res) => {
	res.send('dummy text')
})
module.exports = router
