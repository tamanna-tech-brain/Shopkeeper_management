import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    phone: {
        type :String,
        required : true,
        unique: true
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
    
    const Supplier = mongoose.model("supplier", supplierSchema)
    export default Supplier;