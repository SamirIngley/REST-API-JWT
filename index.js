const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true,
      useUnifiedTopology: true },
    () => console.log('connected to db!')
)

// import routes
const authRoute = require('./routes/auth')


// route middlewares (prefixes)
app.use('/api/user', authRoute);


app.listen(3000, () => console.log('Server up and running'));