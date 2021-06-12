const homecontroller = require('../App/Http/controlers/homecontroller');

const authcontroller = require('../App/Http/controlers/authcontroller');//That Was Controllers

const ordercontroller = require('../App/Http/controlers/customers/ordercontroller');

const adminordercontoller = require('../App/Http/controlers/admin/ordercontroller');

const Statuscontroller = require('../App/Http/controlers/admin/statuscontroller');

const list = require('../App/Http/controlers/list');

const cartcontroller = require('../App/Http/controlers/customers/cartcontroller');//Came from controllers

//middleware
const guest = require('../App/Http/middlewares/guest');
const auth = require('../App/Http/middlewares/auth');
const admin = require('../App/Http/middlewares/admin');

function initRoutes(app) {
   
    app.get('',homecontroller().index);

     app.get('/items',list().index);

    app.get('/cart',cartcontroller().index);
    
    app.get('/login',guest,authcontroller().login)

    app.post('/login',authcontroller().postlogin)
    
    app.get('/register',guest,authcontroller().register);//This function came from controllers from respective file  

    app.post('/register',authcontroller().postregister)

    app.post('/logout',authcontroller().logout)
    
    app.post('/update-cart',cartcontroller().update);

    //Cutomer routes
    app.post('/orders',auth,ordercontroller().store)
    app.get('/customers/orders',auth,ordercontroller().index)
    app.get('/customers/orders/:id',auth,ordercontroller().show)


    //admin routes
    app.get('/admin/orders',admin,adminordercontoller().index)
    app.post('/admin/orders/status',admin,Statuscontroller().update)

 }

 module.exports = initRoutes
