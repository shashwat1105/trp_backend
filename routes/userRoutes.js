import express from 'express';
import { registerUser,loginUser } from '../controller/userController.js';
import User from '../model/user.js';

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);


router.get("/verify/:token",async(req,res)=>{
    try{
        const{token}=req.params;
        const decoder=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoder.userId);
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({ message: "Account successfully verified! You can now log in." });

    }catch(err){

    }
    

})
export default router;