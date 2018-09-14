
//var cookieParser = require('cookie-parser');
//var csrf = require ('csurf');
var bodyParser = require('body-parser');
const express = require('express');
var Cart= require('./models/cart');
var Product= require('./models/products');
var Order= require('./models/order');
var Inquiry = require('./models/inquiry');
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
 
  failureRedirect:'/signup',
  failureFlash: true})
,function(req,res,next){
  if(req.session.oldUrl){
    var oldUrl =req.session.oldUrl;

   
    res.redirect(req.session.oldUrl);
    req.session.oldUrl =null;
  }
  else{
    res.direct('/profile');
  }
});

app.get('/profile',(req, res,next) => {
  Order.find({user:req.user},function(err,orders){
    if(err){
      return res.write(error);
    }
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('profile',{ title: 'Vietnamese Kitchen - Profile', orders: orders});
   
  });
  
});
app.get('/signin',(req, res,next) => {
  if(!req.isAuthenticated()){
  var messages= req.flash('error');
  res.render('signin', {messages: messages, hasErrors: messages.length >0}); 
  }
  else {
    res.redirect('/profile');
  }
});

app.post('/signin', passport.authenticate('local.signin',{
  failureRedirect:'/signin',
  failureFlash: true
}),function(req,res,next){
  if(req.session.oldUrl){
    var oldUrl =req.session.oldUrl;
    
    res.redirect(req.session.oldUrl);
    req.session.oldUrl =null;
  }
  else{
    res.redirect('/profile');
  }
});

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
  var  successMsg =req.flash('success');
  if(!req.session.cart) {
    res.render('shopping', { products: null, successMsg: successMsg});
  }
  else{
  var cart = new Cart (req.session.cart);
  res.render('shopping',{products: cart.generateArray(),totalPrice: cart.totalPrice, successMsg: successMsg});
  }
});
//add new quantity to the shopping cart
app.get('/addone/:id', function(req,res,next){
  var productID = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items: {}}); //check if the cart is existing, if not existing, paste an empty object
 Product.findById(productID, function(err,product){
    if (err) {
      return res.redirect('/');
      console.log('Fail');
    }
    cart.add(product, product.id);
    req.session.cart= cart;
    console.log(req.session.cart);
    res.redirect('/shopping');
  })
});
//remove quantity in the shopping cart
app.get('/removeone/:id', function(req,res,next){
  var productID = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items: {}}); //check if the cart is existing, if not existing, paste an empty object
 Product.findById(productID, function(err,product){
    if (err) {
      return res.redirect('/');
      console.log('Fail');
    }
    cart.remove(product, product.id);
    req.session.cart= cart;
    console.log(req.session.cart);
    res.redirect('/shopping');
  });
});
//check-out page
app.get('/checkout', isLoggedIn, function(req,res,next){
  if(!req.session.cart) {
    res.redirect('shopping', { products: null});
  }
  var errMsg= req.flash('error')[0];
  var cart = new Cart (req.session.cart);
 
  res.render('checkout', {products: cart.generateArray(),totalPrice: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});
//post checkout page

app.post('/checkout',isLoggedIn, function(req,res,next) {

  if(!req.session.cart) {
    res.redirect('shopping', { products: null});
  }
  var cart = new Cart (req.session.cart);
  var stripe = require("stripe")("sk_test_qoQtbGhMjEzdFytyPuRPRkTc");
  var token = req.body.stripeToken; // Using Express
  console.log(token);
  console.log(req.body);
  charge = stripe.charges.create({
  amount: cart.totalPrice*100,
  currency: 'cad',
  description: 'charge from VNMESE',
  source: token,
  capture: false,
},function(err,charge){
  if (err){
    var messages= req.flash('error');
    
    req.flash('error',err.message);
  return res.redirect('/checkout');
}
  else {
    var order= new Order({
      user:req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentID: charge.id

    });
    order.save(function(err,result){
    var successMsg = req.flash('success', 'Successfully bought product');
    req.session.cart = null;
    res.redirect('/shopping');
  });
  }
});


});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/signin');

});
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Vietnamese Corner - CONTACT US', h1: 'CONTACT US' });
});
app.post('/inquiry',(req,res)=>{
  var inquiry = new Inquiry ({
    name: req.body.name,    
    email: req.body.email, 
    message: req.body.message
  });
  inquiry.save(function(err,result){
    var successMsg = req.flash('success','Thank you for message. We will contact you shortly. ')
    res.render('inquiry',{successMsg: 'Thank you for message. We will contact you shortly. '});
    console.log(inquiry);
  })

});
app.get('/about', (req, res) => {
  res.render('about', { title: 'Vietnamese Corner - ABOUT US', h1: 'ABOUT US' });
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/signin');
}
function notLoggedIn (req,res,next){
  if(!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
}

app.listen(3000);