const express = require('express')
const router=express.Router({mergeParams:true})
const{reviewSchema, listingSchema}=require("../schema.js")
const ExpressError=require("../utils/ExpressError.js")
const Review=require('../models/reviews.js');
const Listing=require('../models/listing.js');
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")



//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,async (req, res) => {
  const { id, reviewId } = req.params;  
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
});


//Reviews
//post route
router.post("/",isLoggedIn,validateReview,
  async(req,res)=>{
 let listing=await Listing.findById(req.params.id);
 let newReview=new Review(req.body.review);
 newReview.author=req.user._id;
 listing.reviews.push(newReview);

 await newReview.save();
 await listing.save();
   req.flash("success","review created successfully")

 console.log("done bhej diya");
res.redirect(`/listings/${listing._id}`)
})

module.exports=router;