const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Username is required'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

//sign up
router.post('/', validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });

});


// router.post('/', async (req, res) => {
//     const { email, password, username } = req.body;
//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ email, username, hashedPassword });

//     const safeUser = {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//         user: safeUser
//     });
// }
// );



module.exports = router;
