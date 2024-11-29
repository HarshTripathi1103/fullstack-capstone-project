/*jshint esversion: 8 */
const express = require('express');
const bcryptjs = require('bcrypt');
const jwt = require('jasonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');
dotenv.config();

const logger = pino();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register',async(req,res) => {
    try{
        const db = await connectToDatabase();

        const collection =  db.collection('users');

        const existingEmail = await collection.findOne({email: req.body.email})

        if (existingEmail) {
            logger.error('Email already exists');
            return res.status(400).json({error: 'Email id already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const email = req.body.email;

        const newUser = await collection.insertOne({
            email:req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password:hash,
            createAt: new Date()
        })

        const payload = {
            user:{
                id: newUser.insertedId,
            }
        }

        const authtoken =  jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({authtoken,email});


    } catch (error){
        logger.error(error)
        return res.status(500).send("internal server error")
    }
})

router.post('/login' ,async (req,res) => {
    console.log('inside login route')

    try{
        const db = await connectToDatabase()
        const collection  = db.collection('users')
        const theUser = await collection.findOne({email:req.body.email});

        if(theUser) {
            let result = await bcryptjs.compare(req.body.password,theUser.password);
            if(!result){
                logger.error("passwords do not match");
                return res.status(400).json({error: 'Invalid credentials'});
            }
            let payload = {
                user: {
                    id: theUser._id.toString(),
                }
            };
            const userName = theUser.firstName;
            const userEmail = theUser.email;

            const authtoken = jwt.sign(payload,JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({authtoken,userName,userEmail});
        } else {
            logger.error('User not found');
            return res.status(400).json({error: 'Invalid credentials, User not found'});
        }
    } catch(e){
        logger.error(e);
        return res.status(500).send('Internal server error', details: e.message);
    }
})
