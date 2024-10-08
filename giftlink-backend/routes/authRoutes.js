const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  

const logger = pino()

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {

    try{
        //Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js
    const db = await connectToDatabase();


    //Get the user collection
    const userCollection = db.userCollection('users');
   
    //Check for existing email
    const user = await userCollection.findOne({ email: req.body.email });

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;
   

    //Save user details in database
    await userCollection.insertOne({ 
        email: email, 
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        createdAt: new Date()});
    //Create JWT authentication with user._id as payload
    const payload = {
        user: {
            id: newUser.insertedId,
        }
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    logger.info(`Registering user with email: ${email}`);
    res.json({ token,email});
    } catch (error) {
        logger.error(`Error registering user: ${error}`);
        res.status(500).send('Server error');
    }
});

module.exports = router;