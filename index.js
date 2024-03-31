var markers = [];
var map;
var directionsService;
var directionsRenderer;
var infoWindow;

function initMap() {
  var center = { lat: 40.12150192260742, lng: -100.45039367675781 };
  map = new google.maps.Map(document.getElementById('mapframe'), {
    zoom: 5,
    center: center
  });
  map.addListener('click', function(event) {
    addMarker(event.latLng, map);
  });
  initSearchBox();
  infoWindow = new google.maps.InfoWindow();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}

//fucntion 1, user can add marker anywhere they want on the map, upon hover the coordinates will display
function addMarker(location, map) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  marker.addListener('click', function() {
    removeMarker(marker);
  });
  marker.addListener('mouseover', function() {
    showMarkerDetails(marker);
  });
  marker.addListener('mouseout', function() {
    infoWindow.close();
  });
  markers.push(marker);
}

//user can also remove marker by clicking on them again
function removeMarker(marker) {
  var index = markers.indexOf(marker);
  if (index !== -1) {
    marker.setMap(null);
    markers.splice(index, 1);
  }
}

function showMarkerDetails(marker) {
  infoWindow.setContent('<div style="color: black;">Marker position: ' + marker.getPosition().toString() + '</div>');
  infoWindow.open(map, marker);
}

//Function 2: top search box allows the user to manually search for any place, upon doing so will go there and place a marker
//Function3: bottom search boxes allow the user to create a route between 2 places. 
function initSearchBox() {
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    places.forEach(function(place) {
      addMarker(place.geometry.location, map);
    });
  });

  var input1 = document.getElementById('pac-input-1');
  var input2 = document.getElementById('pac-input-2');
  var button1 = document.getElementById('pac-input-3');

  var searchBox1 = new google.maps.places.SearchBox(input1);
  var searchBox2 = new google.maps.places.SearchBox(input2);

  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input1);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input2);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(button1);

  map.addListener('bounds_changed', function() {
    searchBox1.setBounds(map.getBounds());
    searchBox2.setBounds(map.getBounds());
  });
}

function findRoute() {
  var start = document.getElementById('pac-input-1').value;
  var end = document.getElementById('pac-input-2').value;
  if (!start || !end) {
    alert('Please enter both start and end locations.');
    return;
  }
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    } else {
      alert('Route calculation failed due to ' + status);
    }
  });
}

//key=AIzaSyAOM8nEO2MVUlGhxmHIWVDwGAoyf-G0Zak