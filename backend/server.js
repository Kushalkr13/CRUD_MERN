const express = require("express");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app=express();
const PORT =5000;
const JWT_SECRET = "your_jwt_secret_key";

// Middleware
app.use(cors());
app.use(express.json());


// db connection
mongoose
    .connect("mongodb://localhost:27017/mernstack-crud") 
    .then(()=>{
        console.log("db connected sucessfull");
    })
    .catch((error) =>{
        console.log(error);
    });

//user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
},{ timestamps: true});

const User =mongoose.model("User", userSchema)


// Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();
    res.status(201).json({ message: "User registered", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};


//create user POST method
app.post("/createuser", async(req, res)=>{
    try {
        const bodyData = req.body;
        const user = new User(bodyData);
        const userData = await user.save();
        res.send(userData);
    } catch (error) {
        res.send(error);
    }
});

// read all users GET method
app.get("/readalluser", async(req, res) => {
    try {
        const userData = await User.find({});
        res.send(userData);

    } catch (error) {
        res.send(error);
    }
});

// read only 1 user GET method
app.get("/read/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({_id:id});
        res.send(user);

    } catch (error) {
        res.send(error);
    }
});



//update user PUT method
app.put("/updateuser/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate({_id:id}, req.body, {
            new:true,
        });
        res.send(user);

    } catch (error) {
        res.status(500).send(error);
    }
});

//delete user DELETE method
app.delete("/delete/:id", async (req, res)=>{
    try {
         const id = req.params.id;
        const user = await User.findByIdAndDelete({_id:id});
        res.send(user);
    } catch (error) {
        res.send(error);
    }
})


//server running msg
app.listen(PORT, () => {
   console.log(`server is running on http://localhost:${PORT}`);

});