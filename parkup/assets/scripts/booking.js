/**
 * booking.js
 * Booking Form JavaScript
 */
function bookNow() {
    $('#lightbox').fadeIn();
    $('#booking').fadeIn();
}

function pay() {
    console.log("pay");
    $('#postBooking').fadeIn();
}

$('#lightbox, #closeLightbox').on('click', function(event) {
    $('#lightbox, #booking, #postBooking').fadeOut();
});