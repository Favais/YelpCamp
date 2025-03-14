const express = require('express');
const app = express()
const morgan = require('morgan')

app.use(morgan('dev'))
app.use((req, res, next) => {
    console.log('This is my first middleware')
    next()
})