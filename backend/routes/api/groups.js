const express = require("express");

const { User, Group, GroupImage, Membership, Venue, sequelize } = require('../../db/models')

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const venue = require("../../db/models/venue");
const app = require("../../app");

const router = express.Router();



// GET ALL GROUP joined/organized by current user /api/groups/current
router.get('/current', requireAuth, async (req, res, next) => {
    let {user} = req
    user = user.toJSON() // user.id
    const organizerGroups = await Group.findAll({
        where: {
            organizerId: user.id
        },
        raw: true
    })

    const memberGroups = await Group.findAll({
        include: {
            model: Membership,
            where: {
                userId: user.id
            },
            attributes: [],
        },
        raw: true
    })

    const groups = [...organizerGroups, ...memberGroups]

    let groupsArr = []

    for (let group of groups) {
        // console.log(group)
        let numMembers = await Membership.count({
            where: {
                groupId: group.id,
            },
            raw: true
        })
        group.numMembers = numMembers

        let previewImage = await GroupImage.findOne({
            where: {
                groupId: group.id,
                preview: true
            },
            attributes: ['url'],
            raw: true
        })
        // console.log(previewImage)

        group.previewImage = previewImage.url


        groupsArr.push(group)
        // console.log(groupsArr)
    }

    res.json(groupsArr)
})

// GET GROUP DETAILS FROM GROUPID /api/groups/:id
router.get('/:id', async (req, res, next) => {
    const groupId = req.params.id
    if (isNaN(parseInt(groupId))) {
        const err = new Error('groupId must be a number')
        err.status = 404

        next(err)
    }

    let group = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'Organizer'
            },
            {
                model: Venue,
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
            }
        ],
    })

    if (!group){
        const err = new Error("Group couldn't be found")
        err.status = 404

        next(err)
        return
    }

    let numMembers = await Membership.count({
        where: {
            groupId
        },
        raw: true
    })
    group = group.toJSON()
    group.numMembers = numMembers

    res.json(group)
})

// GET ALL GROUPS /api/groups
router.get('/', async (req, res, next) => {
    let groups = await Group.findAll()
    // console.log(groups)
    let groupsArr = []

    for (let group of groups) {
        group = group.toJSON()
        // console.log(group)
        let numMembers = await Membership.count({
            where: {
                groupId: group.id,
            },
            raw: true
        })
        group.numMembers = numMembers

        let previewImage = await GroupImage.findOne({
            where: {
                groupId: group.id,
                preview: true
            },
            attributes: ['url'],
            raw: true
        })
        // console.log(previewImage)

        group.previewImage = previewImage.url


        groupsArr.push(group)
        // console.log(groupsArr)
    }


    // console.log(groupsArr)
    return res.json({Groups: groupsArr})
})

const validateCreateGroup = [
    check('name')
        .exists({checkFalsy: true})
        .isLength({ max: 60})
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({checkFalsy: true})
        .isLength({ min: 50})
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({checkFalsy: true})
        .isIn(["Online", "In person"], ["Online", "In person"])
        .withMessage('Type must be "Online" or "In person"'),
    check('private')
        .exists({checkFalsy: true})
        .isBoolean({checkFalsy: true})
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .withMessage('State is required'),
    handleValidationErrors,
]

// CREATE A GROUP post /api/groups
router.post('/', requireAuth, validateCreateGroup, async (req, res, next) => {
    const { name, about, type, private, city, state} = req.body

    let {user} = req
    user = user.toJSON() // user.id

    const foundGroup = await Group.findOne({
        where: {
            name
        }
    })

    if (foundGroup) {
        const err = new Error('Group with that name already exsists')
        err.status = 403

        next(err)
    }

    const newGroup = await Group.create({
        organizerId: user.id,
        name,
        about,
        type,
        private,
        city,
        state
    })

    res.json(newGroup)
})

// ADD AN IMAGE TO GROUP FROM GROUPID /api/groups/:groupId/images
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const groupId = req.params.groupId
    let {user} = req
    user = user.toJSON()

    const group = await Group.findOne({
        where: {
            [Op.and]: [
                {id: groupId},
                {organizerId: user.id}
            ]
        }
    })

    console.log(group)

    if (!group){
        const err = new Error("Group couldn't be found")
        err.status = 404

        next(err)
    }

    const {url, preview} = req.body

    let newImage = await GroupImage.create({
        groupId,
        url,
        preview
    })
    newImage = newImage.toJSON()

    const image = await GroupImage.findByPk(newImage.id, {
        attributes: ['id', 'url', 'preview']
    })

    res.json(image)
})

// EDIT A GROUP /api/groups/:groupId
router.put('/:groupId', requireAuth, validateCreateGroup, async (req, res, next) => {
    const { name, about, type, private, city, state} = req.body

    const groupId = req.params.groupId
    let {user} = req
    user = user.toJSON()

    let group = await Group.findOne({
        where: {
            [Op.and]: [
                {id: groupId},
                {organizerId: user.id}
            ]
        }
    })

    if (!group){
        const err = new Error("Group couldn't be found")
        err.status = 404

        next(err)
    }

    group = await group.update({
        name, about, type, private, city, state
    })

    res.json(group)
})

module.exports = router;
