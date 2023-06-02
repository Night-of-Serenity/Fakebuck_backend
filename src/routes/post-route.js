const express = require("express");
const postController = require("../controllers/post-controllers");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/", upload.single("image"), postController.createPost);
router.get("/friends", postController.getAllPostIncludeFriend);
router.post("/:postId/like", postController.createLike);

module.exports = router;
