const router = require('express').Router();
const verify = require('./verifyToken');

// CREATING A PRIVATE ROUTE
router.get('/', verify, (req,res) => {
    res.json({posts: 
        {title: 'SECRET POST', 
        description: 'SECRET DATA // MEMBERS ONLY'
        }
    })
})


module.exports = router;
