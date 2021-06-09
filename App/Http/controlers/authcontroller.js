const User = require('../../Models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authcontroller()
{
    const _getRedirectUrl = (req) => 
    {
        return req.user.role === 'Admin' ? '/admin/orders' : '/customers/orders'
    } 
  
    return {
        
    login(req,res)
    {
          res.render('auth/login')
    },
        
    postlogin(req, res, next) {
      const { email, password }   = req.body
     // Validate request 
      if(!email || !password) {
          req.flash('error', 'All fields are required')
          return res.redirect('/login')
      }
      passport.authenticate('local', (err, user, info) => {
          if(err) {
              req.flash('error', info.message )
              return next(err)
          }
          if(!user) {
              req.flash('error', info.message )
              return res.redirect('/login')
          }
          req.logIn(user, (err) => {
              if(err) {
                  req.flash('error', info.message ) 
                  return next(err)
              }
              req.flash("success", "Logged in successfully");
              return res.redirect(_getRedirectUrl(req))
          })
      })(req, res, next)
  },
        
             register(req, res) {
             res.render('auth/register')
                            },
          async postregister(req, res) {
          const { name, email, password }   = req.body
       // Validate request 
           if(!name || !email || !password) {
           req.flash('error', 'All fields are required')
           req.flash('name', name)
           req.flash('email', email)
          return res.redirect('/register')
       }
          
          //check if email exist 
          User.exists({email:email},(err,result)  => {
          if(result){
            req.flash('error','Email Already Taken')
            req.flash('name',name)
            req.flash('email',email)
            return res.redirect('/register')
          }
          })
  
        //hash passwords
        const hashPasswords= await bcrypt.hash(password,10)

        //create a user
        const user = new User({
            name,
            email,
            password:hashPasswords
          })
            
         user.save().then((user) => {
         //login 
         return res.redirect('/')
          }).catch(err => {
            req.flash('error','something went wrong')
          })
     
          },
          logout(req,res) {
           req.logout()
           req.flash("success", "Loggout successfully");
           return res.redirect('/login')
          }
    }
}

module.exports = authcontroller