const express = require('express');

// const bcrypt = require('bcryptjs');
// const { Op } = require('sequelize');

const { requireAuth } = require("../../utils/auth")
const { Spot, SpotImage, Booking } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


//get all of the current user's bookings - URL: /api/bookings/current
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    let bookings = await Booking.findAll({
        where: { userId: user.id }
    });

    const bookingsWithSpotInfo = await Promise.all(bookings.map(async (booking) => {
        let spot = await Spot.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt', 'description'] },
            where: { id: booking.spotId }
        });

        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: booking.spotId, preview: true }
        });

        spot = spot.toJSON();
        spot.previewImage = previewImage ? previewImage.url : null;

        booking = booking.toJSON();
        booking.Spot = spot;
        delete booking.userId;

        return booking;
    }));

    return res.json({ Bookings: bookingsWithSpotInfo });
});






















module.exports = router;
