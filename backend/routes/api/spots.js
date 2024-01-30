const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Spot, SpotImage } = require('../../db/models');


router.get('/', async (req, res) => {
    const spots = await Spot.findAll(
        {
            attributes: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng',
                'name', 'description', 'price', 'createdAt', 'updatedAt', 'previewImage',
                'avgRating'
            ]
        }
    );
    res.status(200).json({ Spots: spots })
})


module.exports = router;
