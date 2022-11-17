const { application } = require('express')
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
//const User = require('../model/user.js')
const bcrypt = require('bcryptjs')
const http = require('http')
const url = require('url')
const fs = require("fs")
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'epiurfgiwfbjwdsfiuwqopqsm'


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

  const userSchema = mongoose.Schema({
      fullName: {type: String, required: true, unique: false},
      emailAddress: {type: String, required: true, unique: true},
      username: {type: String, required: true, unique: true},
      password: {type: String},
      confirmPassword: {type: String}
  },
  { collection: 'User_Accounts'} 
  )
  
  const userModel = mongoose.model('UserSchema', userSchema)
  
  module.exports = userModel


mongoose.connect('mongodb+srv://PragyaK:772492@travelitineraryaccounts.yalqnry.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
}, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log("Successfully connected to database")
    }
})



app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'HTML')))
app.use(express.static('HTML'))
//app.use('/', express.static('HTML'))
app.use('/', express.static(path.join(__dirname, 'CSS')))
app.use(express.static('CSS'))
//app.use('/', express.static('CSS'))


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({ username }).lean()

    if(!user) {
        return res.json({ status: 'error', error: 'Invalid username/password1' })
    }

    if(await bcrypt.compare(password, user.password)) {
        // the username password combo is successfull
        alert("pp")
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username
            }, 
            JWT_SECRET 
        )

        return res.json({ status: 'ok', data: token })
    }
    

    res.json({ status: 'error', error: 'Invalid username/password2' })
})



app.post('/api/signup', async (req, res) => {
    //console.log(req.body)
    //formData(req.body);
    
    const { fullName, emailAddress, username, password: plainTextPassword, confirmPassword } = req.body

    console.log("plain text password: " + plainTextPassword);
    console.log("confirm password: " + confirmPassword);

    // validates full name
    if (!fullName || typeof fullName !== 'string') {
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

    
    const encryptedPassword = await bcrypt.hash(plainTextPassword, 10)
    console.log("encryptedPassword: " + encryptedPassword);


    const user = new userModel(req.body);
    try {
        /*
        const response = await userModel.create({
            fullName,
            emailAddress,
            username,
            plainTextPassword
        }) */
        await user.save();
        console.log("User saved successfully: ", res)
        console.log("response: " + res)
    } catch(error) {
        // duplicate key
        if (error.code === 11000) {
            return res.json( {status: 'error', error: 'Username or email address already in use' })
        }
        console.log("error: " + error)
        throw error
        
    }
    


    //console.log(await bcrypt.hash(password, 10))
    res.json({status: "ok"})
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


