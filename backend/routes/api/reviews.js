const express = require('express');
// const bcrypt = require('bcryptjs');
// const { Op } = require('sequelize');
const { requireAuth } = require("../../utils/auth")
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


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


//get all reviews of the current user - URL: /api/reviews/current
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const returnArr = [];
    const reviews = await Review.findAll({
        where: { userId: userId, },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }],
        order: [[ReviewImage, 'id']]
    })

    for (let i = 0; i < reviews.length; i++) {
        let review = reviews[i];

        const previewImage = await SpotImage.findOne({
            where: {
                spotId: review.spotId
            }
        })
        review = review.toJSON();

        if (previewImage) {
            review.Spot.previewImage = previewImage.url;
        } else {
            review.Spot.previewImage = null;
        }

        returnArr.push(review);
    }
    return res.status(200).json({ Reviews: returnArr });

});


//add an image to a review based o the review's id - URL: /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }

    const allImages = await ReviewImage.findAll({
        where: { reviewId }
    })

    if (allImages.length >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" })
    }

    const newImage = await review.createReviewImage({ url })
    res.status(200).json({
        id: newImage.id,
        url: newImage.url
    })

});

//edit a review - URL: /api/reviews/:reviewId
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { reviewId } = req.params;
    const { id } = req.user;
    const { review, stars } = req.body;

    const reviewToEdit = await Review.findByPk(reviewId);

    if (!reviewToEdit) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }

    if (reviewToEdit.userId == id) {
        reviewToEdit.review = review;
        reviewToEdit.stars = stars;

        await reviewToEdit.save();
        return res.status(200).json(reviewToEdit);
    } else {
        return res.status(403).json({ message: "Forbidden" })
    }
});


//delete a review - URL: /api/reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { id } = req.user;

    const reviewToDestroy = await Review.findByPk(reviewId);

    if (!reviewToDestroy) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }

    if (reviewToDestroy.userId === id) {
        await reviewToDestroy.destroy();
        return res.status(200).json({ message: "Successfully deleted" })
    } else {
        return res.status(403).json({ message: "Forbidden" })
    }
})



module.exports = router;
