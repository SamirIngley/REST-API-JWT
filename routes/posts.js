const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../models/User');

// CREATING A PRIVATE ROUTE
router.get('/', verify, (req,res) => {
    // since we set the token with the id of the user, we can get the user info as long as we provide the token
    // res.send(req.user) 
    // User.findOne({_id: req.user})
    res.json({posts: 
        {title: 'SECRET POST', 
        description: 'SECRET DATA // MEMBERS ONLY'
        }
    })
})


module.exports = router;
