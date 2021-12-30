const localStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')


  function initialize(passport,getUserByEmail,getUserById){

    const AuthenticateUSer= async (email,password,done)=>{
        const user=getUserByEmail(email)
        if (user==null) {
            return done(null,false,{message:'No user with that email'})
        }
        try {
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null,false,{message:'incorect password'})
            }
        } catch (err) {
            return done(err)
        }
    }

    passport.use(new localStrategy({ usernameField:'email'},AuthenticateUSer))
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser((id,done)=>done(null,getUserById(id)))
}

module.exports =initialize