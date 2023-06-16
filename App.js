import express from "express";
import dotenv from 'dotenv'
import router from './router/auth.js'
import connectDB from "./db/conn.js";
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
connectDB();
app.use(express.json());
app.use('/api/v1/auth', router)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})