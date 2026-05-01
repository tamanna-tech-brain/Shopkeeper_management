import mongoose from "mongoose";
import product from "./Product.js"

const salesSchema = new mongoose.Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },
    items: [
        {
        productId: {type: mongoose.Schema.Types.ObjectId,
        ref: "products"
        },
    quantity : {
        type:Number,
        required: true,
    },
    price: {
        type:Number,
        required: true,
    }
    }
    ],
    totalAmount :{
        type : Number,
        required: true,
    },
    paymentMethod:{ 
        type : String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
});

const sale = mongoose.model("sale", salesSchema);
export default sale;