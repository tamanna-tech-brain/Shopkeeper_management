import productModel from "../Models/Product.js"
import { getPagination } from "../utils/Pagination.js";
import { getSearchMatch } from "../utils/search.js";
export async function createProduct(req, res){
    try{
        const { name, category, price, stock, barcode, supplierId} = req.body;
        const productCreate = await productModel.create({
            name, category, price, stock, barcode, supplierId
        });
        return res.status(201).json({
            success: true,
            data: productCreate,
            message: " product created successfully"
    });
    }
    catch (error) {
        return res.status(400).json({
        success: false,
        message: error.message
  });
}
}

export async function getProduct(req, res) {
    try{
        const {page, limit, skip} = getPagination(req.query);
        const {search = ""} = req.query;
        const matchStage = getSearchMatch(search, "name");
        const total = await productModel.countDocuments(matchStage);
        const productGets = await productModel.find(matchStage).skip(skip).limit(limit);
        res.json({
        success: true,
        data: productGets,
        pagination: {
            page,
            limit,
            total,
            totalPage:Math.ceil(total / limit)
        },
        message: "product found successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
} 

export async function getProductById(req, res) {
    try{
        const {id} = req.params
        const productGetById = await productModel.findById(id);
        if(!productGetById) {
           return res.status(404).json({
            success: false,
            message : "failed",
            });
        }
        return res.json({
        success: true,
        data: productGetById,
        message: "product found successfully"
        });
    }catch (err) {
        res.status(500).json({
        success: false,
        message: err.message });
  }
} 

export async function updateProductById(req, res){
    try{
        const { id } = req.params;
        const productUpdated = await productModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!productUpdated) {
            return res.status(404).json({
                success: false,
                message: "failed"
            });
        }
        return res.status(200).json({
            success: true,
            data: productUpdated,
            message: "product updated successfully"
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export async function deleteProductById(req, res) {
    try{
        const {id} = req.params;
        const productDeleted = await productModel.findByIdAndDelete(id);
        if (!productDeleted) {
            return res.status(404).json({
            success: false,
            message: "product not found"
            });
        }
        return res.status(200).json({
            success: true,
            data : productDeleted,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
    });   
}
}