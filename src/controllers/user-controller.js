const uploadService = require("../services/upload-service");
const { User } = require("../models");
const createError = require("../utils/create-error");
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
