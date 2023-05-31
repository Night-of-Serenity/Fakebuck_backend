const uploadService = require("../services/upload-service");
const { User } = require("../models");
const createError = require("../utils/create-error");
const friendService = require("../services/friend-service");
const fs = require("fs");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.files.profileImage && !req.files.coverImage) {
      createError("profile image or cover image is required");
    }

    const updateValue = {};
    if (req.files.profileImage) {
      const result = await uploadService.upload(req.files.profileImage[0].path);
      updateValue.profileImage = result.secure_url;
    }
    if (req.files.coverImage) {
      const result = await uploadService.upload(req.files.coverImage[0].path);
      updateValue.profileImage = result.secure_url;
    }

    await User.update(updateValue, { where: { id: req.user.id } });
    res.status(200).json(updateValue);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profileImage) {
      fs.unlinkSync(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      fs.unlinkSync(req.files.coverImage[0].path);
    }
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    // get target
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    // get friends of target
    const friends = await friendService.getFriendsByUserId(req.params.id);

    // get relationship status of user and target
    const statusWithAuthenticatedUser =
      await friendService.getStatusWithTargetUserByUserId(
        req.user.id,
        req.params.id
      );

    // send user, friends of target, status with target back to frontend
    await res.status(200).json({
      user,
      friends,
      statusWithAuthenticatedUser,
    });
  } catch (err) {
    next(err);
  }
};
