const express = require('express')
const mongoose = require('mongoose');
const methodOverride=require("method-override")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const listingRouter=require('./routes/listing.js');
const path=require("path")
const flash=require("connect-flash");
const ejsMate=require("ejs-mate");
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
const ExpressError=require("./utils/ExpressError.js")
const ReviewRouter=require('./routes/review.js');
//const listings=require("./models/listing.js")
//const reviews=require("./models/review.js")
const session=require("express-session")
const{reviewSchema, listingSchema}=require("./schema.js")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require('./routes/user.js');

main()
 .then(()=>{
    console.log("connected to db");
 })
 .catch((err)=>{
    console.log(err);
 });
async function main(){
    await mongoose.connect(MONGO_URL);
}

const app = express()
const port = 3000

const sessionOptions={
  secret:"mysupersecret",
  resave:false,
  saveUninitialized:true
};

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;

  console.log(res.locals.success);
  next();
});
// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"tera-baap",
//   });
//   let registeredUser=await User.register(fakeUser,"12345");
//   res.send(registeredUser);
// })

app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",ReviewRouter);
app.use("/",userRouter);



app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not Found!"));
});


app.use((err,req,res,next)=>{
  let {statusCode=500,message="Wrong"}=err;
 //res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})