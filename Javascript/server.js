const { application } = require('express')
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('../model/user.js')
const bcrypt = require('bcryptjs')
const http = require('http')
const url = require('url')
const fs = require("fs")

const server = http.createServer(function (req, res) {
    const url = req.url;
    if (url === '/style.css') {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      fs.createReadStream(__dirname + "/style.css", "utf8").pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(__dirname + "/index.html", "utf8").pipe(res);
    }
  })

mongoose.connect('mongodb://localhost:27017/COMP-324-Travel-Itinerary-App', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
})
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'HTML')))
app.use(express.static('HTML'))
//app.use('/', express.static('HTML'))
app.use('/', express.static(path.join(__dirname, 'CSS')))
app.use(express.static('CSS'))
//app.use('/', express.static('CSS'))

/* app.get('/hello', (req, res) => {
  res.send('Hi!')
}) */

app.post('/api/login', async (req, res) => {
    res.json({ status: 'ok' })
})
app.post('/api/signup', async (req, res) => {
    console.log(req.body)
    const { fullName, emailAddress, username, password: plainTextPassword, confirmPassword } = req.body

    // validates full name
    if (!fullName || typeof fullName != 'string') {
        return res.json( {status: 'error', error: 'Invalid name'})
    }

    // validates username
    if (!username || typeof username !== 'string') {
        return res.json( {status: 'error', error: 'Invalid username'} )
    }

    // validates email address
    if (!emailAddress || typeof emailAddress !== 'string') {
        return res.json( {status: 'error', error: 'Invalid email address'} )
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json( { status: 'error', error: 'Invalid password'} )
    }

    if (plainTextPassword.length < 7) {
        return res.json( { status: 'error', error: 'Password is not long enough. Please enter a password between 7-15 characters.'} )
    }

    if (plainTextPassword.length > 15) {
        return res.json( { status: 'error', error: 'Password is too long. Please enter a password between 7-15 characters.'} )
    }

    if (plainTextPassword !== confirmPassword) {
        return res.json( { status: 'error', error: 'Passwords do not match.'})
    }

    const password = await bcrypt.hash(password, 10)

    try {
        const response = await User.create({
            fullName,
            emailAddress,
            username,
            password
        })
        console.log("User created successfully: ", response)
    } catch(error) {
        // duplicate key
        if (error.code === 11000) {
            return res.json( {status: 'error', error: 'Username or email address already in use' })
        }
        throw error
        
    }
    //console.log(await bcrypt.hash(password, 10))
    res.json({status: "ok"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

