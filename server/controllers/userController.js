import userModel from '../models/userModel.js'

// Get User datas
export const getUserData = async (req,res) => {
    try{
    const  userId  = req.userId;

    const user = await userModel.findById(userId);

    if(!user){
        return res.json({success:false,message:'User Not Found'});
    }

    res.json({
        success:true,
        userData:{
            name: user.name,
            isAccountVerified: user.isAccountVerified
        }
    })

    } catch(error){
        res.json({success:false,message:error.message});
    }
}
