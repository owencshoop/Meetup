const express = require("express");

const { User, Group, GroupImage, Membership, Venue, sequelize } = require('../../db/models')

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const venue = require("../../db/models/venue");
const app = require("../../app");

const router = express.Router();

const createVenueValidator = [
    check('address')
        .exists({checkFalsy: true})
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .withMessage('State is required'),
    check('lat')
        .exists({checkFalsy: true})
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .withMessage('Longitude is not valid')
]

router.put('/:venueId', requireAuth, createVenueValidator, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body

    const venueId = req.params.venueId
    let {user} = req
    user = user.toJSON()

    let venue = await Venue.findOne({
        where: {
                id: venueId,
        }
    })
    let jsonVenue
    let groupId
    let groupCoHost
    let group
    if (venue) {
        jsonVenue = venue.toJSON()
        groupId = jsonVenue.groupId

        groupCoHost = await Membership.findOne({
            where: {
                [Op.and]: [
                    {userId: user.id},
                    {groupId: groupId},
                    {status: 'co-host'}
                ]
            }
        })

        group = await Group.findByPk(groupId)
        if (group) group = group.toJSON()
    }


    if (!venue || (!groupCoHost && group.organizerId !== parseInt(user.id))){
        const err = new Error("Group couldn't be found")
        err.status = 404

        return next(err)
    }

    venue = await venue.update({
        address, city, state, lat, lng
    })

    res.json(venue)
})


module.exports = router;
