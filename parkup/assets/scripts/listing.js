/*
Functionality using lightbox for new listing form on profile page
*/
function newListingForm() {
    $('#lightbox').fadeIn();
    $('#listing').fadeIn();
}

function list() {
    console.log("list");
    $('#listing').fadeIn();
}

$('#lightbox, #closeLightbox').on('click', function(event) {
    $('#lightbox, #lenderForm, #listing').fadeOut();
});