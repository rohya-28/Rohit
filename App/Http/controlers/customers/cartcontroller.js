const { update } = require("../../../Models/menu")

function cartcontroller(){
    return {
        index(req,res){
          res.render('customers/cart')
        },
        update(req,res) {
        //  let cart = {
        //  items:{
        //   thalis:{items:thalisobject,qty:0},
        //  },
        //  totalqty:0,
        //  totalprice:0
        //  }

        //for first time creatinfg cart and adding basic object structure
        if(!req.session.cart){
          req.session.cart={
            
            items: {},
            totalqty:0,
            totalprice:0
          }
          
        }
        let cart = req.session.cart
         
    
        //check if items does not exist in cart
          if(!cart.items[req.body._id]){
            cart.items[req.body._id] = {
            item: req.body,
            qty:1
            }
            cart.totalqty= cart.totalqty+1;
            cart.totalprice=cart.totalprice+req.body.price
          }else{
            cart.items[req.body._id].qty =   cart.items[req.body._id].qty+1;
            cart.totalqty = cart.totalqty+1;
            cart.totalprice=cart.totalprice +req.body.price
          }
          return res.json({totalqty:req.session.cart.totalqty})
        
        }
    }
}

module.exports = cartcontroller