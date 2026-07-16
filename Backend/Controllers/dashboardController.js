import Product from "../Models/Product.js";
import User from "../Models/User.js";
import Sales from "../Models/Sales.js";

export const getDashboardStats = async (req,res) => {

    try{

        const totalProducts = await Product.countDocuments();

        const totalUsers = await User.countDocuments();

        const totalSales = await Sales.countDocuments();

        const revenueData = await Sales.aggregate([
            {
                $group:{
                    _id:null,
                    totalRevenue:{
                        $sum:"$totalAmount"
                    }
                }
            }
        ]);

        res.status(200).json({
            success:true,
            data:{
                totalProducts,
                totalUsers,
                totalSales,
                revenue:
                    revenueData[0]?.totalRevenue || 0
            }
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};