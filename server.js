'use strict'

const express = require('express')
const { json, urlencoded } = require('body-parser')

// Init
const app = express()

// Middleware
app.use(json())
app.use(urlencoded({ extended: true }))

// Routes
const eRouter = require('./routes/route')
app.use('/', eRouter)

module.exports = app