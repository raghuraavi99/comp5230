const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
/* @swagger
 */
router.get("/:id", noteController.getNote);
router.get("/exists/:id", noteController.noteExists);
router.post("/create", authenticationMiddleware, noteController.createNote);
router.delete("/:id", noteController.forceDeleteNote);
module.exports = router;
