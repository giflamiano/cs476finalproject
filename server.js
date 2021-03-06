// server.js

// BASE SETUP

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
var Item = require('./model/model.js');
mongoose.connect('mongodb://testUser:testPass@cluster0.s5va0.mongodb.net/SmokestackDB?retryWrites=true&w=majority');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


// more routes for our API will happen here

// on routes that end in /items
router.route('/items')

    // create an item (accessed at POST http://localhost:8080/api/items)
    .post(function(req, res) {

        var item = new Item(); 
        item.name = req.body.name;  

        // save the bear and check for errors
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item created!' });
        });

    })

    // get all the items (accessed at GET http://localhost:8080/api/items)
    .get(function(req, res) {
        Item.find(function(err, items) {
            if (err)
                res.send(err);

            res.json(items);
        });
    });

// on routes that end in /items/:item_id
router.route('/items/:item_id')

    // get the item with that id (accessed at GET http://localhost:8080/api/items/:item_id)
    .get(function(req, res) {
        Item.findById(req.params.item_id, function(err, item) {
            if (err)
                res.send(err);
            res.json(item);
        });
    })

    // update the item with this id (accessed at PUT http://localhost:8080/api/items/:item_id)
    .put(function(req, res) {

        Item.findById(req.params.item_id, function(err, item) {

            if (err)
                res.send(err);

            item.name = req.body.name; 

            item.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Item updated!' });
            });

        });
    })

    // delete the item with this id (accessed at DELETE http://localhost:8080/api/items/:item_id)
    .delete(function(req, res) {
        Item.remove({
            _id: req.params.item_id
        }, function(err, item) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);