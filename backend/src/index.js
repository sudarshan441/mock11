const express=require("express");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const cors=require("cors");
const userModel = require("../model");
const argon2 = require("argon2");
const app=express();
app.use(express.json());
app.use(cors());

app.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await userModel.findOne({email});
    if(user){
        const verification = await argon2.verify(user.password, password);
        if(verification){
            const token= await jwt.sign({id:user.id,email},"SECRET1234",{expiresIn:"7 days"});
             return res.status(200).send({message:"Login Successful",token})
        }else{
            return res.status(401).send("Invalid Credentials")
        }
    }else{
        return res.status(404).send("email not found")
    }
   })
app.post("/signup",async(req,res)=>{
    const { email,password } = req.body;
    const hash = await argon2.hash(password);

    const user = await userModel.create({ email: email, password: hash })
    user.save();
    res.send("successfully signed up");
})

mongoose.connect("mongodb+srv://sudarshan:sudarshan@cluster0.ydgncyl.mongodb.net/user").then(()=>{
    app.listen(8080,()=>{
        console.log("server started")
    })
})