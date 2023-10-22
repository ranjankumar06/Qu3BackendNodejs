const mongoose = require("mongoose");

// const dbConnect = () => {
//     const connecttionParams = {
//         useNewUrlParser: true
//     }

//     mongoose.connection.on("connected",() => {
//         console.log("Connected to database successfully");
//     });

//     mongoose.connection.on("error",(err) => {
//         console.log("Error while connecting to database:"+ err);
//     });

//     mongoose.connection.on("disconnected",() => {
//         console.log("Mongodb connection disconnected !");
//     });
// };

const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected: ", connect.connection.host, connect.connection.name);
    } catch (err){
        console.log(err);
        process.exit(1);
    }
};



module.exports =  dbConnect;