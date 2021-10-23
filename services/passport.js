const passport = require('passport')
const User = require('../models/User')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

const localOptions = {
	usernameField: 'email',
}

const localLogin = new LocalStrategy(
	localOptions,
	async (email, password, done) => {
		try {
			const user = await User.findOne({ email: email })

			if (!user) {
				return done(null, false)
			}
			const validPassword = await bcrypt.compare(password, user.password)

			if (!validPassword) done(null, false)

			return done(null, user)
		} catch (error) {
			return done(error)
		}
	}
)

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret,
}

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
	try {
		const user = await User.findById(payload.sub)

		if (user) {
			done(null, user)
		} else {
			done(null, false)
		}
	} catch (error) {
		return done(error, false)
	}
})

passport.use(jwtLogin)
passport.use(localLogin)
