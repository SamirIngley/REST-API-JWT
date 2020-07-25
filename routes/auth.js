const router = require('express').Router();
const User = require('../models/User');
const {registerValidation} = require('../validation');


// validation.js
router.post('/register', async (req, res) => {  // asyn bc db needs time

    const {error} = registerValidation(req.body); // from Joi in validation.js
    if(error) return res.status(400).send(error.details[0].message) // won't continue down to save if error exists

    // res.send(error.details[0].message); // sends back your error message!

    const user = new User({
        name: req.body.name, // coming from request body - we are creating a user
        email: req.body.email, // but we can't actually read straight from here, we need a bodyParser
        password: req.body.password
    });

    try{ // try to submit
        const savedUser = await user.save()
        res.send(savedUser);
    } catch(err){ // else error
        res.status(400).send(err);
    }
});


module.exports = router;