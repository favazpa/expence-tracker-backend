const express = require("express");
const Category = require("../Models/Category");
const router = express.Router();
const User = require("../Models/User");
const ErrorResponse = require("../utils/errorResponse");
const { protect } = require("../middleware/auth");
const e = require("express");
const Transactions = require("../Models/Transactions");

// Controllers
const addCategories = async (req, res, next) => {
  const { title, description } = req.body;
  const { _id } = req.user;

  // Check if Title and UserId are Provieded
  if (!title) {
    return next(
      new ErrorResponse("Please Provide Required Derails of the Category", 400)
    );
  }
  try {
    // Adds new Category Details Data
    const newCategory = new Category({
      title,
      description,
      userId: _id,
    });
    const category = await newCategory.save();
    res.status(200).json({
      success: true,
      message: "Successfully Created the Category",
      result: category,
    });
  } catch (err) {
    new ErrorResponse("Failed to Create the Catogory Details", 400);
  }
};

//Get All Categories
const getCategories = async (req, res, next) => {
  const { _id } = req.user;

  // Check if Title and UserId are Provieded
  if (!_id) {
    return next(new ErrorResponse("User not found", 400));
  }
  try {
    // Adds new Category Details Data
    const transactionDetails = await Transactions.find({ userId: _id });
    const categories = await Category.find({ userId: _id });

    if (transactionDetails && categories) {
      const newFullCategoryData = categories.map((each) => {
        const transactionDetailsData = transactionDetails.filter(
          (eachTransction) =>
            eachTransction.categoryId.toString() === each._id.toString()
        );
        const newdata = {
          title: each.title,
          id: each._id,
          description: each.description,
          totalAmount: null,
          transactions: [...transactionDetailsData],
        };
        return newdata;
      });
      res.status(200).json({
        success: true,
        message: "Successfully fetched the All Categories",
        result: newFullCategoryData,
      });
    }
  } catch (err) {
    new ErrorResponse("Failed to fetched the All Categories", 400);
  }
};

//Get All Categories
const deleteCategories = async (req, res, next) => {
  const { categoryId } = req.body;
  const { _id } = req.user;

  // Check if Title and UserId are Provieded
  if (!_id) {
    return next(new ErrorResponse("User not found", 400));
  }
  try {
    // Delete Category Details Data
    await Category.findOneAndDelete({ _id: categoryId }).then((e) => {
      res.status(200).json({
        success: true,
        message: "Successfully deleted the Category and its transactions",
      });
    });
  } catch (err) {
    new ErrorResponse(
      "Failed to deleted the Categorys and its Transactions",
      400
    );
  }
};

//Edit Category
const editCategories = async (req, res, next) => {
  const { categoryId, title, description } = req.body;
  const { _id } = req.user;

  // Check if Title and UserId are Provieded
  if (!_id) {
    return next(new ErrorResponse("User not found", 400));
  }
  try {
    const filter = {
      _id: categoryId,
    };
    const updatedCategory = {
      title,
      description,
      userId: _id,
    };

    let Category = await Category.findOneAndUpdate(
      filter,
      updatedCategory
    ).exec();
    res.status(200).json({
      success: true,
      message: "Successfully updated the Category",
      result: Category,
    });
  } catch (err) {
    new ErrorResponse("Failed to updated the Category", 400);
  }
};

router.route("/add-category").post(protect, addCategories);
router.route("/get-all-category").get(protect, getCategories);
router.route("/delete-category").delete(protect, deleteCategories);
router.route("/edit-category").patch(protect, editCategories);

module.exports = router;
