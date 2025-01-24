import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 8 
    },
    profilePicture: {
        type: String,
        required : true ,
    },
    phoneNumber: {
        type: Number,
        required: true,
        match: /^(03|70|71|76|78|79)\d{6}$/
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    licenseNumber: {
        type: String, 
        unique: true  ,
    },
    description: {
        type: String,
        default: "Hello! Here's to joyful drives!"
    }
} , { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
