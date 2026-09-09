const mongoose = require("mongoose")
const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://chandru04042000_db_user:chandrupass@learn.bvenrcr.mongodb.net/devtinder")
}

module.exports = connectDB