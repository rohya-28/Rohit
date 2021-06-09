import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'
import { initAdmin } from './admin'


let addtocart = document.querySelectorAll('.add-to-cart')
let cartcounter = document.querySelector('#cartcounter')

function updatecart(thali) {
    axios.post('/update-cart',thali).then(res => {
     
        cartcounter.innerText = res.data.totalqty
        new Noty ({
            type:'success',
            timeout:1000,
            progressBar:false,
            text:'Items added to cart'
        }).show();        
        }).catch(err => {
        new Noty ({
            type:'error',
            timeout:1000,
            progressBar:false,
            text:'something went wrong'
        }).show();  
    })
}

       addtocart.forEach((btn) =>{
             btn.addEventListener('click',(e)=>{
             let thali= JSON.parse(btn.dataset.thali)
             updatecart(thali)
       ;
       
    })
})

//Remove alert message after X seconds
 const alertMsg = document.querySelector('#success-alert')
 if(alertMsg) {
     setTimeout(() =>{
         alertMsg.remove()
     },2000)
 }
 
 


 //Change order status
let statuses =document.querySelectorAll('.status_line') 
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value:null
order = JSON.parse(order)
let time = document.createElement('small')


function updatestatus(order){
//step completed 
statuses.forEach((status)=>{
    status.classList.remove('step-completed')
    status.classList.remove('current')
})


let stepcompleted = true;
statuses.forEach((status) => {
let data = status.dataset.status
if (stepcompleted) {
    status.classList.add('step-completed')
}
if (data === order.status) {
    stepcompleted = false
    time.innerText = moment(order.updatedAt).format('hh:mm A')
    status.appendChild(time)
    if (status.nextElementSibling) {
    status.nextElementSibling.classList.add('current')
}
}
})
}
 updatestatus(order)


//Socket

let socket = io()

//Join

   if(order)
     {
    socket.emit('join',`order_${order._id}`)//order__orderid is here like jdjfbfbsihfsr855dd
     }

//Check the path is admin or not     
    let adminAreaPath = window.location.pathname
    if(adminAreaPath.includes('admin'))
     {
    socket.emit('join','adminRoom')    
    initAdmin(socket)
     }         

//Event Recieve here
      
    socket.on('orderUpdated',(data) => {
      const updatedOrder = { ... order }  
      updatedOrder.updatedAt = moment().format()
      updatedOrder.status = data.status
      updatestatus(updatedOrder)
      new Noty ({
        type:'success',
        timeout:1000,
        progressBar:false,
        text:'Order Updated'
    }).show();  
    })
    
    




