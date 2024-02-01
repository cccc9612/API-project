const express = require('express');

// const bcrypt = require('bcryptjs');
// const { Op } = require('sequelize');

const { requireAuth } = require("../../utils/auth")
const { Spot, SpotImage, Booking } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


//get all of the current user's bookings - URL: /api/bookings/current
router.get('/current', requireAuth, async (req, res, next) => {
    const { id } = req.user;
    const returnArr = [];

    const bookings = await Booking.findAll({
        where: { userId: id },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                }
            }]
    })

    for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i];

        const previewImage = await SpotImage.findOne({
            where: { spotId: booking.spotId }
        })

        booking = booking.toJSON();
        if (previewImage) {
            booking.Spot.previewImage = previewImage.url;
        } else {
            booking.Spot.previewImage = null;
        }

        returnArr.push(booking);
    }

    return res.status(200).json({ Bookings: returnArr })

});


//edit a booking - URL: /api/bookings/:bookingId
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;
    const { user } = req;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    let startDateInput = Date.parse(startDate);
    let endDateInput = Date.parse(endDate);

    if (startDateInput <= endDateInput) {
        return res.status(400).json({
            message: "Bad Request",
            errors: { endDate: "endDate cannot be on or before startDate" }
        })
    }

    const dateNow = Date.now()

    if (dateNow > Date.parse(booking.endDate)) {
        return res.status(403).json({ message: "Past bookings can't be modified" })
    }

    const currentBooking = await Booking.findAll({
        where: { spotId: booking.spotId }
    })

    for (let i = 0; i < currentBooking.length; i++) {
        let currentBooking = currentBooking[i];
        currentStartDate = Date.parse(currentBooking.startDate);
        currentEndDate = Date.parse(currentBooking.endDate);

        if (currentBooking.id !== booking.id) {

            if ((startDateInput <= currentEndDate && startDateInput >= currentStartDate && currentEndDate >= currentStartDate && currentEndDate <= currentEndDate) || (startDateInput <= currentStartDate && endDateInput >= currentEndDate)) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })
            }

            if (startDateInput <= currentEndDate && measuredStartDate >= currentStartDate) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: { startDate: "Start date conflicts with an existing booking" }
                })
            }

            if (endDateInput >= currentStartDate && endDateInput <= currentEndDate) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: { endDate: "End date conflicts with an existing booking" }
                })
            }

        }
    }
    if (user.id === booking.userId) {
        booking.startDate = startDate;
        booking.endDate = endDate;

        await booking.save();
        return res.status(200).json(booking);
    }
});


//delete a booking - URL: /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const userId = req.user.id
    const bookingId = parseInt(req.params.bookingId)

    const booking = await Booking.findByPk(bookingId, { include: [Spot] });

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    };

    const currentDate = new Date();
    if (new Date(booking.startDate) <= currentDate) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
    }

    await booking.destroy();

    res.status(200).json({ message: "Successfully deleted" });
});









module.exports = router;
