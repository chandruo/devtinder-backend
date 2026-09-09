const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express()

app.use(express.json())


connectDB().then(() => {
  console.log("connection successful")
  app.listen(3000, () => {
    console.log("server started running")
  })
}).catch(err => console.log(err))


app.post("/signup", async (req, res) => {
  const user = req.body
  await user.save()
  res.send("sign up api")
})


app.get("/user", async (req, res) => {
  const { userId } = req.body

  try {
    const user = await User.find({ emailId: userId })

    if (user.length) {
      res.send(user)
    } else {
      res.send("user not found")
    }
  } catch (err) {
    res.status(500).send("something went wrong")
  }

})

app.get("/feed", async (req, res) => {
  try {
    const users = User.find({})
    if (users.length) {
      res.send(users)
    } else {
      res.send("No feed found")
    }

  } catch (err) {
    res.status(500).send("something went wrong")
  }
})

app.delete("/user", async (req, res) => {
  const { userId } = req.body
  await User.findByIdAndDelete(userId)

  res.send("user deleted successfully")

})

app.patch("/user", async (req, res) => {
  const data = req.body
  const user = await User.findByIdAndUpdate(data.id, data)
  console.log(user)
  res.send("updated successfully")
})
