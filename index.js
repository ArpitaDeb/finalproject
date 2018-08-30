
//var cookieParser = require('cookie-parser');
//var csrf = require ('csurf');
var bodyParser = require('body-parser');
const express = require('express');
var Cart= require('./models/cart');
var Product= require('./models/products');
var session = require('express-session')
//var csrfProtection =csrf();
var passport = require('passport');
var flash = require('connect-flash');
var validator =require('express-validator'); //install express validator to do form validation
var MongoStore =  require('connect-mongo')(session);


const app = express();

//set up mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');
require('./config/passport'); //run config file to get local strategy

const MongoClient=require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/shopping';
//const db = client.db('shopping');
//const productCollection = db.collection('products');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static('img'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: "false"}));
app.use(validator());//need to start after body parser starts
//app.use(cookieParser);
app.use(session({
  secret:'mysupersecret',
  resave: false, 
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180 * 60 *1000}
  }));


app.use(passport.initialize());
app.use(passport.session());
//app.use(csrfProtection);
app.use(flash())
app.use(function(req,res,next){
  res.locals.login =req.isAuthenticated;
  res.locals.session = req.session;
  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Vietnamese Corner', h1: 'HOME' });
});

app.get('/signup',(req, res,next) => {
 var messages= req.flash('error');
  res.render('signup', {messages: messages, hasErrors: messages.length >0}); //, {csrfToken: req.csrfToken() }
});

app.post('/signup', passport.authenticate('local.signup',{
  successRedirect: '/profile',
  failureRedirect:'/signup',
  failureFlash: true
}));

app.get('/profile',(req, res,next) => {
  res.render('profile',{ title: 'Vietnamese Kitchen - Profile', h1: 'HOME' });
});
app.get('/signin',(req, res,next) => {
  var messages= req.flash('error');
  res.render('signin', {messages: messages, hasErrors: messages.length >0}); 
});

app.post('/signin', passport.authenticate('local.signin',{
  successRedirect: '/profile',
  failureRedirect:'/signin',
  failureFlash: true
}));

//pull menu images from database
app.get('/menu', (req, res) => {
  MongoClient.connect(url, function(err, client) {
  const db = client.db('shopping');
  const productCollection = db.collection('products');
  productCollection.find({}).toArray((error, documents) => {
    client.close();
  res.render('menu', { title: 'Vietnamese Kitchen - MENU', products:documents });
    });
  });
});
// add to cart
app.get('/add-to-cart/:id', function(req,res,next){
  var productID = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items: {}}); //check if the cart is existing, if not existing, paste an empty object
 Product.findById(productID, function(err,product){
    if (err) {
      return res.redirect('/');
      console.log('Fail');
    }
    cart.add(product, product.id);
    cart.generateArray();
    req.session.cart= cart;
    console.log(req.session.cart);
    res.redirect('/menu');
  })
});
app.get('/shopping', (req, res) => {
  if(!req.session.cart) {
    res.render('shopping', { products: null});
  }
  var cart = new Cart (req.session.cart);
    res.render('shopping',{products: cart.generateArray(),totalPrice: cart.totalPrice});

});
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Vietnamese Corner - CONTACT US', h1: 'CONTACT US' });
});
app.get('/about', (req, res) => {
  res.render('about', { title: 'Vietnamese Corner - ABOUT US', h1: 'ABOUT US' });
});

app.listen(3000);