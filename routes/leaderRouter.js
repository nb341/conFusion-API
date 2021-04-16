const express = require('express');
const leaderRouter = express.Router();
var authenticate = require('../authenticate');
const Leaders = require('../models/leaders');

leaderRouter.use(express.json());

leaderRouter.get(`/`, (req, res, next) =>{
   
    Leaders.find()
    .then(leaders => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, err=>next(err))
    .catch(err=>next(err));
    
});

leaderRouter.get(`/:leaderId`,(req, res, next) =>{
   
    Leaders.findById(req.params.leaderId)
    .then(leaders => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, err=>next(err))
    .catch(err=>next(err));
    
})

leaderRouter.post('/',authenticate.verifyUser, (req, res)=>{
    Leaders.create(req.body)
    .then( leader => {
        console.log(`leader created ${leader}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});


leaderRouter.put('/:leaderId', authenticate.verifyUser, (req, res, next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true}
        )
        .then( leader => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);            
        }, err=> next(err) )
        .catch(err => next(err));
});

leaderRouter.delete('/:leaderId', authenticate.verifyUser, (req, res, next)=>{
    Leaders.findOneAndDelete({'_id': req.params.leaderId})
        .then( leader => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);            
        }, err=> next(err) )
        .catch(err => next(err));
});






// leaderRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req,res,next) => {
//     res.end('Will send all the leaders to you!');
// })
// .post((req, res, next) => {
//     res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /leaders');
// })
// .delete((req, res, next) => {
//     res.end('Deleting all leaders');
// });

// leaderRouter.route('/:leaderId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res, next)=>{
//     res.end(`Will send leader ${req.params.leaderId}`);
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end(`Post operation not supported on /leaders/${req.params.leaderId}`);
// })
// .put((req, res, next)=>{
//     res.end(`Will update leader ${req.params.leaderId}`)
// })
// .delete((req, res, next) => {
//     res.end('Deleting leader ' + req.params.leaderId);
// });
module.exports = leaderRouter;