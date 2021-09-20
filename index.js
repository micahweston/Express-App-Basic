// requires for app
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product');

// this tells us where to find the database, and also what DB to work with.
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// All connection items for express.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// first simple path to test.
app.get('/dog', (req, res) => {
    res.send('WOOF!');
})

app.listen(3000, () => {
    console.log("APP IS LISTENING PORT 3000")
})