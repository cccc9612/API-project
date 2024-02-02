const express = require('express');

// const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

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
    const { user } = req;
    let updateBooking = await Booking.findByPk(req.params.bookingId);

    if (!updateBooking) {
        return res.status(404).json({
            message: `Booking couldn't be found`
        })
    }

    let startDateString = new Date(startDate).toDateString()
    let endDateString = new Date(endDate).toDateString()

    let startDateTime = new Date(startDateString).getTime()
    let endDateTime = new Date(endDateString).getTime()

    if (startDateTime >= endDateTime) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: {
                endDate: 'endDate cannot be on or before startDate'
            }
        })
    }

    const start = Date.now()
    let currentDate = new Date(start).toDateString()
    currentDate = new Date(currentDate).getTime()

    let bookingEndDate = updateBooking.endDate
    bookingEndDate = new Date(bookingEndDate).toDateString()
    bookingEndDate = new Date(bookingEndDate).getTime()

    if (currentDate > bookingEndDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: updateBooking.spotId,
            id: { [Op.not]: [updateBooking.id] }
        }
    })

    let errors = {}

    for (let booking of bookings) {
        let newStartDate = new Date(booking.startDate).toDateString()
        let newEndDate = new Date(booking.endDate).toDateString()

        newStartDate = new Date(newStartDate).getTime()
        newEndDate = new Date(newEndDate).getTime()

        if (endDateTime >= newStartDate && endDateTime <= newEndDate) {
            errors.endDate = "End date conflicts with an existing booking"
        }

        if (startDateTime >= newStartDate && startDateTime <= newEndDate) {
            errors.startDate = "Start date conflicts with an existing booking"
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

    if (user.id === updateBooking.userId) {
        updateBooking.startDate = startDate || updateBooking.startDate;
        updateBooking.endDate = endDate || updateBooking.endDate;

        await updateBooking.save();

        return res.json(updateBooking)
    } else {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
})


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

    if (user.id === booking.userId) { await booking.destroy() }
    else {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    res.status(200).json({ message: "Successfully deleted" });
});









module.exports = router;
