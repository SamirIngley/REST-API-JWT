const router = require('express').Router();
const User = require('../models/User');


// VALIDATION
const Joi = require('@hapi/joi')

const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
})

router.post('/register', async (req, res) => {  // asyn bc db needs time

    // Let's validate the data before we make a user
    const {error} = schema.validate(req.body);
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