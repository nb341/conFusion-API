const mongoose = require('mongoose');
const Promotion = require('../models/promotions');
const express = require('express');
var authenticate = require('../authenticate');
const cors = require('./cors');
const promoRouter = express.Router();
promoRouter.use(express.json());

// Admin Privilleges

// POST, PUT and DELETE operations on /promotions and /promotions/:promoId
promoRouter.options('/',cors.corsWithOptions, (req, res)=>{
    res.sendStatus(200);
});

promoRouter.get(`/`, cors.cors, authenticate.verifyUser, async (req, res) => {
    const promotionList = await Promotion.find();
    if(!promotionList) {
        res.status(500).json({success: false})
    } 
    res.status(200).json(promotionList);
});

promoRouter.post(`/`, cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        const {name, image, label, price, description, featured} = req.body;
        let promotion = new Promotion({
            name: name,
            image: image,
            label: label,
            price: price,
            description: description,
            featured: featured
        });
        
        promotion = await promotion.save();
        res.status(200).json(promotion)
      } catch (error) {
        console.log(error);
        res.status(500).json({ergMsg: "Failed to post new promotion"})
      }
});

promoRouter.get(`/:promoId`, cors.cors, authenticate.verifyUser, async (req, res) => {
    try{
        let promotion = await Promotion.findById(req.params.promoId);
        res.status(200).json(promotion);

    } catch(err){
        console.log(err);
        res.status(500).json({ergMsg: "Failed to get promotion"})
    }
});

promoRouter.delete(`/:promoId`, cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try{
        let promotion = await Promotion.findByIdAndDelete(req.params.promoId);
        res.status(200).json(promotion, {success: "Updated Successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({ergMsg: "Failed to delete promotion"});
    }
});

promoRouter.put('/:promoId' , cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try{
        let promotion = await Promotion.findByIdAndUpdate(req.params.promoId, {$set: req.body});
        res.status(200).json(promotion);
    }catch(err){
        console.log(err);
        res.status(500).json({ergMsg: `Failed to update promotion with Id ${req.params.promoId}`});
    }
})


module.exports = promoRouter;