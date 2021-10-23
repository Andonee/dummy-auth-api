const express = require('express')
const morgan = require('morgan')
const router = require('./routers/router')
const mongoose = require('mongoose')
const passport = require('passport')

const app = express()

app.use(morgan('combined'))
app.use(express.json())
app.use(passport.initialize())
app.use('/', router)

const port = process.env.PORT || 5000

mongoose.connect(
	process.env.DB_CONNECTION || 'mongodb://localhost/auth',
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => console.log('connected to DB')
)

app.listen(port, () => console.log('Listening at port ' + port))
