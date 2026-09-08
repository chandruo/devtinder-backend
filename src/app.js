const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")


const app = express()


connectDB().then(()=> {
    console.log("connection successful")
    app.listen(3000,()=> {
  console.log("server started running")
})
}).catch(err => console.log("connection failed"))


app.post("/signup", async (req,res)=>{
  const user = new User({
    firstName: "siva",
    lastName: "chandran"
  }
  )

  await user.save()


  res.send("sign up api")

})
