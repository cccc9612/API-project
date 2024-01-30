const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const requireAuth = require("../../utils/auth")
const { Spot, SpotImage, User, Booking, Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//spot validation
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Address is required."),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required."),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required."),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required."),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Please enter a number between -90 and 90."),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Please enter a number between -180 and 180."),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Name is required."),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required."),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than 0."),
    handleValidationErrors
];


//get all spots owned by the current user - URL: /api/spots/current
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll(
        { where: { ownerId: userId } }
    );

    let arr = await Promise.all(spots.map(async (spot) => {
        const numReviews = await Review.count({
            where: { spotId: spot.id }
        });

        const totalRating = await Review.sum('stars', {
            where: { spotId: spot.id }
        });

        const avgRating = totalRating / numReviews;

        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id, preview: true }
        });

        const formattedSpot = spot.toJSON();

        if (avgRating) {
            formattedSpot.avgRating = avgRating;
        } else {
            formattedSpot.avgRating = null;
        }

        if (previewImage) {
            formattedSpot.previewImage = previewImage.url;
        } else {
            formattedSpot.previewImage = null;
        }
        return formattedSpot;
    }));

    res.status(200).json({ Spots: arr })
})


module.exports = router;
