const Order = require('../../../Models/order')
const moment = require('moment')

function ordercontoller () 
{
    return {
        store(req,res)
        {
        //validate request
        const {phone,address} = req.body
        if( !phone || !address)
        {
            req.flash('error','All Filds Are Required')
            return res.redirect('/cart')
        }
        const order = new Order({
            customerid:req.user._id,
            items:req.session.cart.items,
            phone:phone,
            address:address
        })

        //This function store the orders in Db
           order.save().then(result =>{
           Order.populate(result, {path: 'customerid'},(err,placedorder) => {

           req.flash('success','order sucessfully placed')

           //Emit 
           const eventEmitter = req.app.get('eventEmitter')
           eventEmitter.emit('orderplaced',placedorder)
          
           delete req.session.cart
          
           return res.redirect('/customers/orders')
           })    
           
        }).catch(err => {
           req.flash('error','somthing went wrong')
           return res.redirect('/cart')
        })
    },
         //This function check order of particular customer in DB
         async index(req,res)
        {
          const orders = await Order.find({customerid: req.user._id},null,{sort:{'createdAt':-1}})
          res.render('customers/orders',{orders:orders,moment})
        },
         async show(req,res){
         const order = await Order.findById(req.params.id) 
         //Authorize user
         if (req.user._id.toString() === order.customerid.toString()) {
          return  res.render('customers/singleorder', {order})
         }
         else{
             res.redirect('/')
         }
        }

    }
}
module.exports = ordercontoller