
// This example creates circles on the map

/**
 * TODOs
    * - Center map on current location
    * - Set (multiple) markers on map
    * - Draw 'x' mile radius circles around markers
        - if circles don't intersect, increase until they do?
    * - Search where circles intersect
    */

var createSearch = function(map){
    var markers = [];
    // Create the search box and link it to the UI element.
    var input = document.getElementById('target');
    var searchBox = new google.maps.places.SearchBox(input);

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    // [END region_getplaces]

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

}


// Peoplemap for separate person-as-circle representation
var peopleMap = {};
peopleMap['ralph'] = {
  center: new google.maps.LatLng(51.544205, -0.05421499),
  size: 2000,
  strokeColor: 'rgba(250,50,50,0.5)',
  fillColor: 'rgba(200,30,30,0.8)',
};
peopleMap['siobhan'] = {
  center: new google.maps.LatLng(51.534205, -0.07421499),
  size: 2000,
  strokeColor: 'rgba(50,250,50,0.5)',
  fillColor: 'rgba(30,200,30,0.8)',

};
peopleMap['dan'] = {
  center: new google.maps.LatLng(51.51805, -0.06121499),
  size: 2000,
  strokeColor: 'rgba(50,50,250,0.5)',
  fillColor: 'rgba(30,50,200,0.8)',

};
var cityCircle;

function attachOnclicks(map){
    google.maps.event.addListener(map, 'click', function(e) {
        console.log('click',e);
    });

}

function initialize() {
  // Create the map.
  var mapOptions = {
    zoom: 13,
    // 51.5072° N, 0.1275
    // center: new google.maps.LatLng(37.09024, -95.712891),
    center: new google.maps.LatLng(51.544205, -0.05421499),
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map(document.getElementById('map-canvas'),
  mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,
             position.coords.longitude);

          var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'Location found using HTML5.'
        });

          map.setCenter(pos);
      });
    }

    // Attach onclick events
    attachOnclicks(map);
    // Add in search features
    createSearch(map);

  // Construct the circle for each value in citymap.
  // Note: We scale the population by a factor of 20.
  for (var person in peopleMap) {
    var populationOptions = {
      strokeColor: peopleMap[person].strokeColor,
      fillColor: peopleMap[person].fillColor,
      // strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0.35,
      map: map,
      center: peopleMap[person].center,
      radius: peopleMap[person].size
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Circle(populationOptions);
  }


}

google.maps.event.addDomListener(window, 'load', initialize);