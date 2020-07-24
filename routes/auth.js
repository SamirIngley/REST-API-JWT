const router = require('express').Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {  // asyn bc db needs time
    const user = new User({
        name: req.body.name, // coming from request body - we are creating a user
        email: req.body.email, // but we can't actually read straight from here, we need a bodyParser
        password: req.body.password
    });

    try{ // to submit
        const savedUser = await user.save()
        res.send(savedUser);
    } catch(err){
        res.status(400).send(err);
    }
});


module.exports = router;