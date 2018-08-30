module.exports = function Cart(oldCart) { // add oldCart in order to add products to existing cart
    this.items= oldCart.items || {}; //cart should have items as array, if cart is not existing, paste empty objects, otherwise retrieve the old cart
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.add = function(item,id) {
        //check if new item is already existing in the old cart
        var storedItem = this.items[id]; //item here is the object
        if (!storedItem) {
            //create a new one
            storedItem = this.items[id] = {item: item, qty:0, price:0};
        }
            storedItem.qty++
            storedItem.price =storedItem.item.price*storedItem.qty;
            storedItem.priceunit = storedItem.item.price;
            storedItem.description= storedItem.item.description;
            storedItem.image= storedItem.item.imagePath;
            this.totalQty++;
            this.totalPrice +=storedItem.item.price;
        };
    this.generateArray = function(){ //tranform the items in cart into array in order to display
        var arr =[];
        for (var id=[] in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
    };

