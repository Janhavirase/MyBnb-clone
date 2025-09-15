const mongoose=require("mongoose");
const { Schema } = mongoose;
const Review=require("./reviews.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
  filename: {
    type: String,
    default: 'listingimage'
  },
  url: {
    type: String,
    default: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/b59662108905525.5fc7daef9a20e.jpg'
  }
},

    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;












lllllllllllllll
