const express = require("express");
const router = express.Router();

const { addCategory, getCategory,  getCategories, updateCategory, deleteCategory } = require("../../../../controllers/physio/exercises/category");

router.post("/", addCategory);
router.get("/", getCategory);
router.get("/all", getCategories);
router.put("/", updateCategory);
router.delete("/", deleteCategory);

module.exports = router;