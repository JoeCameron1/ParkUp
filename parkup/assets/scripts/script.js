var walkingDistanceRadius = 400;        // 5 minutes walking distance, default radius

var map;

var walkingDistanceCircle;

var input;
var searchBox;

// Code from Google Maps APIs - Developers guide
function initMap() {

    var infoWindow = new google.maps.InfoWindow({map: map});

    var initMap = new google.maps.Map(document.getElementById('map'));

    var pos = {
        lat: 43.6629,
        lng: -79.3957
    };

    initMap = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15
    });
    map = initMap;

    // load listings after map loaded as to calculate the distance properly
    google.maps.event.addListenerOnce(initMap, 'tilesloaded', calculateListingsInsideCircle);

    // Create the search box and link it to the UI element.
    input = document.getElementById('addNeighbourhood');
    searchBox = new google.maps.places.SearchBox(input);

    walkingDistanceCircle = new google.maps.Circle({
        strokeColor: '#0606f9',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#75a6f0',
        fillOpacity: 0.35,
        map: map,
        center: map.center,
        radius: walkingDistanceRadius
    });

    calculateListingsInsideCircle();
    
}

$(document).ready(function() {

    // GET /resultsList
    $("#seeResultsList").click(function() {
        window.open("./assets/html/resultsPage.html");
    });

    $('#expandRadius').click(function() {
        walkingDistanceRadius = walkingDistanceRadius * 1.5;
        walkingDistanceCircle.setRadius(walkingDistanceRadius);
        calculateListingsInsideCircle();
    });

    $('#shrinkRadius').click(function() {
        walkingDistanceRadius = walkingDistanceRadius / 1.5;
        walkingDistanceCircle.setRadius(walkingDistanceRadius);
        calculateListingsInsideCircle();
    });



});


function calculateDistanceInKm(distanceFromCenter){
    var walkingSpeedMs = 1.4; //Walking speed in M/S
    var numSecPerMinutes = 60;

    return Math.round(distanceFromCenter / walkingSpeedMs / numSecPerMinutes);
}

function calculateListingsInsideCircle() {
    $.get('/results', function(data) {
        $('#accordion').empty();
        var temp = JSON.parse(data);
        var listings = temp.listings;

        //Through each listing
        for (var i = 0; i < listings.length; i++) {
            var lat = listings[i].location.lat;
            var lng = listings[i].location.lng;
            var coord = new google.maps.LatLng(lat, lng);
            var distanceFromCenter = google.maps.geometry.spherical.computeDistanceBetween(coord, map.center);

            if (distanceFromCenter < walkingDistanceRadius) {

                var card =  "<div class=\"card\">" +
                            "<div class=\"card-header\" role=\"tab\" id=\"heading1\">" +
                            "<h5 class=\"mb-0\">" +
                            "<a class=\"collapsed\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse" + listings[i].id + "\" aria-expanded=\"false\" aria-controls=\"collapse" + listings[i].id + "\">" +
                            "<div class=\"heading\">" +
                            "<h4 class=\"pr\">" + listings[i].price + "</h4>" +
                            "<span class=\"stars pr\">" + listings[i].rating + "</span>" +
                            "</div>" +
                            "<div class=\"heading pull-right\">" +
                            "<h4 class=\"distance\">" + calculateDistanceInKm(distanceFromCenter) + " Minutes Away</h4>" +
                            "<h5 id=\"" + listings[i].id + "\">" + "</h5>" +
                            "</div>" +
                            "</a>" +
                            "</h5>" +
                            "</div>" +

                            "<div id=\"collapse" + listings[i].id + "\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"heading1\">" +
                            "<div class=\"card-block\">" +
                            "<a class=\"description\" onclick=\"updateReviews(" + listings[i].id + ");\" href=\"#details\">" + listings[i].title + "</a>" +
                            "</div>" +
                            "</div>" +
                            "</div>";

                $('#accordion').append(card);
            }
        }
        $('span.stars').stars();        // visualize ranking as stars
    });
}

function isLocationWithinCircle(lat, lng) {
    var coord = new google.maps.LatLng(lat, lng);
    var isInside = google.maps.geometry.poly.containsLocation(coord, walkingDistanceCircle);
    return isInside;
}

// Joseph, Marco, Taylor
function neighbourhoodSearch(){
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        updateWalkingDistanceCircle(place.geometry.location);

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
    map.fitBounds(bounds);
}

function updateWalkingDistanceCircle(position) {
    walkingDistanceCircle.setCenter(position);
    calculateListingsInsideCircle();
}

function updateReviews(id) {
    $.get('/results', function(data) {
        $('#details').empty();
        $('#reviews').empty();
        var temp = JSON.parse(data);
        var listings = temp.listings;
        for (var i = 0; i < listings.length; i++) {
            if (id == listings[i].id) {
                var lat = listings[i].location.lat;
                var lng = listings[i].location.lng;
                var coord = new google.maps.LatLng(lat, lng);
                var distanceFromCenter = google.maps.geometry.spherical.computeDistanceBetween(coord, map.center);
                var img_path = "./assets/img/listings/" + listings[i].image;

                var details =   "<h3>" + listings[i].title + "</h3>" +
                                "<div class=\"row\">" +
                                    "<div class=\"col-xs-3\">" +
                                        "<img class=\"img-responsive\" src=\"" + img_path + "\"/>" +
                                    "</div>" +
                                "</div>" +
                                "<div class=\"row\">" +
                                    "<h4 class=\"price col-lg-2\">" + listings[i].price + "</h4>" +
                                    "<h4 class=\"rating col-lg-2\"><span class=\"starsDetails rating\">" + listings[i].rating + "</span></h4>" +
                                    "<h4 class=\"distance col-lg-8 text-right\">" + calculateDistanceInKm(distanceFromCenter) + " Minutes away</h4>" +
                                "</div>" +
                                "<button onclick=\"bookNow()\" class=\"btn btn-success col-lg-12\">Book Now</button>";

                $('#details').append(details);
                $('span.starsDetails').stars();

                var reviews = "";
                for (var e = 0; e < listings[i].reviews.length; e++) {
                    var r = "<div class=\"review\">" +
                            "<h4>" + listings[i].reviews[e].description + "</h4>" +
                            "<span class=\"starsReviews rating\">" + listings[i].reviews[e].rating + "</span>" +
                            "</div>";
                    reviews += r;
                }
                // reviews += "</div></div>";
                $('#reviews').append(reviews);
                $('span.starsReviews').stars();
            }
        }


    });
    window.location.href = "#reviews";
}