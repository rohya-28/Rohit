const Order = require('../../../Models/order')

function statuscontroller() {
    return{
        
        update(req,res){
           
        Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>
        {
         if(err)   
         {
            return   res.redirect('/admin/orders')
         } 
         //Emit event
          const eventEmitter = req.app.get('eventEmitter')//here we import emitter from server.js
          eventEmitter.emit('orderUpdated', {id:req.body.orderId,status:req.body.status})
           
          return   res.redirect('/admin/orders')
        })
       }
    }
}

module.exports =statuscontroller