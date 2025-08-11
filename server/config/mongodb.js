import mongoose from 'mongoose';

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log('Database Connected'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
    //added try catch for the netweok access
    try{

        await mongoose.connect(`${process.env.MONGODB_URI}/mernAuth`);

    }
    catch(err){

        console.log("err",err);
        
    }



};

export default connectDB;