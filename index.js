
//var cookieParser = require('cookie-parser');
var csrf = require ('csurf');
//var bodyParser = require('body-parser');
const express = require('express');
var session = require('express-session')
var csrfProtection =csrf();

const app = express();

//set up mongo db
var mongoose = require('mongoose');
const MongoClient=require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/shopping';

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static('img'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: "false"}));
//app.use(cookieParser);
app.use(session({
  secret:'mysupersecret', resave: false, saveUninitialized:false
}));
app.use(csrfProtection);




app.get('/', (req, res) => {
  res.render('index', { title: 'Vietnamese Corner', h1: 'HOME' });
});

app.get('/signup',(req, res,next) => {
  res.render('signup', {csrfToken: req.csrfToken() })
});

app.post('/signup',(req, res,next) => {
  res.redirect('/');
});
//pull menu images from database
app.get('/menu', (req, res) => {
  MongoClient.connect(url, function(err, client) {
  const db = client.db('shopping');
  const productCollection = db.collection('products');
  productCollection.find({}).toArray((error, documents) => {
    client.close();
  res.render('menu', { title: 'Vietnamese Corner - MENU', products:documents });
    });
  });
});

app.get('/subscribe', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    const db = client.db('products');
    const subscriptionCollection = db.collection('subscription');
      //get data from subscription form
    var phone=req.query.phone;
    var email=req.query.email;
    const doc = {'phone number':phone,'email':email,'subscribe_date':'Aug-14-2018'};
    // write the new subscription to db
    subscriptionCollection.insertOne(doc,(err, result)=>{
      res.render('subscribe', { title: 'Vietnamese Corner - SUBSCRIPTION', phone: phone, email: email });
    });
  });
});


/*
app.post('/subscribe', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    const db = client.db('products');
    const subscriptionCollection = db.collection('subscription');
      //get data from subscription form
    
    const doc = {'phone number':3062021090,'email':'giang@test.com','subscribe_date':'Aug-14-2018'};
    // write the new subscription to db
    subscriptionCollection.insertOne(doc,(err, result)=>{
      res.render('subscribe', { title: 'Vietnamese Corner - SUBSCRIPTION', phone: phone, email: email });
    });
  });
});
*/

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Vietnamese Corner - CONTACT US', h1: 'CONTACT US' });
});
app.get('/about', (req, res) => {
  res.render('about', { title: 'Vietnamese Corner - ABOUT US', h1: 'ABOUT US' });
});
app.get('/diy', (req, res) => {
  res.render('diy', { title: 'Vietnamese Corner - RECIPES', h1: 'RECIPES CORNER' });
});
app.listen(3000);