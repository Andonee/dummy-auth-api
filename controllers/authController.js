const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

const tokenGenerator = user => {
	const timestamp = new Date().getTime()
	return jwt.sign({ sub: user._id, iat: timestamp }, config.secret, {
		expiresIn: '1h',
	})
}

const signUp = async (req, res) => {
	const email = req.body.email
	const password = req.body.password

	if (!email || !password)
		res.send({ error: 'You must provide email and password' })

	const emailExists = await User.findOne({ email: email })

	if (emailExists)
		return res.status(422).send({ error: 'Email already exists' })

	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	const user = new User({
		email,
		password: hashedPassword,
	})

	try {
		await user.save()
		res.send({ token: tokenGenerator(user) })
	} catch (error) {
		res.status(400).send(error)
	}
}

const logIn = async (req, res) => {
	const { email, password } = req.body

	try {
		// I have access to user model thanks to passport and I can use req.user

		res.send({ token: tokenGenerator(req.user) })
	} catch (error) {
		console.log(error)
	}
}

module.exports = { signUp, logIn }
