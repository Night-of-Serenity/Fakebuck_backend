const express = require("express");
const friendController = require("../controllers/friend-controller");

const router = express.Router();

router.post("/:receiverId", friendController.addFriend);
router.patch("/:requesterId", friendController.confirmedFriend);
router.delete("/:receiverId/cancer", friendController.cancelRequest);
router.delete("/:friendId/unfriend", friendController.unfriend);
router.delete("/:requesterId/reject", friendController.rejectRequest);
module.exports = router;
