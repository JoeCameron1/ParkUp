/**
 * Results.js
 * Map Results
 */

$(".description").click(function (e) {
    var details = $('#details');
    var reviews = $('#reviews');
    details.show();
    reviews.show();

    var price = $(this).parent().parent().parent().find('.pr').html();
    var rating = $(this).parent().parent().parent().find('span.stars').clone();
    var distance = $(this).parent().parent().parent().find('.distance').html();
    var description = $(this).html();

    details.find('.price').html(price);
    details.find('.rating').html(rating);
    details.find('.distance').html(distance);
    details.find('.description').html(description);

    var review_class = $('.review');
    var review_length = review_class.size();
    review_class.each(function( index ) {
        if (index == 0) {
            $(this).css('border-top-left-radius', '5px');
            $(this).css('border-top-right-radius', '5px');
            $(this).css('border-bottom', 'none');
        } else if (index == review_length - 1) {
            $(this).css('border-bottom-left-radius', '5px');
            $(this).css('border-bottom-right-radius', '5px');
        } else {
            $(this).css('border-bottom', 'none');
        }
    });

    $('footer').css('border-top', 'solid #444444')
});

$.fn.stars = function() {
    return $(this).each(function() {
        // Get the value
        var val = parseFloat($(this).html());
        // Make sure that the value is in 0 - 5 range, multiply to get width
        var size = Math.max(0, (Math.min(5, val))) * 16;
        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);
    });
}

$(function() {
    $('span.stars').stars();
});