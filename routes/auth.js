const router = require('express').Router();
const User = require('../models/User');
const {registerValidation} = require('../validation');
const bcrypt = require('bcryptjs')


// validation.js
router.post('/register', async (req, res) => {  // asyn bc db needs time

    // VALIDATE NEW USER
    const {error} = registerValidation(req.body); // from Joi in validation.js
    if(error) return res.status(400).send(error.details[0].message) // won't continue down to save if error exists
    // res.send(error.details[0].message); // sends back your error message!

    // CHECKING IF USER ALREADY EXISTS
    const emailExists = await User.findOne({email: req.body.email}) // go to user model, check if the email passed in already exists
    if(emailExists) return res.status(400).send('Email already exists.')

    // HASH PASSWORDS
    // we hash the password using the salt, complexity of 10
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // CREATE NEW USER
    const user = new User({
        name: req.body.name, // coming from request body - we are creating a user
        email: req.body.email, // but we can't actually read straight from here, we need a bodyParser
        password: hashedPassword
    });

    try{ // try to submit
        const savedUser = await user.save()
        res.send({user: user._id});
    } catch(err){ // else error
        res.status(400).send(err);
    }
});


module.exports = router;