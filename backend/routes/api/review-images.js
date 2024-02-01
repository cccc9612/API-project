const express = require('express');
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


//delete a review image - URL: /api/review-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const userId = req.user.id
    const imageId = req.params.imageId
    const reviewsImages = await ReviewImage.findByPk(imageId)

    if (!reviewsImages) {
        res.status(404).json({ message: "Review Image couldn't be found" })
    }

    const reviews = await Review.findByPk(reviewsImages.reviewId)
    if (reviews.userId !== userId) {
        return res.status(403).json({ message: "Review must belong to the current user" })
    }

    await reviewsImages.destroy()
    res.status(200).json({ message: "Succesfully deleted" })

});

module.exports = router;
