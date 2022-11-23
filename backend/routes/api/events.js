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

const createEventValidator = [
    check("name")
      .exists({ checkFalsy: true })
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters"),
    check("type")
      .exists({ checkFalsy: true })
      .isIn(["Online", "In person"])
      .withMessage("Type must be Online or In person"),
    check("capacity")
      .exists({ checkFalsy: true })
      .isInt()
      .withMessage("Capacity must be an integer"),
    check("price")
      .exists({ checkFalsy: true })
      .isDecimal()
      .withMessage("Price is invalid"),
    check("description")
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check("startDate")
      .exists({ checkFalsy: true })
      .isAfter()
      .withMessage("Start date must be in the future"),
    check("endDate")
      .exists({ checkFalsy: true })
      .custom((value, { req }) => value > req.body.startDate)
      .withMessage("End date is less than start date"),
    handleValidationErrors,
  ];

  const addImageValidator = [
    check('url')
        .exists({checkFalsy: true})
        .isURL()
        .withMessage('URL must be a URL'),
    check('preview')
        .exists({checkFalsy: true})
        .isBoolean()
        .withMessage('Preview must be true or false')
]

// Add an image to an event based on the eventId /api/events/:eventId/images
router.post('/:eventId/images', requireAuth, addImageValidator, async (req, res, next) => {
    const {url, preview} = req.body

    let {user} = req
    user = user.toJSON()

    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)

    const attendance = await Attendance.findOne({
        where: {
            eventId,
            userId: user.id,
            status: {
                [Op.in]: [
                    'attending',
                    'host',
                    'co-host'
                ]
            }
        },
    })
    if (!event || !attendance){
        const err = new Error("Event couldn't be found")
        err.status = 404

        next(err)
    }

    const eventImage = await EventImage.create({
        eventId,
        url,
        preview
    })

    res.json(eventImage)
})




module.exports = router;
