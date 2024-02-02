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
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const booking = await Booking.findOne({
        where: {
            id: bookingId,
        }
    });

    if (booking && (booking.userId !== userId)) {
        return res.status(403).json({
            message: "Forbidden"
        });
    };

    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        });
    };

    const currentDate = new Date();
    const startDateCheck = new Date(startDate);
    const endDateCheck = new Date(endDate);

    if (endDateCheck < currentDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        });
    };

    if (startDateCheck < currentDate && endDateCheck <= startDateCheck) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "startDate cannot be in the past",
                endDate: "endDate cannot be on or before startDate"
            }
        });
    }

    if (startDateCheck < currentDate) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "startDate cannot be in the past"
            }
        });
    };

    if (endDateCheck <= startDateCheck) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        });
    };

    const existingBooking = await Booking.findOne({
        where: {
            id: { [Op.ne]: bookingId },
            spotId: booking.spotId,
            [Op.and]: [
                {
                    startDate: {
                        [Op.lte]: endDateCheck
                    }
                },
                {
                    endDate: {
                        [Op.gte]: startDateCheck
                    }
                }
            ]
        }
    });

    if (existingBooking) {
        const bookingStart = new Date(existingBooking.startDate).getTime();
        const bookingEnd = new Date(existingBooking.endDate).getTime();

        if (endDateCheck.getTime() == bookingStart) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                error: {
                    endDate: "End date conflicts with an existing booking"
                }
            });
        };

        if (startDateCheck >= bookingStart && endDateCheck <= bookingEnd) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        };

        if (startDateCheck >= bookingStart) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                error: {
                    startDate: "Start date conflicts with an existing booking"
                }
            });
        };

        if (endDateCheck <= bookingEnd) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                error: {
                    endDate: "End date conflicts with an existing booking"
                }
            });
        };

        if (startDateCheck < bookingStart && endDateCheck > bookingEnd) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        };
    };

    booking.set({
        spotId: booking.spotId,
        userId,
        startDate,
        endDate
    });

    await booking.save();

    const editedBooking = await Booking.findByPk(bookingId);

    res.json(editedBooking);

});


//delete a booking - URL: /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { user } = req;
    let booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        return res.status(404).json({
            message: `Booking couldn't be found`
        })
    }

    const start = Date.now()
    let currentDate = new Date(start).toDateString()
    currentDate = new Date(currentDate).getTime()

    let bookingStartDate = booking.startDate
    bookingStartDate = new Date(bookingStartDate).toDateString()
    bookingStartDate = new Date(bookingStartDate).getTime()

    if (currentDate > bookingStartDate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        })
    }

    if (user.id === booking.userId) {
        await booking.destroy();

        return res.json({
            "message": "Successfully deleted"
        })
    } else {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
})









module.exports = router;
