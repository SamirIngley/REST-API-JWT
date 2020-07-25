const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



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
        res.send({ user: user._id });
    } catch(err){ // else error
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login', async (req,res) => {

    // VALIDATE NEW USER
    const {error} = loginValidation(req.body); // from Joi in validation.js
    if(error) return res.status(400).send(error.details[0].message) // won't continue down to save if error exists
    // res.send(error.details[0].message); // sends back your error message!

    // CHECKING IF USER ALREADY EXISTS
    const user = await User.findOne({email: req.body.email}) // go to user model, check if the email passed in already exists
    if(!user) return res.status(400).send('Email not found')

    // PASSWORD IS CORRECT
    // when they login from req body, compare it with pword in db
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password')
    
    // CREATE AND ASSIGN JWT
    // we use id bc when we have access to this id, we know user is logged in
    // other param is some secret we create and add to env in dotenv
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);


    res.send('Logged in!')

})


module.exports = router;