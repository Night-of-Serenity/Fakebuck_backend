const express = require("express");

const upload = require("../middlewares/upload");
const userController = require("../controllers/user-controller");
const authenticated = require("../middlewares/authenticated");

const router = express.Router();

router.patch(
  "/image",
  authenticated,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.uploadImage
);

router.get("/:id/profile", authenticated, userController.getUserProfile);

module.exports = router;
