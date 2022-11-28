const express = require("express");

const {
  User,
  Group,
  GroupImage,
  Membership,
  Venue,
  Event,
  Attendance,
  EventImage,
  sequelize,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const venue = require("../../db/models/venue");
const app = require("../../app");

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    let { user } = req;
    user = user.toJSON();

    const imageId = req.params.imageId
    const groupImage = await GroupImage.findByPk(imageId)
    if (!groupImage) {
      const err = new Error("Group Image couldn't be found")
      err.status = 404

      return next(err)
    }
    const jsonGroupImage = groupImage.toJSON()

    const groupId = jsonGroupImage.groupId;
    const group = await Group.findByPk(groupId)
    if (!group){
      const err = new Error("Group couldn't be found")
      err.status = 404

      return next(err)
    }

    let organizerGroup = await Group.findOne({
      where: {
        id: groupId,
        organizerId: user.id,
      },
    });

    let groupCoHost = await Membership.findOne({
      where: {
        [Op.and]: [
          { userId: user.id },
          { groupId: groupId },
          { status: "co-host" },
        ],
      },
    });

    if (organizerGroup || groupCoHost) {
        await groupImage.destroy()
    } else {
        const err = new Error('Current user must be the organizer or co-host of the group to delete images')
        err.status = 403

        return next(err)
    }

    res.json({
        message: 'Successfully deleted',
        statusCode: 200
    })
})

module.exports = router;
