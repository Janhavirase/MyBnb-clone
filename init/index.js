const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
    await Listing.deleteMany({});

    // create a new array with owner included
    const dataWithOwner = initData.data.map(obj => ({
        ...obj,
        owner: new mongoose.Types.ObjectId("689636c5267ba9c23e2bf3e5") // make sure it's an ObjectId
    }));

    await Listing.insertMany(dataWithOwner);
    console.log("done bro init ho gya");
};

main()
.then(()=>{
    console.log("Database connected");
    return initDB();
})
.catch((err)=>{
    console.log(err);
})



