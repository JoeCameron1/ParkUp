/**
 * ParkUp.js
 * ParkUp Entry Point
 */

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var multer  =   require('multer');

var parkUpRoutes = require('./routes/parkup-routes');

// Methods for uploading pictures
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './assets/img/listings/');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '_' + Date.now() + '.jpg');
    }
});
var upload = multer({ storage : storage}).single('img');

var parkUp = express();
parkUp.use(express.static(__dirname + '/assets'));
parkUp.use(express.static(__dirname + '/'));

parkUp.use(bodyParser.json());
parkUp.use(bodyParser.urlencoded({
    extended: true
}));


// REST API
parkUp.get('/results', parkUpRoutes.getListings);
parkUp.get('/userByName', parkUpRoutes.getUserByName);

parkUp.post('/results', function(req, res) {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        console.log('uplaoded');
        parkUpRoutes.insertListing(req, res);
    });
});

parkUp.post('/reviews', parkUpRoutes.insertReview);

parkUp.post('/updateListing', parkUpRoutes.updateListing);


// Start server
parkUp.listen(process.env.PORT || 3000);
console.log('Listening on port 3000 (go to http://localhost:3000 on your web browser)');