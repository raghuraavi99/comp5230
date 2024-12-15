const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
/* @swagger
 */
router.post("/register", userController.register);
router.post("/login", userController.loginUser);
module.exports = router;
