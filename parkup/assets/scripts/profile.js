/**
 * profile.js
 * Profile Page JavaScript
 */

var idForReview = -1;
var idForEdit = -1;

$(document).ready(function() {

    $.get('/results', function(data) {
        var temp = JSON.parse(data);
        var listings = temp.listings;

        // Renting tab
        var rowsId = ["firstRowRenting", "secondRowRenting", "thirdRowRenting", "firstRowLending", "secondRowLending", "thirdRowLending"];
        for (var i = 0; i < 6; i++) {
            var row = rowsId[ i / 2 ];
            var img_path = "../img/listings/" + listings[i].image;

            var card1 = "<div class=\"col-sm-6\">" +
                          "<div class=\"panel panel-warning\">" +
                            "<div class=\"panel-body\">" +
                              "<div class=\"col-xs-4\">" +
                                "<img src=" + img_path + " class=\"img-responsive\" />" +
                              "</div>" +
                              "<div class=\"col-xs-8\">" +
                                "<span class=\"stars pr\">" + listings[i].rating + "</span>" +
                                "<p>Price = " + listings[i].price + "</p>" +
                                "<p>Availability = " + listings[i].free + "</p>" +
                              "</div>" +
                            "</div>" +
                            "<div class=\"panel-footer\">" +
                              "<button type=\"button\" class=\"btn btn-success btn-block\" onclick=\"addReview(" + listings[i].id + ")\">Add Review</button>" +
                            "</div>" +
                            "<input type=\"hidden\" value=" + listings[i].id + ">" +
                          "</div>" +
                         "</div>";

            i++;

            img_path = "../img/listings/" + listings[i].image;
            var card2 = "<div class=\"col-sm-6\">" +
                          "<div class=\"panel panel-warning\">" +
                            "<div class=\"panel-body\">" +
                              "<div class=\"col-xs-4\">" +
                                "<img src=" + img_path + " class=\"img-responsive\" />" +
                              "</div>" +
                              "<div class=\"col-xs-8\">" +
                                "<span class=\"stars pr\">" + listings[i].rating + "</span>" +
                                "<p>Price = " + listings[i].price + "</p>" +
                                "<p>Availability = " + listings[i].free + "</p>" +
                              "</div>" +
                            "</div>" +
                            "<div class=\"panel-footer\">" +
                              "<button type=\"button\" class=\"btn btn-success btn-block\" onclick=\"addReview(" + listings[i].id + ")\">Add Review</button>" +
                            "</div>" +
                            "<input type=\"hidden\" value=" + listings[i].id + ">" +
                           "</div>" +
                         "</div>";

            var html = card1 + card2;
            $('#' + row).append(html);
        }

        // Lending tab
        for (var i = 6; i < 12; i++) {
            var row = rowsId[ i / 2 ];
            var img_path = "../img/listings/" + listings[i].image;

            var card1 = "<div class=\"col-sm-6\">" +
                          "<div class=\"panel panel-warning\">" +
                            "<div class=\"panel-body\">" +
                              "<div class=\"col-xs-4\">" +
                                "<img src=" + img_path + " class=\"img-responsive\" />" +
                              "</div>" +
                              "<div class=\"col-xs-7\">" +
                                "<span class=\"stars pr\">" + listings[i].rating + "</span>" +
                                "<p>Price = " + listings[i].price + "</p>" +
                                "<p>Availability = " + listings[i].free + "</p>" +
                              "</div>" +
                              "<div class=\"col-xs-1\">" +
                                "<button type=\"button\" class=\"btn btn-xs\" onclick=\"editPost(" + listings[i].id + ")\">" +
                                  "<span class=\"glyphicon glyphicon-pencil\"></span>" +
                                "</button>" +
                              "</div>" +
                            "</div>" +
                            "<div class=\"panel-footer\">" +
                                "<button type=\"button\" class=\"btn btn-success btn-block\" onclick=\"bookNow()\">Book</button>" +
                            "</div>" +
                            "<input type=\"hidden\" value=" + listings[i].id + ">" +
                           "</div>" +
                         "</div>";

            i++;

            img_path = "../img/listings/" + listings[i].image;
            var card2 = "<div class=\"col-sm-6\">" +
                          "<div class=\"panel panel-warning\">" +
                            "<div class=\"panel-body\">" +
                              "<div class=\"col-xs-4\">" +
                                "<img src=" + img_path + " class=\"img-responsive\" />" +
                              "</div>" +
                              "<div class=\"col-xs-7\">" +
                                "<span class=\"stars pr\">" + listings[i].rating + "</span>" +
                                "<p>Price = " + listings[i].price + "</p>" +
                                "<p>Availability = " + listings[i].free + "</p>" +
                              "</div>" +
                              "<div class=\"col-xs-1\">" +
                                "<button type=\"button\" class=\"btn btn-xs\" onclick=\"editPost(" + listings[i].id + ")\">" +
                                  "<span class=\"glyphicon glyphicon-pencil\"></span>" +
                                "</button>" +
                              "</div>" +
                            "</div>" +
                            "<div class=\"panel-footer\">" +
                                "<button type=\"button\" class=\"btn btn-success btn-block\" onclick=\"bookNow()\">Book</button>" +
                            "</div>" +
                            "<input type=\"hidden\" value=" + listings[i].id + ">" +
                           "</div>" +
                         "</div>";

            var html = card1 + card2;
            $('#' + row).append(html);
        }
        $('span.stars').stars();        // visualize ranking as stars

    });

});


function addUser() {
    $('#lightbox').fadeIn();
    $('#addUser').fadeIn();
}

function add() {
    console.log("add");
    $('#postBooking').fadeIn();
}

function addReview(id) {
    $('#lightbox').fadeIn();
    $('#addReview').fadeIn();

    idForReview = id;
}

function review() {
    console.log("add");
    $('#postAddReview').fadeIn();

    var description = $('#descriptionForReview').val();
    var rating = $('#ratingForReview').val();

    $.post('/reviews',   {
                            id : idForReview,
                            rating : rating,
                            description : description
                        }
    );

    idForReview = -1;
}

function editPost(id) {
    $('#lightbox').fadeIn();
    $('#editing').fadeIn();

    idForEdit = id;
}

function edit() {
    console.log("edit");
    $('#postEdit').fadeIn();

    var price = $('#priceForEdit').val();
    var free = $('#availabilityForEdit').val();
    var description = $('#descriptionForEdit').val();


    $.post('/updateListing',   {
                            id : idForEdit,
                            price : price,
                            description : description,
                            free : free
                        }
    );

    idForEdit = -1;
}

function editDelete() {
    console.log("delete");
    $('#postEdit').fadeIn();
}

function newListingForm() {
    console.log("new form");
    $("lenderForm").faceIn();
}

$('#lightbox, #closeLightbox').on('click', function(event) {
    $('#lightbox, #addUser, #postAddUser, #addReview, #postAddReview, #editing, #postEdit').fadeOut();
});