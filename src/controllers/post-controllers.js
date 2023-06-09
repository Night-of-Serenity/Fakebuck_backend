const createError = require("../utils/create-error");
const { Post, User, Like } = require("../models/");
const uploadService = require("../services/upload-service");
const friendService = require("../services/friend-service");
const fs = require("fs");

exports.createPost = async (req, res, next) => {
  try {
    // validate, there must have text or image input
    // image => req.file, message => req.body
    if (!req.file && (!req.body.message || !req.body.message.trim())) {
      createError("message or image is required", 400);
    }

    // build input for create into db {userId,message,image}
    const value = {
      userId: req.user.id,
    };

    // post text input
    if (req.body.message && req.body.message.trim()) {
      value.message = req.body.message.trim();
    }

    // post image input
    if (req.file) {
      console.log(req.file);
      // upload to cloudinary
      const result = await uploadService.upload(req.file.path);

      // get secure url return from cloudinary's result
      value.image = result.secure_url;
    }

    const newPost = await Post.create(value);
    const post = await Post.findOne({
      where: { id: newPost.id },
      include: User,
    });

    // put new input into post database
    // const post = await Post.create(value); // return post as object from post table data

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getAllPostIncludeFriend = async (req, res, next) => {
  try {
    const friendsId = await friendService.getFriendsIdByUserId(req.user.id);
    const meIncludeFriendsId = [req.user.id, ...friendsId];
    // console.log(meIncludeFriendsId);
    const posts = await Post.findAll({
      where: {
        userId: meIncludeFriendsId,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
        },
        { model: Like, include: User },
      ],
    });
    // console.log(JSON.parse(JSON.stringify(posts)));
    // console.log(posts);
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const existLike = await Like.findOne({
      where: {
        userId: req.user.id,
        postId: req.params.postId,
      },
    });

    if (existLike) {
      //   await Like.destroy({
      //     where: {
      //         userId: req.user.id,
      //         postId: req.params.id
      //     }
      //   })
      await existLike.destroy();
    } else {
      await Like.create({ userId: req.user.id, postId: req.params.postId });
    }

    res.status(201).json({ message: "success like" });
  } catch (err) {
    next(err);
  }
};
