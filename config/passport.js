var passport = require('passport');
var User = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){ //how to store user in the session
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});
//create user, calll db to check if email is existed
passport.use('local.signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req,email,password,done){
    //validation email
    req.checkBody('email','Invalid email').notEmpty().isEmail(); //check if email fail is empty
    //validate password
    req.checkBody('password','Invalid Password').notEmpty().isLength({min:4}); //check if email fail is empty and length >=4
    var errors = req.validationErrors();
    if (errors) {
        var messages =[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    
    }
    User.findOne({'email':email}, function(err,user){
        if(err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message:'Email is already in use'});
        }
        var newUser = new User();
      
       // newUser.address= address;
        newUser.email= email;
       // newUser.phone= phone;
     //   newUser.fullname= fullname;
        newUser.password= newUser.encryptPassword(password); //need encript    
        newUser.save(function(err,result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        });

    });
}));
//Sign-in strategy
passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    //validation email
    req.checkBody('email','Invalid email').notEmpty().isEmail(); //check if email fail is empty
    //validate password
    req.checkBody('password','Invalid Password').notEmpty(); //check if email fail is empty and length >=4
    var errors = req.validationErrors();
    if (errors) {
        var messages =[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    
    }
    User.findOne({'email':email}, function(err,user){
        if(err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message:'User is not found'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message:'Wrong password'});
        }
        return done(null,user)
        
    });
}));