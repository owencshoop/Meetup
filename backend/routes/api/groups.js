const express = require("express");

const { User, Group, GroupImage, Membership, sequelize } = require('../../db/models')

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

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


module.exports = router;
