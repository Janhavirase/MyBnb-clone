const express = require('express')
const router=express.Router()
const{reviewSchema, listingSchema}=require("../schema.js")
const ExpressError=require("../utils/ExpressError.js")
const Listing=require('../models/listing.js');
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");






//index route 
router.get("/",listingController.index);


    
    //new route
    router.get("/new",isLoggedIn,(req,res)=>{
    
      res.render("listings/new.ejs")
    })
    //show route
    router.get("/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
    req.flash("error","Listing is not accessed ");
    return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
    })

    
//create route
// router.post("/",isLoggedIn,,
//   async(req,res,next)=>{
//   try{
//    let result= listingSchema.validate(req.body);
//    console.log(result)
//     // if(!req.body.listing){
//     //   throw new ExpressError("Please fill in all fields",400)
//     // }
//   const newListing= new Listing(req.body.listing);
    // if(!newListing.description){
    //   throw new ExpressError(400,"Description is missing")
    // }

    // if(!newListing.title){
    //   throw new ExpressError(400,"Title is missing")
    // }
    
    //   await newListing.save();
    //   req.flash("success","successfully created new listing")
    //   res.redirect("/listings");
    
    //   }catch(err){
    //     next(err);
    //   }
    // })

    // if(!newListing.location){
      //   throw new ExpressError(400,"Location is missing")
    // }
    router.post("/", isLoggedIn, validateListing, async (req, res, next) => {
    try {
        let listingData = req.body.listing;

        // If image is empty, set default
        if (!listingData.image || !listingData.image.url) {
            listingData.image = {
                filename: 'listingimage',
                url: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/b59662108905525.5fc7daef9a20e.jpg'
            };
        }

        const newListing = new Listing(listingData);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "Successfully created new listing");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,async(req,res)=>{
  let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing is not accessed ");
    res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
})

//update route
// router.put("/:id",isLoggedIn,,
//   async(req,res)=>{
//   // if(!req.body.listing){
//   //     throw new ExpressError("Please fill in all fields",400)
//   //   }
//   let {id}=req.params;
//   await  Listing.findByIdAndUpdate(id,{...req.body.listing})
//   req.flash("success"," listing updated successfully")

//   res.redirect(`/listings/${id}`)
// })
// update route
router.put("/:id", isLoggedIn,isOwner,  async (req, res) => {
    let { id } = req.params;
    let listingData = req.body.listing;

    // If image is empty, set default
    if (!listingData.image || !listingData.image.url) {
        listingData.image = {
            filename: 'listingimage',
            url: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/b59662108905525.5fc7daef9a20e.jpg'
            
        };
    }
  
    await Listing.findByIdAndUpdate(id, listingData);
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
});


//delete...
router.delete("/:id",isLoggedIn,isOwner,async(req,res)=>{
  let {id}=req.params;
let deleteListing=  await Listing.findByIdAndDelete(id);
  req.flash("success","deleted listing successfully")
res.redirect("/listings")
})

module.exports=router;