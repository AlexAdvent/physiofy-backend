const express = require("express");
const router = express.Router();

const { addExercise, getExercises, getExercise, updateExercise, deleteExercise } = require("../../../../controllers/physio/exercises/exercise");

router.post("/", addExercise);
router.get("/", getExercise);
router.get("/all", getExercises);
router.put("/", updateExercise);
router.delete("/", deleteExercise);

module.exports = router;