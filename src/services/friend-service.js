const { Friend, User } = require("../models");
const {
  STATUS_ACCEPTED,
  ME,
  UNKNOWN,
  RECEIVER,
  REQUESTER,
  FRIEND,
} = require("../constants");
const { Op } = require("sequelize");

exports.getFriendsByUserId = async (id) => {
  const friendships = await Friend.findAll({
    where: {
      status: STATUS_ACCEPTED,
      [Op.or]: [{ requesterId: id }, { receiverId: id }],
    },
    include: [
      {
        model: User,
        as: "Requester",
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "Receiver",
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
    ],
  });

  // filter arrays of join tables into friends of target id
  return friendships.reduce((acc, el) => {
    if (el.requesterId === +id) {
      acc.push(el.Receiver);
    } else {
      acc.push(el.Requester);
    }
    return acc;
  }, []);
  //   console.log(JSON.parse(JSON.stringify(friendships, null, 2))[0]);
  //   console.log(JSON.parse(JSON.stringify(friend, null, 2)));
};

//
exports.getStatusWithTargetUserByUserId = async (targetUserId, userId) => {
  if (+targetUserId === +userId) {
    return ME;
  }

  // find on friend table whether target and user are reciever and requester
  const friendships = await Friend.findOne({
    where: {
      [Op.or]: [
        { requesterId: targetUserId, receiverId: userId },
        { requesterId: userId, receiverId: targetUserId },
      ],
    },
  });

  if (!friendships) {
    return UNKNOWN;
  }

  if (friendships.status === STATUS_ACCEPTED) {
    return FRIEND;
  }

  if (friendships.requesterId === +targetUserId) {
    return RECEIVER;
  }

  return REQUESTER;
};

exports.getFriendsIdByUserId = async (id) => {
  const friendships = await Friend.findAll({
    where: {
      status: STATUS_ACCEPTED,
      [Op.or]: [{ requesterId: id }, { receiverId: id }],
    },
  });

  // console.log(JSON.stringify(friendships, null, 2));

  return friendships.reduce((acc, el) => {
    if (el.requesterId === +id) {
      acc.push(el.receiverId);
    } else {
      acc.push(el.requesterId);
    }
    return acc;
  }, []);
  // console.log(result);
};
