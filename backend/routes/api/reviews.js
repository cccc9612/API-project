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
    const { user } = req;
    let reviews = await Review.findAll({
        where: { userId: user.id },
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
            }
        ],
        order: [[ReviewImage, 'id']]
    })
    let arr = [];

    for (let i = 0; i < reviews.length; i++) {
        let review = reviews[i]

        const previewImage = await SpotImage.findByPk(review.Spot.id, {
            attributes: ['url'],
            where: { preview: true }
        })

        review = review.toJSON();
        review.Spot.previewImage = previewImage ? previewImage.url : null

        arr.push(review)
    }

    return res.json({ Reviews: arr })
})


//add an image to a review based o the review's id - URL: /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const { user } = req;
    const { reviewId } = req.params;
    let review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({
            message: `Review couldn't be found`
        })
    }

    if (user.id === review.userId) {
        const reviewImages = await ReviewImage.count({
            where: { reviewId }
        })

        if (reviewImages >= 10) {
            return res.status(403).json({
                message: `Maximum number of images for this resource was reached`
            })
        }

        const image = await review.createReviewImage({
            url
        })

        return res.json({
            id: image.id,
            url
        })
    } else {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
})

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
