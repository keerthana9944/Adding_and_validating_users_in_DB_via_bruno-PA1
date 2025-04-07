const express = require('express');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const { resolve } = require('path');
const User = require('./model/user');


const app = express();
app.use(express.json());
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log("Connected Successfully"))
  .catch((err) => console.error("Connection failed", err))

app.post('/register', async(req, res) => {
  const {username, email, password} = req.body;

  if(!username || !email || !password){
    return res.status(400).json({message: "Field cannot be empty"});
  }

  try{
    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username, email, password: hashedpassword,
    });

    await newUser.save();

    res.status(201).json({message: "Registered successfully"});
  }

  catch(error){
    console.error("Registration error", error);
    res.status(500).json({message: "Registration failed"});
  }
});