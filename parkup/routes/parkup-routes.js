/**
 * parkup-routes.js
 */


var fs = require("fs");

var utils = require('../utils/utils');

// import listings data
var contents = fs.readFileSync("listings.json");
var parsedData = JSON.parse(contents);
var parsedListings = parsedData.listings;
var elementsNum = utils.getLength(parsedListings);

// import user data
var contents_users = fs.readFileSync("user.json");
var parsedData_users = JSON.parse(contents_users);
var parsedUsers = parsedData.users;


exports.getListings = function(req, res) {

    for (var i = 0; i < parsedListings.length; i++) {
        parsedListings[i].rating = computeRating(parsedListings[i]);
    }

    var listingsJson = JSON.stringify({'listings': parsedListings});

    res.send(listingsJson);
}

exports.insertListing = function(req, res) {
    var listing = new Object();
    listing.title = req.body.title;
    listing.price = req.body.price;
    listing.owner = req.body.firstName + " " + req.body.lastName;
    listing.location = assignLocation(req.body.address);
    listing.free = 'y';
    listing.id = elementsNum;
    listing.reviews = [];

    if (req.file) {
        if (req.file.fieldname == "img") {
            listing.image = req.file.filename;
        }
    }

    console.log(listing);

    parsedListings.push(listing);

    elementsNum++;

    var listingJSON = JSON.stringify(listing);

    res.redirect('./assets/html/profilePage.html');
}

exports.updateListing = function(req, res) {
    var id = req.body.id;

    var title = req.body.description;
    var price = req.body.price + "$/day";
    var free = req.body.free;

    for (var listing of parsedListings) {
        if (listing.id == id) {
            listing.title = title;
            listing.price = price;
            listing.free = free;
        }
    }
}

exports.insertReview = function(req, res) {
    var id = req.body.id;

    var description = req.body.description;
    var rating = parseInt(req.body.rating);

    for (var listing of parsedListings) {
        if (listing.id == id) {
            listing.reviews.push({description: description, rating: rating});
        }
    }
}


exports.getUsers = function(req, res) {

    for (var i = 0; i < parsedUsers.length; i++) {
        parsedUsers.rating = computeRating(user);
    }

    var usersJson = JSON.stringify({'users': parsedUsers});
    console.log(parsedUsers);
    res.send(parsedUsers);

}

exports.getUserByName = function(req, res) {

    var firstName = req.query.firstName;
    var lastName = req.query.lastName;



}


function computeRating(item) {
    var rating = 0;
    var numOfReviews = 0;
    for (var review of item.reviews) {
        rating += review.rating;
        numOfReviews += 1;
    }
    if (numOfReviews > 0) {
        var result = rating / numOfReviews;
        return result + "/5";
    }

    return "0/5";
}


function assignLocation(address) {
    var map = [];
    map.push({  address : 'Robarts Library, 130 St George St, Toronto, ON M5S 1A5',
                location : {"lat" : 43.6644617, "lng" : -79.4011319}});
    map.push({  address : 'Royal Ontario Museum, 100 Queens Park, Toronto, ON M5S 2C6',
                location : {"lat" : 43.6677136, "lng" : -79.3969658}});
    map.push({  address : '176, Robert Street, Toronto, ON',
                location : {"lat" : 43.6621381, "lng" : -79.4059259}});
    map.push({  address : 'Robert Gill Theatre, 214 College St, Toronto, ON M5T 2Z9',
                location : {"lat" : 43.6621381, "lng" : -79.4059259}});
    map.push({  address : 'Rol San Restaurant, 323 Spadina Ave, Toronto, ON M5T 2E9',
                location : {"lat" : 43.6544272, "lng" : -79.4003041}});
    map.push({  address : 'Roy Thomson Hall, 60 Simcoe St, Toronto, ON M5J 2H5',
                location : {"lat" : 43.6470192, "lng" : -79.3882808}});
    map.push({  address : 'Royal York Station, Toronto, ON M8X 2E6',
                location : {"lat" : 43.6481812, "lng" : -79.5134528}});

    for (var i = 0; i < map.length; i++) {
        if (address.localeCompare(map[i].address) == 0) {
            return map[i].location;
        }
    }
}




