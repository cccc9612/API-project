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


//get all spots owned by the current user - URL: /api/spots/current
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    let spots = await Spot.findAll({
        where: { ownerId: user.id }
    })
    let arr = [];

    for (let i = 0; i < spots.length; i++) {
        let spot = spots[i]

        const numReviews = await Review.count({
            where: { spotId: spot.id }
        })

        const sumRating = await Review.sum('stars', {
            where: { spotId: spot.id }
        })

        const avgRating = sumRating / numReviews;

        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id, preview: true }
        })

        spot = spot.toJSON()
        spot.avgRating = avgRating ? avgRating : null
        spot.previewImage = previewImage ? previewImage.url : null

        arr.push(spot)
    }

    return res.json({ Spots: arr })
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
router.get('/:spotId/reviews', async (req, res) => {
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
    const { user } = req;
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    let startDateInput = new Date(startDate).toDateString()
    let endDateString = new Date(endDate).toDateString()

    let startDateTime = new Date(startDateInput).getTime()
    let endDateTime = new Date(endDateString).getTime()

    if (startDateTime >= endDateTime) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: { endDate: 'endDate cannot be on or before startDate' }
        })
    }

    if (startDateTime <= new Date()) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: { endDate: 'startDate cannot be in the past' }
        })
    }

    const bookings = await Booking.findAll({
        where: { spotId: spotId }
    })

    let errors = {}

    for (let booking of bookings) {
        let newStartDate = new Date(booking.startDate).toDateString()
        let newEndDate = new Date(booking.endDate).toDateString()

        newStartDate = new Date(newStartDate).getTime()
        newEndDate = new Date(newEndDate).getTime()

        if (startDateTime >= newStartDate && startDateTime <= newEndDate) {
            errors.startDate = "Start date conflicts with an existing booking"
        }

        if (endDateTime >= newStartDate && endDateTime <= newEndDate) {
            errors.endDate = "End date conflicts with an existing booking"
        }

        if (startDateTime < newStartDate && endDateTime > newEndDate) {
            errors.startDate = "Start date conflicts with an existing booking"
            errors.endDate = "End date conflicts with an existing booking"
        }

        if (Object.keys(errors).length) {
            const err = {
                message: "Sorry, this spot is already booked for the specified dates",
                errors: errors
            }

            return res.status(403).json(err)
        }
    }

    if (user.id !== spot.ownerId) {
        const newBooking = await Booking.create({
            spotId,
            userId: user.id,
            startDate,
            endDate
        })

        return res.status(200).json(newBooking);
    } else {
        return res.status(403).json({ message: "Forbidden" })
    }
})

//add an image to a spot based on the spot's id - URL: /api/spots/:spotId/images
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const spotId = req.params.spotId;
    const { user } = req;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404).json({ message: "Spot couldn't be found" });
    }

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
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({ message: `Spot couldn't be found` })
    }

    if (user.id === spot.ownerId) {
        await spot.destroy();
        return res.status(200).json({ "message": "Successfully deleted" })
    } else {
        return res.status(403).json({ message: "Forbidden" })
    }
})


// get details of a spot from an id - URL: /api/spots/:spotId
router.get('/:spotId', async (req, res, next) => {
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

//get all spots - URL: /api/spots
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const errors = {};

    page = parseInt(page);
    size = parseInt(size);

    if (page < 1) errors.page = "Page must be greater than or equal to 1"
    if (size < 1) errors.size = "Size must be greater than or equal to 1"

    if (minLat) {
        if (minLat < -90 || minLat > 90) errors.minLat = "Minimum latitude is invalid"
    }

    if (maxLat) {
        if (maxLat < -90 || maxLat > 90) errors.maxLat = "Maximum latitude is invalid"
    }

    if (minLng) {
        if (minLng < -180 || minLng > 180) errors.minLng = "Minimum longitude is invalid"
    }

    if (maxLng) {
        if (maxLng < -180 || maxLng > 180) errors.maxLng = "Maximum longitude is invalid"
    }

    if (minPrice) {
        if (minPrice < 0) errors.minPrice = "Minimum price must be greater or equal to 0"
    }

    if (maxPrice) {
        if (maxPrice < 0) errors.maxPrice = "Minimum price must be greater or equal to 0"
    }

    if (Object.keys(errors).length) {
        const err = {
            message: "Bad Request",
            errors: errors
        }

        return res.status(400).json(err)
    }

    if (Number.isNaN(page) || page <= 0 || !page) page = 1;
    if (Number.isNaN(size) || size <= 0 || !size) size = 20;

    if (page > 10) page = 10;
    if (size > 20) size = 20;

    const where = {};

    if (minLat && !maxLat) where.lat = { [Op.gte]: minLat }
    if (maxLat && !minLat) where.lat = { [Op.lte]: maxLat }
    if (minLat && maxLat) where.lat = { [Op.between]: [minLat, maxLat] }

    if (minLng && !maxLng) where.lng = { [Op.gte]: minLng }
    if (maxLng && !minLng) where.lng = { [Op.lte]: maxLng }
    if (minLng && maxLng) where.lng = { [Op.between]: [minLng, maxLng] }

    if (minPrice && !maxPrice) where.minPrice = minPrice
    if (maxPrice && !minPrice) where.maxPrice = maxPrice
    if (minPrice && maxPrice) where.price = { [Op.between]: [minPrice, maxPrice] }

    const spots = await Spot.findAll({
        where,
        limit: size,
        offset: size * (page - 1)
    })

    let arr = []

    for (let i = 0; i < spots.length; i++) {
        let spot = spots[i]

        const numReviews = await Review.count({
            where: { spotId: spot.id }
        })

        const sumRating = await Review.sum('stars', {
            where: { spotId: spot.id }
        })

        const avgRating = sumRating / numReviews;

        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id, preview: true }
        })

        spot = spot.toJSON();
        spot.avgRating = avgRating ? avgRating : null
        spot.previewImage = previewImage ? previewImage.url : null

        arr.push(spot);
    }

    return res.json({ Spots: arr, page, size })
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
