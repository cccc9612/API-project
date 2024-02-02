const express = require('express');

// const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { requireAuth } = require("../../utils/auth")
const { Spot, SpotImage, User, Review, Booking, ReviewImage } = require('../../db/models');
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

//review validation
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];
<<<<<<< HEAD
=======


>>>>>>> spot-routes

//get all spots owned by the current user - URL: /api/spots/current
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll(
        { where: { ownerId: userId } }
    );

    let returnArr = await Promise.all(spots.map(async (spot) => {
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

    res.status(200).json({ Spots: returnArr })
});

//get all bookings for a spot based on the spot's id - URL: /api/spots/:spotId/bookings
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    if (user.id === spot.ownerId) {
        const userBookings = await Booking.findAll({
            where: { spotId: spotId },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })
        return res.status(200).json({ Bookings: userBookings })
    }
    else {
        const bookings = await Booking.findAll({
            where: { spotId: spotId },
            attributes: ['spotId', 'startDate', 'endDate']
        })

        return res.status(200).json({ Bookings: bookings })
    }

})



//get all reviews by a spot's id - URL: /api/spots/:spotId/reviews
router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    const reviews = await Review.findAll({
        where: { spotId },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: ReviewImage,
            attributes: ['id', 'url']
        }],
        order: [[ReviewImage, 'id']]
    })

    return res.status(200).json({ Reviews: reviews });
});



// get details of a spot from an id - URL: /api/spots/:spotId
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    };

    const spotImage = await SpotImage.findAll({
        attributes: ['id', 'url', 'preview'],
        where: { spotId, preview: true }
    })


    const numReviews = await Review.count({
        where: { spotId }
    })

    const totalReviews = await Review.sum('stars', {
        where: { spotId }
    })

    const avgRating = totalReviews / numReviews;

    spot = spot.toJSON();
    spot.numReviews = numReviews;
    spot.avgRating = avgRating;
    spot.SpotImage = spotImage;
    spot.Owner = await User.findByPk(spot.ownerId, {
        attributes: {
            exclude: ['username']
        }
    })
    res.status(200).json(spot);
})


//create a review for a spot based on the spot's id - URL: /api/spots/:spotId/reviews
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    const existReview = await Review.findOne({
        where: {
            [Op.and]: [
                { userId: req.user.id },
                { spotId: spotId }
            ]
        }
    })

    if (existReview) {
        return res.status(500).json({ message: "User already has a review for this spot" })
    }

    const newReview = await Review.create({
        userId: userId,
        spotId: spot.id,
        review,
        stars
    })

    return res.status(201).json(newReview);
})





//create a booking from a spot based on the spot's id - URL: /api/spots/:spotId/bookings
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    let startDateInput = new Date(startDate).toDateString();
    let endDateInput = new Date(endDate).toDateString();
    let startDateTime = new Date(startDateInput).getTime();
    let endDateTime = new Date(endDateInput).getTime();

    if (startDateTime >= endDateTime) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: {
                startDate: "startDate cannot be in the past",
                endDate: "endDate cannot be on or before startDate"
            }
        })
    };

    const bookings = await Booking.findAll({
        where: { spotId: spotId }
    });

    for (let booking of bookings) {
        let newStartDate = new Date(booking.startDate).toDateString();
        let newEndDate = new Date(booking.endDate).toDateString();
        newStartDate = new Date(newStartDate).getTime();
        newEndDate = new Date(newEndDate).getTime();

        if (startDateTime >= newStartDate && startDateTime <= newEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: { startDate: "Start date conflicts with an existing booking" }
            })
        }
        if (endDateTime >= newStartDate && endDateTime <= newEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: { endDate: "End date conflicts with an existing booking" }
            })
        }
        if (startDateTime < newStartDate && endDateTime > newEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            })
        }
    }

    if (spot.ownerId !== user.id) {
        const newBooking = await Booking.create({
            spotId,
            userId: user.id,
            startDate,
            endDate
        })

        return res.status(200).json(newBooking);
    }
});

//add an image to a spot based on the spot's id - URL: /api/spots/:spotId/images
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;
<<<<<<< HEAD
    const spotId = req.params.spotId
=======
    const spotId = req.params.spotId;
    const { user } = req;
>>>>>>> spot-routes

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404).json({ message: "Spot couldn't be found" });
    }
<<<<<<< HEAD
    const newSpotImage = await SpotImage.create({
        spotId: spotId,
        url: url,
        preview: preview
    });

    const newImage = {
        id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview
    };

    return res.status(200).json(newImage);
})
=======

    if (user.id === spot.ownerId) {
        const newSpotImage = await SpotImage.create({
            spotId: spotId,
            url: url,
            preview: preview
        });

        const newImage = {
            id: newSpotImage.id,
            url: newSpotImage.url,
            preview: newSpotImage.preview
        };

        return res.status(200).json(newImage);
    }
    else {
        return res.status(403).json({ message: "Forbidden" })
    }
});
>>>>>>> spot-routes


//edit a spot - URL: /api/spots/:spotId
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spotId = req.params.spotId;
    const user = req.user.id;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    };

    if (user === spot.ownerId) {
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
    } else {
        return res.status(403).json({ message: "Forbidden" })
    }
});

//delete a spot - URL: /api/spots/:spotId
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    };

    if (user.id === spot.ownerId) {
        await spot.destroy();
        return res.status(200).json({ message: "Successfully deleted" })
    } else {
        return res.status(403).json({ message: "Forbidden" })
    }
});

//get all spots - URL: /api/spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    let returnArr = await Promise.all(spots.map(async (spot) => {
        const numReviews = await Review.count();

        const totalRating = await Review.sum('stars');

        const avgRating = totalRating / numReviews;

        const previewImage = await SpotImage.findOne({
            attributes: ['url']
        });

        const spotInfo = spot.toJSON();

        if (avgRating) {
            spotInfo.avgRating = avgRating;
        } else {
            spotInfo.avgRating = null;
        };
        if (previewImage) {
            spotInfo.previewImage = previewImage.url;
        } else {
            spotInfo.previewImage = null;
        };
        return spotInfo;
    }));

    res.status(200).json({ Spots: returnArr })
});

//create a spot - URL: /api/spots
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const user = req.user.id;

    const spot = await Spot.create({
        ownerId: user,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    return res.status(201).json(spot);
});


module.exports = router;
