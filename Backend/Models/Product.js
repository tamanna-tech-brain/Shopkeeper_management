import mongoose from "mongoose";
import supplier from "./Supplier.js"

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    category: {
        type : String,
        required : true
    },
    price: {
        type : Number,
        required : true
    },
    stock: {
        type : Number,
        required : true
    },
    barcode: {
        type : String
    },
    supplierId: {type: mongoose.Schema.Types.ObjectId,
        ref: "suppliers",
        required: true
    }
},{
     timestamps: true,
});
const Product = mongoose.model("product", productSchema);
export default Product;