const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Favourites = require('../models/favourites');

router.use(express.json());


router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyOrdinaryUser, async (req, res, next)=>{

    try{
        let favourite = await Favourites.findOne({"user": req.user._id}).populate(['user','dishes']);
        if(!favourite){
            res.sendStatus(404);
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favourite);
        }
    }catch(err){
        next(err);
    }
    
});
router.post('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, async (req, res, next)=>{
    try{
        //checks if the user already exists
        let favourite = await Favourites.findOne({"user" : req.user._id});
        if(!favourite){
            favourite = new Favourites({
                user: req.user._id,
                dishes: req.body
            });
    
            favourite = await favourite.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favourite);
        }
        else{
            let dishes = favourite.dishes;
            let newDishes = req.body;
            //user exists but no favs
            if(dishes.length==0){
                favourite.dishes = newDishes.map(i=>{
                    return i._id;
                });
                favourite = await favourite.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            }
            //user exists with existing favs and req body not empty
            if(newDishes.length>0 && dishes.length>0){
                for(let i=0; i<newDishes.length; i++){
                    if(dishes.indexOf(newDishes[i]._id)<0) 
                    {
                        favourite.dishes.push(newDishes[i]._id);
                    }
                }

                favourite = await favourite.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
                }
            
                //implement 304 status code edge case later if dishes already in favourites
        }
    }catch(err){
        return next(err);
    }
})

router.post('/:dishId', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, async (req, res, next)=>{
    try{
        //checks if the user already exists
        let favourite = await Favourites.findOne({"user" : req.user._id});
        if(favourite){
            //checks if dish already in favourites
            let inFavourites = await Favourites.findOne({"dishes.dish": {$in : [req.params.dishId]}});
            //promise returns null if does not exits
            if(!inFavourites){
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                res.json({favourites: favourite, statusCode: 409, success: false, msg: "DUPLICATE ENTRIES NOT ALLOWED"});
            }else{
            //updates list of user favourites
            favourite = await Favourites.findOneAndUpdate({"user": req.user._id}, {$push: {"dishes": [req.params.dishId]}}, {new: true});
            favourite = await favourite.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favourite);
            }
        }else{

        favourite = new Favourites({
            user: req.user._id,
            dishes: req.params.dishId
        });

        favourite = await favourite.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
    }
    }catch(err){
        return next(err);
    }

});

router.delete('/:dishId', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyOrdinaryUser, async (req, res, next)=>{
    try{
        // let goneFav = await Favourites.findOneAndUpdate({"user": req.user._id}, {$pull : {dishes: {$elemMatch: req.params.dishId}}});
        let goneFav = await Favourites.findOneAndUpdate({"user": req.user._id}, {$pull : {dishes: req.params.dishId}});
        if(!goneFav){
            res.sendStatus(400);
        }else{
        goneFave = await goneFav.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goneFav);
        }
    }catch(err){
       return next(err);
    }
})

module.exports = router;