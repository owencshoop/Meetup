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
const group = require("../../db/models/group");

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
  check("url")
    .exists({ checkFalsy: true })
    .isURL()
    .withMessage("URL must be a URL"),
  check("preview")
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Preview must be true or false"),
  handleValidationErrors,
];

// Add an image to an event based on the eventId /api/events/:eventId/images
router.post(
  "/:eventId/images",
  requireAuth,
  addImageValidator,
  async (req, res, next) => {
    const { url, preview } = req.body;

    let { user } = req;
    user = user.toJSON();

    const eventId = req.params.eventId;

    const event = await Event.findByPk(eventId);

    const attendance = await Attendance.findOne({
      where: {
        eventId,
        userId: user.id,
        status: {
          [Op.in]: ["attending", "host", "co-host"],
        },
      },
    });
    if (!event || !attendance) {
      const err = new Error("Event couldn't be found");
      err.status = 404;

      return next(err);
    }

    let eventImage = await EventImage.create({
      eventId,
      url,
      preview,
    });
    eventImage = eventImage.toJSON();
    eventImage = await EventImage.findByPk(eventImage.id);

    res.json(eventImage);
  }
);

// GET DETAILS OF AN EVENT BY ITS ID /api/events/:eventId
router.get("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  let event = await Event.findByPk(eventId, {
    include: [
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
      },
      {
        model: EventImage,
      },
    ],
  });
  if (!event) {
    const err = new Error("Event couldn't be found");
    err.status = 404;

    return next(err);
  }
  event = event.toJSON();
  let numAttending = await Attendance.count({
    where: {
      eventId,
    },
    raw: true,
  });
  event.numAttending = numAttending;

  res.json(event);
});

// EDIT AN EVENT BY EVENTID /api/events/:eventId
router.put(
  "/:eventId",
  requireAuth,
  createEventValidator,
  async (req, res, next) => {
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;
    const eventId = req.params.eventId;

    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      const err = new Error("Venue couldn't be found");
      err.status = 404;

      return next(err);
    }

    let { user } = req;
    user = user.toJSON();

    let event = await Event.findByPk(eventId);
    if (!event) {
      const err = new Error("Event couldn't be found");
      err.status = 404;

      return next(err);
    }

    let jsonEvent = event.toJSON();
    const groupId = jsonEvent.groupId;

    let group = await Group.findOne({
      where: {
        id: groupId,
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
    if (group) group = group.toJSON();

    if (!group || (!groupCoHost && group.organizerId !== parseInt(user.id))) {
      const err = new Error("Group couldn't be found");
      err.status = 404;

      return next(err);
    }

    event = await event.update({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });
    event = event.toJSON();
    delete event.updatedAt;

    res.json(event);
  }
);

// GET ALL EVENTS /api/events/
router.get("/", async (req, res, next) => {
  let {page, size, name, type, startDate} = req.query

  if (!page || parseInt(page) < 1) page = 1
  if (parseInt(page) > 10) page = 10
  if (!size || parseInt(size) > 20) size = 20
  if (parseInt(size) < 1) size = 1
  page = parseInt(page)
  size = parseInt(size)

  let pagination = {}
  pagination.limit = size
  pagination.offset = size * (page - 1)

  let where = {}

  if (name) where.name = {[Op.substring]: name}
  if (type){
    if (type === 'Online' || type === 'In person'){
      where.type = type
    } else {
      const err = new Error("Type must 'Online' or 'In person'")
      err.status = 400

      return next(err)
    }
  }
  if (startDate && Date.parse(startDate) > Date.now()) where.startDate = {[Op.startsWith]: startDate}

  let events = await Event.findAll({
    include: [
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
    attributes: {
      exclude: ["description", "price", "capacity"],
    },
    where,
    ...pagination
  });

  const Events = [];

  for (let event of events) {
    event = event.toJSON();

    let numAttending = await Attendance.count({
      where: {
        eventId: event.id,
      },
      raw: true,
    });
    event.numAttending = numAttending;

    let previewImage = await EventImage.findOne({
      where: {
        eventId: event.id,
        preview: true,
      },
      attributes: ["url"],
      raw: true,
    });
    if (previewImage) event.previewImage = previewImage.url;

    Events.push(event);
  }

  res.json({ Events });
});

// REQUEST TO ATTEND AN EVENT FROM eventId /api/events/:eventId/attendance
router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const eventId = req.params.eventId;

  let { user } = req;
  user = user.toJSON();

  let event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event couldn't be found");
    err.status = 404;

    return next(err);
  }
  let jsonEvent = event.toJSON();
  const groupId = jsonEvent.groupId;

  let membership = await Membership.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { groupId: groupId },
        {
          status: {
            [Op.in]: ["co-host", "host", "member"],
          },
        },
      ],
    },
  });

  let organizer = await Group.findOne({
    where: {
      id: groupId,
      organizerId: user.id,
    },
  });

  if (!membership && !organizer) {
    const err = new Error(
      "User must be a member in the group hosting the event"
    );
    err.status = 403;

    return next(err);
  }

  const pendingAttendance = await Attendance.findOne({
    where: {
      userId: user.id,
      eventId,
    },
    raw: true,
  });

  if (pendingAttendance) {
    if (
      pendingAttendance.status === "pending" ||
      pendingAttendance.status === "waitlist"
    ) {
      const err = new Error("Attendance has already been requested");
      err.status = 400;

      return next(err);
    } else if (
      pendingAttendance.status === "attending" ||
      pendingAttendance.status === "host" ||
      pendingAttendance.status === "co-host"
    ) {
      const err = new Error("User is already an attendee of the event");
      err.status = 400;

      return next(err);
    }
  }

  let attendance = await Attendance.create({
    eventId,
    userId: user.id,
    status: "pending",
  });
  attendance = attendance.toJSON();

  attendance = await Attendance.findByPk(attendance.id);
  attendance = attendance.toJSON();
  delete attendance.id;
  delete attendance.eventId;

  res.json(attendance);
});

// CHANGE STATUS OF ATTENDANCE BY eventId /api/events/:eventId/attendance
router.put("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const { userId, status } = req.body;

  const eventId = req.params.eventId;

  let { user } = req;
  user = user.toJSON();

  let event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event couldn't be found");
    err.status = 404;

    return next(err);
  }
  let jsonEvent = event.toJSON();
  const groupId = jsonEvent.groupId;

  let membership = await Membership.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { groupId: groupId },
        {
          status: {
            [Op.in]: ["co-host", "host"],
          },
        },
      ],
    },
  });

  let organizer = await Group.findOne({
    where: {
      id: groupId,
      organizerId: user.id,
    },
  });

  if (!membership && !organizer) {
    const err = new Error(
      "User must be a organizer or co-host in the group hosting the event"
    );
    err.status = 403;

    return next(err);
  }

  let pendingAttendance = await Attendance.findOne({
    where: {
      userId,
      eventId,
    },
  });

  if (!pendingAttendance) {
    const err = new Error(
      "Attendance between the user and the event does not exist"
    );
    err.status = 404;

    return next(err);
  }

  if (status === "pending") {
    const err = new Error("Cannot change an attendance status to pending");
    err.status = 400;

    return next(err);
  }

  let updatedAttendance = await pendingAttendance.update({ status });
  updatedAttendance = updatedAttendance.toJSON();
  delete updatedAttendance.updatedAt;

  res.json(updatedAttendance);
});


// GET ALL ATTENDEES OF AN EVENT BY eventId /api/events/:eventId/attendees
router.get('/:eventId/attendees', async (req, res, next) => {
  let { user } = req;
  user = user.toJSON();

  const eventId = req.params.eventId;
  const event = await Event.findByPk(eventId, {raw: true})
  if (!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404

    return next(err)
  }
  const groupId = event.groupId

  const group = await Group.findByPk(groupId)
  if (!group){
    const err = new Error("Group couldn't be found")
    err.status = 404

    return next(err)
  }

  let organizerCoHost = false;

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

  if (organizerGroup || groupCoHost) organizerCoHost = true;

  let attendees
  if (organizerCoHost) {
    attendees = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        attributes: [],
        where: {
          eventId,
        },
      },
    });
  } else {
    attendees = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        attributes: [],
        where: {
          eventId,
          status: {
            [Op.not]: "pending",
          },
        },
      },
    });
  }

  let Attendees = []

  for (let attendee of attendees){
    attendee = attendee.toJSON()
    let attendance = await Attendance.findOne({
        where: {
            userId: attendee.id,
            eventId
        },
        raw: true
    })
    const status = attendance.status
    attendee.Attendance = {status}

    Attendees.push(attendee)
  }

  res.json({ Attendees });
});

// Delete an event spicified by its id
router.delete('/:eventId', requireAuth, async (req, res, next) => {
  const eventId = req.params.eventId

  let {user} = req
  user = user.toJSON()

  const event = await Event.findByPk(eventId)
  if (!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404

    return next(err)
  }
  const jsonEvent = await event.toJSON()
  const groupId = jsonEvent.groupId

  const group = await Group.findByPk(groupId)
  if (!group){
    const err = new Error("Group couldn't be found")
    err.status = 404

    return next(err)
  }

  let organizerCoHost = false;

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

  if (organizerGroup || groupCoHost) organizerCoHost = true;

  if (organizerCoHost) {
    await event.destroy()
  } else {
    const err = new Error('Current User must be the organizer or co-host of the group')
    err.status = 403

    return next(err)
  }

  res.json({message: 'Successfully deleted'})
})

// delete an attendance for an event with userId
router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
  const eventId = req.params.eventId

  const {userId} = req.body

  let {user} = req
  user = user.toJSON()

  const event = await Event.findByPk(eventId, {raw: true})
  if (!event) {
    const err = new Error("Event couldn't be found")
    err.status = 404

    return next(err)
  }
  const groupId = event.groupId

  let group = await Group.findByPk(groupId)
  group = group.toJSON()
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

  const attendance = await Attendance.findOne({
    where: {
      userId,
      eventId
    }
  })
  if (!attendance) {
    const err = new Error('Attendance does not exist')
    err.status = 404

    return next(err)
  }

  if (organizerGroup || user.id == userId){
    await attendance.destroy()
  } else {
    const err = new Error('Only the User or organizer may delete an Attendance')
    err.status = 403

    return next(err)
  }

  res.json({'message': 'Successfully deleted attendance from event'})
})

module.exports = router;
