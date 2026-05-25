import supplierModel from "../Models/Supplier.js"
import {getPagination} from "../utils/Pagination.js"
import {getSearchMatch} from "../utils/search.js"


export async function createSupplier(req, res){
    try{
        const { name , phone, address} = req.body;
         console.log("body to create", {
            name , phone, address
        })
        const supplierCreates = await supplierModel.create({
            name , phone, address
        });
         console.log("after  create", supplierCreates)
        return res.status(201).json({
            success: true,
            data: supplierCreates,
            message: " supplier created successfully"
    });
    }
    catch (error) {
        console.error("error", error)
        return res.status(400).json({
        success: false,
        message: error.message
  });
}
}

export async function getSupplier(req, res) {
    try{
        const {page, limit,skip} = getPagination(req.query);
        const{search=""} = req.query;
        const matchStage = getSearchMatch(search, "name");
        const supplierGets = await supplierModel.find(matchStage).skip(skip).limit(limit);
        const total = await supplierModel.countDocuments(matchStage)
        res.json({
        success: true,
        data: supplierGets,
        getPagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
} 

export async function getSupplierById(req, res) {
    try{
        const {id} = req.params
        const supplierGetById = await supplierModel.findById(id);
        if(!supplierGetById) {
           return res.status(404).json({
            success: false,
            message : "failed",
            });
        }
        return res.json({
        success: true,
        data: supplierGetById,
        message: "supplier found successfully"
        });
    }catch (err) {
        res.status(500).json({
        success: false,
        message: err.message });
  }
} 

export async function updateSupplierById(req, res){
    try{
        const { id } = req.params;
        const supplierUpdated = await supplierModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!supplierUpdated) {
            return res.status(404).json({
                success: false,
                message: "failed"
            });
        }
        return res.status(200).json({
            success: true,
            data: supplierUpdated,
            message: "supplier updated successfully"
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export async function deleteSupplierById(req, res) {
    try{
        const {id} = req.params;
        const supplierDeleted = await supplierModel.findByIdAndDelete(id);
        if (!supplierDeleted) {
            return res.status(404).json({
            success: false,
            message: "supplier not found"
            });
        }
        return res.status(201).json({
            success: true,
            data : supplierDeleted,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
    });   
}
}