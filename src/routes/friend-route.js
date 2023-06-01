const express = require("express");
const friendController = require("../controllers/friend-controller");

const router = express.Router();

router.post("/:receiverId", friendController.addFriend);
router.patch("/:requesterId", friendController.confirmedFriend);

module.exports = router;
