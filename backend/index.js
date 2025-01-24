import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import RegistrationRouter from './Routes/RegistrationRouter.js';
import RideRoutes from './Routes/RideRoutes.js'
import RequestRoute from './Routes/RequestRoute.js'


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const Connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
};

app.listen(process.env.PORT, () => {
    Connect();
    console.log("Server is running");
});


app.use('/users', RegistrationRouter);
app.use('/rides' , RideRoutes);
app.use('/requests' , RequestRoute);


