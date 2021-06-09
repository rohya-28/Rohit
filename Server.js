require('dotenv').config()

const express = require ('express'); //This will Import Express.js in our app.

const app = express(); //To call express.js

const ejs =require('ejs');

const passport = require('passport');

const expressLayoutes = require('express-ejs-layouts');

const path = require('path');

const session = require('express-session');

const flash = require('express-flash');

const Noty =require('noty');

const PORT = process.env.PORT || 3000 ;//To set PORT

const mongoose = require('mongoose');

const MongoStore = require('connect-mongo');

const Emitter = require('events')


//Database

mongoose.connect(process.env.MONGO_CONNECTION_URL,
  {useNewUrlParser:true, useCreateIndex:true, useFindAndModify:true,useUnifiedTopology:true});

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('Database connected');
}).catch(err =>{
    console.log('connnecton failed');
});

//Event-emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

//session-config 
  app.use(session( {
      secret: process.env.COOKIE_SECRET,
      resave: false,
      store: MongoStore.create({
      mongoUrl:process.env.MONGO_CONNECTION_URL
      }),
      saveUninitialized: false,
      cookie: { maxAge : 1000 * 60 * 60 * 24 } //here we calculate cookie life 
      } ))

//passport config
const passportInit = require('./App/Config/passport');
const { Server } = require('http');
const { Socket } = require('dgram');
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));
app.use(express.json())

//global middleware
app.use((req,res,next) => {
res.locals.session =  req.session
res.locals.user = req.user
next()
})

//Set Template Engine
app.use(expressLayoutes);
app.set('views',path.join(__dirname,'/Resources/Views'));
app.set('view engine','ejs');

require('./Routes/Web')(app)
app.use((req,res) =>{
  res.status(404).render('404')
})

const server = app.listen(PORT,()=> {
 console.log(`Server is online on ${PORT}`);
})

//Socket Setup 
const io = require('socket.io')(server)
io.on('connection',(socket) => {
     //Join
     socket.on('join',(orderId) => {
     socket.join(orderId)
  })
})


//Here we recieve Emit
eventEmitter.on('orderUpdated',(data) => {
  io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderplaced',(data) =>{
  io.to(`adminRoom`).emit('orderplaced',data) 
})