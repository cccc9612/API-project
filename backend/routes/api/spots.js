const express = require('express')

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { requireAuth } = require("../../utils/auth")
const { Spot, SpotImage, User, Booking, Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


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
            where: { spotId: spot.id }
        });

        const formatSpot = spot.toJSON();

        if (avgRating) {
            formatSpot.avgRating = avgRating;
        } else {
            formatSpot.avgRating = null;
        };
        if (previewImage) {
            formatSpot.previewImage = previewImage.url;
        } else {
            formatSpot.previewImage = null;
        };
        return formatSpot;
    }));

    res.status(200).json({ Spots: arr })
});

// get details of a spot from an id - URL: /api/spots/:spotId
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404).json({ message: "Spot not found." });
    }

    const numReviews = await Review.count({
        where: { spotId }
    });

    const totalRating = await Review.sum('stars', {
        where: { spotId }
    });

    const avgRating = totalRating / numReviews;

    spot = spot.toJSON();
    spot.numReviews = numReviews;
    spot.avgRating = avgRating;
    spot.spotImage = await SpotImage.findAll({
        attributes: ['id', 'url', 'preview'],
        where: { spotId, preview: true }
    });
    spot.Owner = await User.findByPk(spot.ownerId, {
        attributes: {
            exclude: ['username']
        }
    })
    res.json(spot)
})

//edit a spot - URL: /api/spots/:spotId
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spotId = req.params.spotId;
    const user = req.user;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot not found." })
    };

    if (user.id === spot.ownerId) {
        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        await spot.save()
        res.status(200).json(spot)
    }
});

//delete a spot - URL: /api/spots/:spotId
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot not found." })
    };

    await spot.destroy();
    return res.json({ message: "Spot deleted sucessfully." })

});

module.exports = router;
