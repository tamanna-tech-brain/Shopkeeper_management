import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    amount: {
        type : Number,
        required : true
    },
    category: {
        type: String,
        required : true
    },
    receiptImage: {
        type: String,
        default: ""
    },
    date: {
        type: Date, default: Date.now
    }
    },
    {
         timestamps: true,
    });
    
    const Expense = mongoose.model("expense", expenseSchema)
    export default Expense;