const mongoose = require("mongoose")
const validator = require("validator")


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,  
     },
    lastName: {
        type: String
    },
    age: {
        type: Number,
        min: [18,"Must be atleast 18 got {VALUE}"] 
    },
    emailId: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: "Please enter valid Email"

        }
    },
    password: {
        type: String,

    }
}, {timestamps: true})

module.exports = mongoose.model("User",userSchema)