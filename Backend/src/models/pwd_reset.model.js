import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required:  true,
    },
    pwdResetToken:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 1800, //document is automatically removed after 30min of creation
    }
})

export const PwdReset = mongoose.model("PwdReset", passwordResetSchema) //collection name will be pwdresets