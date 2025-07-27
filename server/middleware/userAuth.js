// It find userid from token 

import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
   const { token } = req.cookies;

   if(!token){
    return res.json({success:false,message:'Not Authorized. Login Again'})
   }

   try {
    // decode & store token
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
    
   if (decodeToken.id) {
      req.userId = decodeToken.id;
   } else {
        return res.json({success : false, message:"Something wrong"})
     }
 
     next();

   } catch (error){
    res.json({success : false, message:error.message})
   }
   
}

export default userAuth;