const Order =  require('../../../Models/order')

function ordercontoller(){
    return{
        index(req,res){
            Order.find({status:{ $ne: 'completed'}}, null ,{sort:{'createdAt': -1}}).
            populate('customerid','-password').exec((err,orders) => {
               if(req.xhr)
               {
               return  res.json(orders)
               }
               return res.render('admin/orders')
            })
        }
    }
}
module.exports = ordercontoller