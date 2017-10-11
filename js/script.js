const version = '?v=20170901'
const clientid = '&client_id=4HLUBBPKV5WMSV24VMTVWA44LVSV1TQENTFUNETMJRVZAPVH'
const clientSecret = '&client_secret=T0S3T3XZ5JKIJYI31QDPLPF5JVEWCGHWVNRLA1GUFN5ZVK0D'
const apiKey = version +clientid+ clientSecret;


(function(){

  var username = 'tamari';



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDxiV9MhgYqV4VHwse-d94t0yikuvhtqtI",
    authDomain: "scenic-spots.firebaseapp.com",
    databaseURL: "https://scenic-spots.firebaseio.com",
    projectId: "scenic-spots",
    storageBucket: "scenic-spots.appspot.com",
    messagingSenderId: "148448140954"
  };
  firebase.initializeApp(config);

  var firebaseRef = firebase.database().ref().push();

  var geoFire = new GeoFire(firebaseRef);


  displayMap();

  function displayMap() {
    var city;
    const version = '?v=20170901'
    const clientid = '&client_id=4HLUBBPKV5WMSV24VMTVWA44LVSV1TQENTFUNETMJRVZAPVH'
    const clientSecret = '&client_secret=T0S3T3XZ5JKIJYI31QDPLPF5JVEWCGHWVNRLA1GUFN5ZVK0D'
    const apiKey = version +clientid+ clientSecret;
    var doneCities = [];
    var map = L.map("map", {
        zoomControl: false,
        minZoom: 16,
        attributionControl: false
        //... other options
    });

  var foodIcon = L.divIcon({
    className: 'mapIcon mapIcon--food',
    iconSize: [50, 50],
    iconAnchor:[50, 50],
    html: '<div class="mapIcon__stalk mapIcon__stalk--food"></div><div class="mapIcon__image mapIcon__image--food"></div>'
  });

  var motelIcon = L.divIcon({
    className: 'mapIcon mapIcon--motel',
      iconSize: [50, 50],
      iconAnchor:[50, 50],
    html: '<div class="mapIcon__stalk mapIcon__stalk--motel"></div><div class="mapIcon__image mapIcon__image--motel"></div>'
  });

  var scenicIcon = L.divIcon({
    className: 'mapIcon mapIcon--scenic',
    iconSize: [50, 50],
      iconAnchor:[50, 50],
    html: '<div class="mapIcon__stalk mapIcon__stalk--scenic"></div><div class="mapIcon__image mapIcon__image--scenic"></div>'
  });

  var savedIcon = L.divIcon({
    className: 'mapIcon mapIcon--saved',
    iconSize: [50, 50],
        iconAnchor:[50, 50],
    html: '<div class="mapIcon__stalk mapIcon__stalk--saved"></div><div class="mapIcon__image mapIcon__image--saved"></div>'
  });



    var getLocation = function() {
      if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      console.log("getting location");
      navigator.geolocation.getCurrentPosition( geolocationCallback);
      map.locate({setView: true, maxZoom: 16});
    } else {
        console.log("rats.")
    }
  };

  var geolocationCallback = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    console.log("you are here i think: [" + latitude + ", " + longitude + "]");


    geoFire.set(username, [latitude, longitude]).then(function() {
      console.log( username + " found");


      firebaseRef.child(username).onDisconnect().remove();



    });
  };

  var markerIcon = L.icon({
         iconUrl: '../img/pin.svg',
         iconSize:     [60, 95],
         iconAnchor:   [30, 40], // point of the icon which will correspond to marker's location
    })

  map.on('locationfound', onLocationFound);

  function onLocationFound(e) {
    var radius = e.accuracy * 5;

    L.marker((e.latlng),{icon:markerIcon}).addTo(map)
        .bindPopup( username + "'s position").openPopup();



    let lat = e.latlng.lat
    let lng = e.latlng.lng

    doMapThings(lat, lng);
}

  getLocation();

function doMapThings(lat,lng) {
      var corner1 = L.latLng(-36.815135, 174.716778),
          corner2 = L.latLng(-36.912724, 174.816856);

          var bounds = L.latLngBounds(corner1, corner2);

          lat = -36.86667;
          lng =	174.76667;

          var center = [lat, lng];

          map.setView(center, 14);

          L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFpdnZpIiwiYSI6ImNqNmxncmoyMjFyZGMyeG1xN3Yyejk4dHIifQ.O7Bby6q1Jbn8v9ANa4_P5w', {foo: 'bar'}).addTo(map);
          L.circle(center, {radius: 2500, fill: false, color: '#000'}).addTo(map);

          map.setMaxBounds(bounds);

          let userLocation = [lat, lng];

            var foodRequest = {
               location: { lat: parseFloat(lat),
                        lng: parseFloat(lng),
                      },
               radius: '500',
               type: ['restaurant']
             };
            var hotelRequest = {
                location: { lat: parseFloat(lat),
                         lng: parseFloat(lng),
                       },
                radius: '500',
                type: ['hotel']
            };


          let serviceHolder = document.querySelector('.serviceHolder');

          let foodlocales = [];
          let hotellocales = [];
          let testresults;

            service = new google.maps.places.PlacesService(serviceHolder);

              let foodsearch = new Promise((resolve, reject) => {
                  service.nearbySearch(foodRequest, function(results, status) {
                    for (let i = 0; i < results.length; i++) {

                      // REMEMBER OT PUT  BACK:  let venuelocation = [results[i].geometry.location.lat(), results[i].geometry.location.lng()];
                         let venuelocation = [results[i].geometry.location.lat(), results[i].geometry.location.lng()];
                         if (results[i].types.includes('restaurant')) {
                          let marker = L.marker(venuelocation, {icon:foodIcon}).addTo(map);
                          foodlocales.push(results[i]);
                          }
                      }

                  resolve(foodlocales);
                  });

        })

          let hotelsearch = new Promise((resolve, reject) => {
              service.nearbySearch(hotelRequest, function(results, status) {
                for (let i = 0; i < results.length; i++) {
                     let venuelocation = [results[i].geometry.location.lat(), results[i].geometry.location.lng()];
                     if (results[i].types.includes('restaurant')) {
                      let marker = L.marker(venuelocation, {icon:motelIcon}).addTo(map);
                      hotellocales.push(results[i]);
                      }
                  }

              resolve(hotellocales);
              });

    })

    Promise.all([foodsearch, hotelsearch]).then(values => {
      let allvenues = values[0].concat(values[1])
      console.log(allvenues);
      let venuephotos = [];

      for (let i = 0; i < allvenues.length; i++) {

        if (allvenues[i].photos) {
        venuephotos.push(allvenues[i].photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500}))
        } else {
          venuephotos.push(null)
        }
      }

      let venueInfoBox = document.querySelector('.venueInfo');
      let venueInfoImg = document.querySelector('.venueInfo__img');

      venueInfoImg.style.backgroundImage = "url('" + venuephotos[1] + "')"

    })



    }
}
})();

var nearbyLocation = document.querySelector('#nearby');
nearbyLocation.addEventListener('click', changePage);

var searchIcon = document.querySelector('.header__searchIcon');
var searchBar = document.querySelector('.header__searchBar');

var frontPage = document.querySelector('.frontpage-container');
var mainPage = document.querySelector('.mainpage-container');
searchIcon.addEventListener('click', displaySearch);

let searchActive = 0;

function displaySearch() {

  if (!searchActive) {
  searchIcon.classList.add('header__searchIcon--active')
    searchBar.classList.add('header__searchBar--active')
  searchActive = 1;
  }

  else if (searchActive) {
    searchIcon.classList.remove('header__searchIcon--active')
    searchBar.classList.remove('header__searchBar--active')
    searchActive = 0;
  }
}

function changePage() {
    mainPage.classList.remove('hide');
      frontPage.classList.add('translatex');
      mainPage.classList.add('translatemain');

    frontPage.addEventListener("transitionend", function(event) {
  frontPage.classList.add('hide');
}, false);

}
