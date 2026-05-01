import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    phone: {
        type :String,
        required : true,
        unique:true
    },
    address: {
        type: String,
        required : true
        },
    },
    {
         timestamps: true,
    });
    
const customer = mongoose.model("customer", customerSchema)
export default customer;