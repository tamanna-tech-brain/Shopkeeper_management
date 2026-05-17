import customerModel from "../Models/Customer.js";
import {getPagination} from "../utils/Pagination.js"
import {getSearchMatch} from "../utils/search.js"

export async function createCustomer(req, res) {
    try{
    const {name, phone, address} = req.body;
    const customerCreate = await customerModel.create({
        name,phone,address
    });
    return res.status(201).json({
        success: true,
        data: customerCreate,
        message: "customer created successfully"
    });
    }
    catch(error) {
        return res.status(400).json({
        success: false,
        message: error.message
        });
    }
}

export async function getCustomer(req, res) {
    try{
        const {page, limit, skip} = getPagination(req.query);
        const {search = ""} = req.query;
        const matchStage = getSearchMatch(search, "name");
        const customerGets = await customerModel.find(matchStage).skip(skip).limit(limit);
        const total = await customerModel.countDocuments(matchStage);
        res.json({
        success: true,
        data: customerGets,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit),
        }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
} 

export async function getCustomerById(req, res) {
    try{
        const {id} = req.params
        const customerGetById = await customerModel.findById(id);
        if(!customerGetById) {
           return res.status(404).json({
            success: false,
            message : "failed",
            });
        }
        return res.json({
        success: true,
        data: customerGetById,
        message: "customer found successfully"
        });
    }catch (err) {
        return res.status(500).json({
        success: false, 
        message: err.message });
    }
} 

export async function updateCustomerById(req, res){
    try{
        const { id } = req.params;
        const customerUpdated = await customerModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!customerUpdated) {
            return res.status(404).json({
                success: false,
                message: "failed"
            });
        }
        return res.status(200).json({
            success: true,
            data: customerUpdated,
            message: "customer updated successfully"
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export async function deleteCustomerById(req, res) {
    try{
        const {id} = req.params;
        const customerDeleted = await customerModel.findByIdAndDelete(id);
        if (!customerDeleted) {
            return res.status(404).json({
            success: false,
            message: "customer not found"
        });
        }
        res.status(201).json({
        success: true,
        data : customerDeleted,
        message: "Deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
    });   
}
}
