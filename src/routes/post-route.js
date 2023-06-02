const express = require("express");
const postController = require("../controllers/post-controllers");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/", upload.single("image"), postController.createPost);

module.exports = router;
