const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


//delete a spot image - URL: /api/spot-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const user = req.user.id;
    const spotImage = await SpotImage.findByPk(req.params.imageId, {
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    });

    if (!spotImage) {
        return res.status(404).json({ message: "Spot Image couldn't be found" })
    };

    if (user === spotImage.Spot.ownerId) {
        await spotImage.destroy();
        return res.json({ "message": "Successfully deleted" })
    }
})

module.exports = router;
