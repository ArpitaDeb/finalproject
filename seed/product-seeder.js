var Product = require('../models/products');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');
var products = [new Product ( {
id:'starter1',
imagePath: 'img/starter1.jpg',
name:' Vietnamese grilled beef spring roll',
description:'Ingredients: Beef, rice flour, Corriander, served with fish sauce',
price:5}),
new Product ( {
    id:'starter2',
    imagePath: 'img/starter2.jpg',
    name:' Vietnamese steamed rice roll',
    description:'Ingredients: Rice roll, ground pork, mushroom, served with fish sauce and Vietnamese Sausage',
    price:5}),
new Product ( {
    id:'starter3',
    imagePath: 'img/starter3.jpg',
    name:' Vietnamese Crispy Pancakes',
    description:'Ingredients: Rice flour, shrimp, pork, green bean, served with lettuce and fish sauce',
    price:5}),    
new Product ( {
    id:'starter4',
    imagePath: 'img/starter4.jpg',
    name:' Vietnamese fried spring roll',
    description:'Ingredients: Carrot, onion, cabbage, shrimp, pork, green bean, served with lettuce and fish sauce',
    price:5}), 
new Product ( {
    id:'starter5',
    imagePath: 'img/starter5.jpg',
    name:' Vietnamese Vegetable roll',
    description:'Ingredients: Lettuce, Grilled Beef, Carrot, served with mustard  ',
    price:5}), 
new Product ( {
    id:'starter6',
    imagePath: 'img/starter6.jpg',
    name:' Vietnamese fresh summer roll',
    description:'Ingredients: Rice paper,Lettuce, Pork, Shrimp, Egg, Carrot, served with fish sauce or Chilli sauce or bean sauce  ',
    price:5}), 
    new Product ( {
        id:'starter7',
        imagePath: 'img/starter7.jpg',
        name:' Vietnamese BBQ beef roll',
        description:'Ingredients: Grilled Special Vietnamese vegetable, Beef and served with Chilli sauce',
        price:5}),     
new Product ( {
    id:'starter7',
    imagePath: 'img/starter7.jpg',
    name:' Vietnamese BBQ beef roll',
    description:'Ingredients: Grilled Special Vietnamese vegetable, Beef and served with Chilli sauce',
    price:5}),  
new Product ( {
    id:'starter8',
    imagePath: 'img/starter8.jpg',
    name:' Vietnamese combo roll',
    description:'The choice of 3 different rolls',
    price:5}),  
new Product ( {
    id:'starter9',
    imagePath: 'img/starter9.jpg',
    name:' Vietnamese lotus salad',
    description:'Lotus, shrimp, pork with vinegar, carrot, onion and corriander',
    price:5}),  
new Product ( {
    id:'starter10',
    imagePath: 'img/starter10.jpg',
    name:' Vietnamese Mango salad',
    description:'Mango, shrimp, pork with vinegar, carrot, onion and corriander',
    price:5}),         
];
var done =0 ;
for (i=0;i<products.length;i++){
    done++
    products[i].save(function(err,result) {
    if (done == products.length){
        exit();
    }
});

}
function exit () {
    mongoose.disconnect();
}

