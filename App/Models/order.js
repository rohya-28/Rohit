const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
             customerid:{
   type:mongoose.Schema.Types.ObjectId,
   ref:'User',
   required:true
             },
 items:{ type:Object,required:true},
 phone:{type:String,required:true},
 address:{type:String,required:true},
 payment:{type:String,default:'COD'},
 status:{type:String,default:'ORDER_PLACED'},

}, {timestamps:true })

module.exports = mongoose.model('Order',orderSchema)