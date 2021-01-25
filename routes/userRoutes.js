const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const userController = require("../controllers/userController");
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.send("Server is Working");
});

router.post("/signUp", userController.signup);

router.post("/signin", userController.sigin);

router.post("/logout", userController.logout);

module.exports = router;
