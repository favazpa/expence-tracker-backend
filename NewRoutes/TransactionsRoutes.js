const express = require("express");
const router = express.Router();
const ErrorResponse = require("../utils/errorResponse");
const { protect } = require("../middleware/auth");
const e = require("express");
const Transactions = require("../Models/Transactions");

// Controllers
const addTransaction = async (req, res, next) => {
  const { amount, note, categoryId, remind, transactionType, transactionDate } =
    req.body;
  const { _id } = req.user;

  // Check if Title and UserId are Provieded
  if (!amount || !categoryId || !transactionType) {
    return next(
      new ErrorResponse("Please Provide Required Derails of the Category", 400)
    );
  }
  try {
    // Adds new Category Details Data
    const newTransaction = new Transactions({
      amount,
      note,
      transactionDate,
      categoryId,
      remind: false,
      transactionType,
      userId: _id,
    });
    const transaction = await newTransaction.save();
    res.status(200).json({
      success: true,
      message: "Successfully Created the Transaction",
      result: transaction,
    });
  } catch (err) {
    new ErrorResponse("Failed to Create the Transaction Details", 400);
  }
};

//Get All Categories
const deleteTransaction = async (req, res, next) => {
  const { transactionId } = req.body;
  const { _id } = req.user;

  // Check if Title and UserId are Provieded
  if (!_id) {
    return next(new ErrorResponse("User not found", 400));
  }
  try {
    // Delete Category Details Data
    await Transactions.findOneAndDelete({ _id: transactionId }).then((e) => {
      res.status(200).json({
        success: true,
        message: "Successfully deleted the transaction",
      });
    });
  } catch (err) {
    new ErrorResponse("Failed to deleted the Transaction", 400);
  }
};

//Edit Category
const editTransaction = async (req, res, next) => {
  const {
    transactionId,
    amount,
    note,
    categoryId,
    remind,
    transactionType,
    transactionDate,
  } = req.body;
  const { _id } = req.user;

  // Check if Title and UserId are Provieded
  if (!_id) {
    return next(new ErrorResponse("User not found", 400));
  }
  try {
    const filter = {
      _id: categoryId,
    };
    const updatedTransaction = {
      _id: transactionId,
      amount,
      note,
      categoryId,
      remind,
      transactionDate,
      transactionType,
      userId: _id,
    };

    let Transaction = await Transactions.findOneAndUpdate(
      filter,
      updatedTransaction
    ).exec();
    res.status(200).json({
      success: true,
      message: "Successfully updated the Transaction",
      result: Transaction,
    });
  } catch (err) {
    new ErrorResponse("Failed to updated the Transaction", 400);
  }
};

router.route("/add-transaction").post(protect, addTransaction);
router.route("/delete-transaction").delete(protect, deleteTransaction);
router.route("/edit-transaction").patch(protect, editTransaction);

module.exports = router;
