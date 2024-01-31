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
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: { userId: userId },
        include: [
            {
                model: Spot,
                as: 'Spot',
                attributes: ['id', 'name', 'address', 'city', 'state', 'country', 'price', 'previewImage']
            }
        ]
    });



    return res.status(200).json
})






















module.exports = router;
