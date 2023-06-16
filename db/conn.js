import mongoose from "mongoose";
const connectDB = async (req, res) => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connection to Mongo DB ${conn.connection.host}`)
    } catch (error) {
        console.log("connection error", error)
    }
}
export default connectDB; 