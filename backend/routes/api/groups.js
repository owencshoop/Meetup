const express = require("express");

const { User, Group } = require('../../db/models')

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.get('/', async (req, res, next) => {
    const Groups = await Group.findAll()

    res.json({Groups})
})


module.exports = router;
