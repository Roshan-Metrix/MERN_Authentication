import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:false //changed true->false because from google we can get the password whil creating account
    },
    verifyOtp:{
        type: String,
        default:''
    },
    verifyOtpExpireAt:{
        type:Number,
        default:0
    },
   isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOtp:{
        type:String,
        default:''
    },
    resetOtpExpireAt:{
        type:Number,
        default:0
    }
})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;