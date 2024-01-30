const express = require('express');

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { booking, Review, ReviewImage, Spot, SpotImage, User } = require("../../db/models");


router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const reviewImg = await ReviewImage.findByPk(imageId);

    if (!reviewImg) {
        return res.status(404).json({
            msg: 'Image does not exist'
        });
    };


})
