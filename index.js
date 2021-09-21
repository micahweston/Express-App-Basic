// This app is designed for a simple database usage with mongoDB and Mongoose. There are basic CRUD operations completed.
// New items are async functions to allow for awaiting. No error handling in app as of this moment.


// requires for app
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');

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
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

// View Products from database.
app.get('/products', async (req, res) => {
    // We do this because the Product.find() will take a while. So we want to make sure we wait and then respond.
    const {category} = req.query;
    if(category) {
        const products = await Product.find({category: category});
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }
    
})

// Create new item form
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

// Create new item in database useing create new form.
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

// Read item in database
app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    // We are using Mongoose to search by ID in our DB.
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', { product });
})

// Edit item in database form
app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    // We are using Mongoose to search by ID in our DB.
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

// Update item in database useing above form
app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${updateProduct._id}`);
})

// Delete request for database.
app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log("APP IS LISTENING PORT 3000");
})