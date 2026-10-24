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
    image: {
        type: String,
        default: ""
    },
    },
    {
         timestamps: true,
    });
    
const customerModel = mongoose.model("customer", customerSchema)
export default customerModel;