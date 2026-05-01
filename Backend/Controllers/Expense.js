import expenseModel from "../Models/Expense.js"
import { getPagination } from "../utils/Pagination.js";
import { getSearchMatch } from "../utils/search.js";
export async function createExpense(req, res){
    try{
        const { title, amount, category, date} = req.body;
        const expenseCreate = await expenseModel.create({
            title, amount, category, date
        });
        return res.status(200).json({
            success: true,
            data: expenseCreate,
            message: " expense created successfully"
    });
    }
    catch (error) {
        return res.status(400).json({
        success: false,
        message: error.message
  });
}
}

export async function getExpenses(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "" } = req.query;

    const matchStage = getSearchMatch(search, "title");

    const expensesGets = await expenseModel
      .find(matchStage)
      .skip(skip)
      .limit(limit);

    const total = await expenseModel.countDocuments(matchStage);

    res.json({
      success: true,
      data: expensesGets,
      pagination: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getExpensesById(req, res) {
  try {
    const { id } = req.params;

    const expensesGetById = await expenseModel.findById(id);

    if (!expensesGetById) {
      return res.status(404).json({
        success: false,
        message: "expense not found",
      });
    }

    return res.json({
      success: true,
      data: expensesGetById,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateExpensesById(req, res){
    try{
        const { id } = req.params;
        const expenseUpdated = await expenseModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!expenseUpdated) {
            return res.status(404).json({
                success: false,
                message: "failed"
            });
        }
        return res.status(200).json({
            success: true,
            data: expenseUpdated,
            message: "expenses updated successfully"
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export async function deleteExpenseById(req, res) {
    try{
        const {id} = req.params;
        const expenseDeleted = await expenseModel.findByIdAndDelete(id);
        if (!expenseDeleted) {
            return res.status(404).json({
            success: false,
            message: "expense not found"
            });
        }
        return res.status(201).json({
            success: true,
            data : expenseDeleted,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: error.message
    });   
}
}