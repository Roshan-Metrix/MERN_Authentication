import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE,PASSWORD_RESET_SUCCESSFULLY_TEMPLATE } from '../config/emailTemplates.js';

// Register User 
export const registerUser = async (req, res) => {
    const { name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false,message:'Missing Datails'});
    }

       try{

        const existingUser = await userModel.findOne({email})
        
        if(existingUser){
           return res.json({ success:false, message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new userModel({
            name,
            email,
            password:hashedPassword
        });
        await user.save();
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn: '7d'});
        
        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    
    // Sending Welcome Email 
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome To MERN Authentication',
        // text: `Welcome to Roshan-Metrix website . Your Account has been created with email id : ${email}`,
        html: WELCOME_TEMPLATE.replace("{{email}}",user.email)
    }
    await transporter.sendMail(mailOptions);

    return res.json({success:true});

    } catch(error){
        res.json({success:false,message:error.message})
    }
}

// Login User
export const loginUser = async (req,res) => {
    const { email, password} = req.body;
    
    if(!email || !password){
        return res.json({ success:false ,message:'Email and Password are required '})
    }

    try{
       
        const user = await userModel.findOne({email});
    
    if(!user){
        return res.json({success:false,message:'Invalid email'})
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.json({success:false,message:'Invalid Password'})
    }
    
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn: '7d'});
        
        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true});

    } catch(error){
       return res.json({success:false,message:error.message});
    }
}

// Logout User
export const logoutUser = async (req, res) => {
    try{
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success:true,message:"Logged Out"});
    } catch (error) {
        return res.json({ success:false,message:error.message });
    }
}

// Send OTP to Email
export const sendVerifyOtp = async (req,res) => {
    //Send Verification OTP to the USer's Email
    try{
        // userId fetching from token (from middleware)
     const userId   = req.userId;

     const user = await userModel.findById(userId);

     if(user.isAccountVerified){
        return res.json({success:false,message:"Account Already verified"})
     }

     // generate 6 digit otp
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account Verification Otp',
        // text: `Your Otp is ${otp} . Please verify your account using this Otp.`,
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    }

    await transporter.sendMail(mailOption);

    return res.json({success:true,message:"Verification Otp sent in email"});

    }catch (error){
        res.json({success:false,message:error.message});
    }
}

// Verify the Email using OTP
export const verifyEmail = async (req,res) => {
    const userId = req.userId;
    const {otp} = req.body;

    if(!userId || !otp){
        return res.json({success:false,message:'Missing Details'});
    }

    try{
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success:false,message:'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({ success:false,message:'Invalid Otp'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({ success:false,message:'Otp Expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

       await user.save();
       return res.json({success:true,message:'Email verified successfully'})

    }catch (error){
        return res.json({success:false,message:error.message})
    }
}

// Check if user is Authenticated
export const isAuthenticated = async (req,res) => {
    try{
        res.json({success:true});
    } catch(error){
        res.json({success:false,message:error.message});
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req,res) => {
    const { email } = req.body;

    if(!email){
      return res.json({success:false,message:'Email is Required'});
    }

    try{
       const user = await userModel.findOne({email});
       
       if(!user){
        return res.json({success:false,message:'User not found'});
       }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
     
     await user.save();

    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset OTP',
        // text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password`,
       html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    }
    await transporter.sendMail(mailOption);

    return res.json({success:true,message:'OTP sent to your email'})

    } catch (error){
        return res.json({success:false, message:error.message});
    }
}

// Reset User Password
export const resetPassword = async (req,res) => {
    const { email, otp ,newPassword } = req.body;
    
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:'Email, OTP and new password is required'});
    }

try{
   
   const user = await userModel.findOne({email});
   
   if(!user){
    return res.json({success:false,message:'User not found'});
   }

   if(user.resetOtp === '' || user.resetOtp !== otp){
    return res.json({success:false,message:'Invalid OTP'});
   }

   if(user.resetOtpExpireAt < Date.now()){
     return res.json({success:false,message:'OTP Expired'});
   }

   const hashPassword = await bcrypt.hash(newPassword,10);
   user.password = hashPassword;
   user.resetOtp = '';
   user.resetOtpExpireAt = 0;

   await user.save();

   if(user.password){
    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset Successfully',
        text: `Your Password for ${email} is reset successfully.`,
        html: PASSWORD_RESET_SUCCESSFULLY_TEMPLATE.replace("{{email}}",user.email)

    }
    await transporter.sendMail(mailOption);
   }

   return res.json({success:true,message:'Password has been reset successfully'});

   } catch(error){
    res.json({success:false,message:error.message});
}
}