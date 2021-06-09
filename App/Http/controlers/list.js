const Menu = require('../../Models/menu')

function list(){
    return {
       async  index(req,res){
         const thalis  = await Menu.find()
         return res.render('items', { Wepons: thalis})
         
          //  Menu.find().then(function(max) {
          //    console.log(max)
          //    return res.render('home', { Wepons: max})//here key is max so we pass this key to home
          //})
        }
    }
}
module.exports = list
