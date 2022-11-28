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

// GET ALL GROUP joined/organized by current user /api/groups/current
router.get("/current", requireAuth, async (req, res, next) => {
  let { user } = req;
  user = user.toJSON(); // user.id
  const organizerGroups = await Group.findAll({
    where: {
      organizerId: user.id,
    },
    raw: true,
  });

  const memberGroups = await Group.findAll({
    include: {
      model: Membership,
      where: {
        userId: user.id,
      },
      attributes: [],
    },
    raw: true,
  });

  const groups = [...organizerGroups, ...memberGroups];

  let groupsArr = [];

  for (let group of groups) {
    let numMembers = await Membership.count({
      where: {
        groupId: group.id,
      },
      raw: true,
    });
    group.numMembers = numMembers;

    let previewImage = await GroupImage.findOne({
      where: {
        groupId: group.id,
        preview: true,
      },
      attributes: ["url"],
      raw: true,
    });

    if (previewImage) group.previewImage = previewImage.url;

    groupsArr.push(group);
  }

  res.json({ Groups: groupsArr });
});

// GET GROUP DETAILS FROM GROUPID /api/groups/:id
router.get("/:id", async (req, res, next) => {
  const groupId = req.params.id;
  if (isNaN(parseInt(groupId))) {
    const err = new Error("groupId must be a number");
    err.status = 404;

    next(err);
  }

  let group = await Group.findByPk(groupId, {
    include: [
      {
        model: GroupImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        as: "Organizer",
      },
      {
        model: Venue,
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
      },
    ],
  });

  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;

    next(err);
    return;
  }

  let numMembers = await Membership.count({
    where: {
      groupId,
    },
    raw: true,
  });
  group = group.toJSON();
  group.numMembers = numMembers;

  res.json(group);
});

// GET ALL GROUPS /api/groups
router.get("/", async (req, res, next) => {
  let groups = await Group.findAll();
  let groupsArr = [];

  for (let group of groups) {
    group = group.toJSON();
    let numMembers = await Membership.count({
      where: {
        groupId: group.id,
      },
      raw: true,
    });
    group.numMembers = numMembers;

    let previewImage = await GroupImage.findOne({
      where: {
        groupId: group.id,
        preview: true,
      },
      attributes: ["url"],
      raw: true,
    });

    if (previewImage) group.previewImage = previewImage.url;

    groupsArr.push(group);
  }

  return res.json({ Groups: groupsArr });
});

const validateCreateGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"], ["Online", "In person"])
    .withMessage('Type must be "Online" or "In person"'),
  check("private")
    .exists({ checkFalsy: true })
    .isBoolean({ checkFalsy: true })
    .withMessage("Private must be a boolean"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  handleValidationErrors,
];

// CREATE A GROUP post /api/groups
router.post("/", requireAuth, validateCreateGroup, async (req, res, next) => {
  const { name, about, type, private, city, state } = req.body;

  let { user } = req;
  user = user.toJSON(); // user.id

  const foundGroup = await Group.findOne({
    where: {
      name,
    },
  });

  if (foundGroup) {
    const err = new Error("Group with that name already exists");
    err.status = 403;

    return next(err);
  }

  const newGroup = await Group.create({
    organizerId: user.id,
    name,
    about,
    type,
    private,
    city,
    state,
  });

  res.json(newGroup);
});

const addImageValidator = [
  check("url")
    .exists({ checkFalsy: true })
    .isURL()
    .withMessage("URL must be a URL"),
  check("preview")
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Preview must be true or false"),
];

// ADD AN IMAGE TO GROUP FROM GROUPID /api/groups/:groupId/images
router.post(
  "/:groupId/images",
  requireAuth,
  addImageValidator,
  async (req, res, next) => {
    const groupId = req.params.groupId;
    let { user } = req;
    user = user.toJSON();

    const group = await Group.findOne({
      where: {
        [Op.and]: [{ id: groupId }, { organizerId: user.id }],
      },
    });


    if (!group) {
      const err = new Error("Group couldn't be found");
      err.status = 404;

      return next(err);
    }

    const { url, preview } = req.body;

    let newImage = await GroupImage.create({
      groupId: groupId,
      url: url,
      preview: preview,
    });
    newImage = newImage.toJSON();

    const image = await GroupImage.findByPk(newImage.id, {
      attributes: ["id", "url", "preview"],
    });

    res.json(image);
  }
);

// EDIT A GROUP /api/groups/:groupId
router.put(
  "/:groupId",
  requireAuth,
  validateCreateGroup,
  async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;

    const groupId = req.params.groupId;
    let { user } = req;
    user = user.toJSON();

    let group = await Group.findOne({
      where: {
        [Op.and]: [{ id: groupId }, { organizerId: user.id }],
      },
    });

    if (!group) {
      const err = new Error("Group couldn't be found");
      err.status = 404;

      return next(err);
    }

    group = await group.update({
      name,
      about,
      type,
      private,
      city,
      state,
    });

    res.json(group);
  }
);

const createVenueValidator = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
];

// CREATE A NEW VENUE FOR A GROUP BY ID
router.post(
  "/:groupId/venues",
  requireAuth,
  createVenueValidator,
  async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    const groupId = req.params.groupId;
    let { user } = req;
    user = user.toJSON();

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

    let newVenue = await Venue.create({
      groupId,
      address,
      city,
      state,
      lat,
      lng,
    });
    newVenue = newVenue.toJSON();

    const venue = await Venue.findByPk(newVenue.id, {
      attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
    });

    res.json(venue);
  }
);

// GET ALL VENUES FOR A GROUPID /api/groups/:groupId/venues
router.get("/:groupId/venues", requireAuth, async (req, res, next) => {
  const groupId = req.params.groupId;
  let { user } = req;
  user = user.toJSON();

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

  const venues = await Venue.findAll({
    where: {
      groupId,
    },
  });

  res.json({ Venues: venues });
});

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

// CREATE AN EVENT FOR A GROUP BY GROUPID
router.post(
  "/:groupId/events",
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

    const groupId = req.params.groupId;
    let { user } = req;
    user = user.toJSON();

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
    let venue;
    if (venueId) {
      venue = await Venue.findByPk(venueId);
      if (!venue) {
        const err = new Error("Venue does not exist");
        err.status = 403;

        next(err);
        return;
      }
    }

    if (!group || (!groupCoHost && group.organizerId !== parseInt(user.id))) {
      const err = new Error("Group couldn't be found");
      err.status = 404;

      return next(err);
    }
    let event = await Event.create({
      groupId: groupId,
      venueId: venueId || null,
      name: name,
      type: type,
      capacity: capacity,
      price: price,
      description: description,
      startDate: startDate,
      endDate: endDate,
    });
    event = event.toJSON();
    delete event.createdAt;
    delete event.updatedAt;

    let attendance = await Attendance.create({
      eventId: event.id,
      userId: user.id,
      status: "host",
    });

    res.json(event);
  }
);

// GET ALL EVENTS BY GROUPID /api/groups/:groupId/events
router.get("/:groupId/events", async (req, res, next) => {
  const groupId = req.params.groupId;

  let group = await Group.findByPk(groupId);

  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;

    return next(err);
  }
  let events = await Event.findAll({
    where: {
      groupId,
    },
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

// REQUEST MEMBERSHIP FOR A GROUP from GroupId /api/groups/:groupId/membership
router.post("/:groupId/membership", requireAuth, async (req, res, next) => {
  const groupId = req.params.groupId;

  let { user } = req;
  user = user.toJSON();

  const group = await Group.findByPk(groupId);
  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;

    return next(err);
  }

  const pendingMembership = await Membership.findOne({
    where: {
      groupId,
      userId: user.id,
    },
    raw: true,
  });
  if (pendingMembership) {
    if (pendingMembership.status === "pending") {
      const err = new Error("Membership has already been requested");
      err.status = 400;

      return next(err);
    } else {
      const err = new Error("User is already a member of the group");
      err.status = 400;

      return next(err);
    }
  }

  let membership = await Membership.create({
    userId: user.id,
    groupId,
    status: "pending",
  });
  membership = membership.toJSON();

  membership = await Membership.findByPk(membership.id);
  membership = membership.toJSON();
  delete membership.id;
  delete membership.groupId;

  res.json(membership);
});

// CHANGE STATUS OF MEMBERSHIP BY groupId /api/groups/:groupId/membership
router.put("/:groupId/membership", requireAuth, async (req, res, next) => {
  const { userId, status } = req.body;

  let { user } = req;
  user = user.toJSON();

  const groupId = req.params.groupId;

  const foundUser = await User.findByPk(userId);
  if (!foundUser) {
    const err = new Error("Validation Error");
    err.status = 400;
    err.errors = { memberId: "User couldn't be found" };

    return next(err);
  }

  const group = await Group.findByPk(groupId);
  if (!group) {
    const err = new Error("Group couldn't be found");
    err.status = 404;

    return next(err);
  }

  let membership = await Membership.findOne({
    where: {
      userId,
      groupId,
    },
  });
  if (!membership) {
    const err = new Error(
      "Membership between the user and the group does not exist"
    );
    err.status = 404;

    return next(err);
  }

  let pendingToMember = false;
  let memberToCoHost = false;

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

  if (organizerGroup || groupCoHost) pendingToMember = true;
  if (organizerGroup) memberToCoHost = true;

  if (status == "pending") {
    const err = new Error("Validation Error");
    err.status = 400;
    err.errors = { status: "Cannot change a membership status to pending" };

    return next(err);
  }

  if (status === "member" && pendingToMember) {
    membership = await membership.update({ status });
  } else if (status === "co-host" && memberToCoHost) {
    membership = await membership.update({ status });
  } else {
    const err = new Error("User is not authorized to change membership status");
    err.status = 401;

    return next(err);
  }
  membership = membership.toJSON();
  delete membership.updatedAt;

  res.json(membership);
});

// GET ALL MEMBERS OF A GROUP BY groupId /api/groups/:groupId/members
router.get("/:groupId/members", async (req, res, next) => {
  let { user } = req;
  user = user.toJSON();

  const groupId = req.params.groupId;
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

  let members
  if (organizerCoHost) {
    members = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        attributes: [],
        where: {
          groupId,
        },
      },
    });
  } else {
    members = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        attributes: [],
        where: {
          groupId,
          status: {
            [Op.not]: "pending",
          },
        },
      },
    });
  }

  let Members = []

  for (let member of members){
    member = member.toJSON()
    let membership = await Membership.findOne({
        where: {
            userId: member.id,
            groupId
        },
        raw: true
    })
    const status = membership.status
    member.Membership = {status}

    Members.push(member)
  }

  res.json({ Members });
});

// delete membership for a group with groupId
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
  let { user } = req;
  user = user.toJSON();

  const {userId} = req.body

  const findUser = await User.findByPk(userId)
  if (!findUser){
    const err = new Error('validation Error')
    err.status = 400
    err.errors = {'userId': "User couldn't be found"}

    return next(err)
  }

  const groupId = req.params.groupId;
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

  const membership = await Membership.findOne({
    where: {
      groupId,
      userId
    }
  })
  if (!membership){
    const err = new Error('Membership does not exist for this user')
    err.status = 404

    return next(err)
  }

  if (organizerGroup || userId == user.id){
    await membership.destroy()
  } else {
    const err = new Error('Current user must be host of the group, or user whose membership is being deleted')
    err.status = 403

    return next(err)
  }

  res.json({'message': 'Successfully deleted membership from the group'})
})

// DELETE A GROUP
router.delete('/:groupId', requireAuth, async (req, res, next) => {
  let {user} = req
  user = user.toJSON()

  const groupId = req.params.groupId
  let group = await Group.findByPk(groupId)
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

  if (organizerGroup){
    await group.destroy()
  } else {
    const err = new Error('User must be organizer of the group')
    err.status = 403

    return next(err)
  }

  res.json({
    message: 'Successfully deleted',
    statusCode: 200
  })
})

module.exports = router;
