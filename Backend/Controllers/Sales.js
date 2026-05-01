import salesModel from "../Models/Sales.js";
import {getPagination} from "../utils/Pagination.js"
import {getSearchMatch} from "../utils/search.js"
export async function createSales(req, res){
    try{
    const { customerId ,items, quantity, price, totalAmount, paymentMethod, date } = req.body;
    const salesCreate = await salesModel.create({
         customerId ,items, quantity, price, totalAmount, paymentMethod, date
    });
    return res.status(201).json({
        success : true,
        data : salesCreate,
        message : "sales created success"
    });
    } catch(error){
        return res.status(404).json({
            success: false,
            message: error.message
        });
    } 
}

export async function getSales(req, res){
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "" } = req.query;

    const matchStage = getSearchMatch(search, "name");

    const salesGets = await salesModel
      .find(matchStage)
      .limit(limit)
      .skip(skip);

    const total = await salesModel.countDocuments(matchStage);

    return res.status(200).json({
      success: true,
      data: salesGets,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: "sales found successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getSalesById(req, res){
    try{
        const { id } = req.params;
        const salesGetById = await salesModel.findById(id);
        if(!salesGetById) {
            return res.status(404).json({
                success : false,
                message : "sales not found"
            });
        }
        return res.status(200).json({
            success : true,
            data : salesGetById,
            message : "sales found successfully"
        });
    }catch(error) {
        return res.status(404).json({
            success : false,
            message : "sales not found"
    });
}
}

export async function updateSalesById(req, res) {
    try{
        const { id} = req.params;
        const salesUpdates = await salesModel.findByIdAndUpdate(id, req.body , {new : true});
        if(! salesUpdates) {
           return res.status(404).json({
                success : false,
                message : "not found"
            });
        }
        return res.status(200).json({
            success : true,
            data : salesUpdates,
            message : "sales Updated successfully"
        });
    }catch(error) {
        return res.status(404).json({
            success : false,
            message : error.message
    });
}
} 

export async function deleteSalesById(req, res){
    try{
        const { id } = req.params;
        const salesDeletes = await salesModel.findByIdAndDelete(id);
        if (!salesDeletes) {
            return res.status(404).json({
                success : false,
                message : " not found"
            });
        }
        return res.status(200).json({
            success : true,
            data : salesDeletes,
            message : "sales Deleted successfully"
        });
    }catch(error) {
        return res.status(404).json({
            success : false,
            message : "sales not found"
    });
}
}