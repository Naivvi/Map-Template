const version = '?v=20170901'
const clientid = '&client_id=4HLUBBPKV5WMSV24VMTVWA44LVSV1TQENTFUNETMJRVZAPVH'
const clientSecret = '&client_secret=T0S3T3XZ5JKIJYI31QDPLPF5JVEWCGHWVNRLA1GUFN5ZVK0D'
const apiKey = version +clientid+ clientSecret;

let googlebtn = document.querySelector('.google');

var popup = L.popup();

var spots = [''];

var map = L.map("map", {
    zoomControl: false,
    minZoom: 16,
    attributionControl: false
    //... other options
});

var foodIcon = L.divIcon({
  className: 'mapIcon mapIcon--food',
  iconSize: [50, 50],
  iconAnchor: [25, 90],
  html: '<div class="mapIcon__stalk mapIcon__stalk--food"></div><div class="mapIcon__image mapIcon__image--food"></div>'
});

var motelIcon = L.divIcon({
  className: 'mapIcon mapIcon--motel',
    iconSize: [50, 50],
  iconAnchor: [25, 90],
  html: '<div class="mapIcon__stalk mapIcon__stalk--motel"></div><div class="mapIcon__image mapIcon__image--motel"></div>'
});

var scenicIcon = L.divIcon({
  className: 'mapIcon mapIcon--scenic',
  iconSize: [50, 50],
  iconAnchor: [25, 90],
  html: '<div class="mapIcon__stalk mapIcon__stalk--scenic"></div><div class="mapIcon__image mapIcon__image--scenic"></div>'
});

var savedIcon = L.divIcon({
  className: 'mapIcon mapIcon--saved',
  iconSize: [50, 50],
  iconAnchor: [25, 90],
  html: '<div class="mapIcon__stalk mapIcon__stalk--saved"></div><div class="mapIcon__image mapIcon__image--saved"></div>'
});

var poo = false;

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

  var firebaseRef = firebase.database().ref();

  var geoFire = new GeoFire(firebaseRef);

  var spotsRef = firebaseRef.child("spots");

  var usersRef = firebaseRef.child("users");

  spotsRef.on("value", function(snapshot) {
    var spots = spotsToArray(snapshot);
    console.log(spots);

      function showSpots() {
          for (var i = 1; i < spots.length; i++) {

             var lat = spots[i].location["0"];
             var lng = spots[i].location["1"];

            var marker = L.marker(([lat,lng]),{icon:scenicIcon}).addTo(map).on('click',showContent);
              var markers = L.layerGroup([marker]);

          }
          $('.footer__icon--scenic').click(function(){
            poo == true;
          })
      }

      function showContent(){

      }


      $('.footer__icon--scenic').click(showSpots);

  })

  spotsRef.on("child_added", function(snapshot, prevChildKey) {
    var newPost = snapshot.val();
    console.log("new spot " + snapshot);

  });

  var uploadBtn = document.querySelector('#upload-btn');

  uploadBtn.addEventListener('click',function(e){

    // var storageRef = firebase.storage.ref();
    //
    // var imagesRef = storageRef.child('images/' + file.name);

      var file = e.target.files[0];

      var uploading = imagesRef.put(file);

      uploading.on('state_changed',function(snapshot){
        console.log('uploading...')
      });

  });

  var provider = new firebase.auth.GoogleAuthProvider();

  function google(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      // var user = result.user;

      var user = firebase.auth().currentUser;

      console.log(user);



      firebaseRef.onAuth(function(authData) {
        if (authData && isNewUser) {
          // save the user's profile into the database so we can list users,
          // use them in Security and Firebase Rules, and show profiles
          usersRef.child(authData.uid).set({
            provider: authData.provider,
            name: getName(authData)
          });
        }
      });

      changePage();

      })
      //.catch(function(error) {
      //   console.log('error' + error);
      // });


  }

  googlebtn.addEventListener('click', changePage);

  displayMap();

  function displayMap() {
    var city;
    const version = '?v=20170901'
    const clientid = '&client_id=4HLUBBPKV5WMSV24VMTVWA44LVSV1TQENTFUNETMJRVZAPVH'
    const clientSecret = '&client_secret=T0S3T3XZ5JKIJYI31QDPLPF5JVEWCGHWVNRLA1GUFN5ZVK0D'
    const apiKey = version +clientid+ clientSecret;
    var doneCities = [];


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
    };

  map.on('locationfound', onLocationFound);

  map.on('click', onMapClick);

  function onLocationFound(e) {
    var radius = e.accuracy * 2;

    L.marker((e.latlng),{icon:savedIcon}).addTo(map)
        .bindPopup( username + "'s position").openPopup();

        L.circle(e.latlng, radius).addTo(map);
  }

  doMapThings();

  // Get the current user's location
  getLocation();

  function doMapThings(city) {
              var corner1 = L.latLng(-36.815135, 174.716778),
                  corner2 = L.latLng(-36.912724, 174.816856),
                  bounds = L.latLngBounds(corner1, corner2);

                map.setMaxBounds(bounds);

                  var lat = -36.848461;
                  var lon = 174.763336;

                  var center = [lat,lon];

    							L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFpdnZpIiwiYSI6ImNqNmxncmoyMjFyZGMyeG1xN3Yyejk4dHIifQ.O7Bby6q1Jbn8v9ANa4_P5w', {foo: 'bar'}).addTo(map);
    							L.circle(center, {radius: 2500, fill: false, color: '#000'}).addTo(map);

                  var service = new google.maps.places.PlacesService(map);

                  var hotelRequest = {
                    location: center,
                    radius: '500',
                    type: ['hotel']
                  }

                  var foodRequest = {
                    location: center,
                    radius: '500',
                    type: ['restaurant']

                  }

                  $('.footer__icon--motel').click(function(){
                    service.nearbySearch(hotelRequest, hotelcallback);
                  })

                  $('.footer__icon--food').click(function(){
                      service.nearbySearch(foodRequest, foodcallback);
                    })

                  function hotelcallback(results, status) {
                       if (status == google.maps.places.PlacesServiceStatus.OK) {
                         for (var i = 0; i < results.length; i++) {
                           var place = results[i];
                           createMarker(results[i]);
                         }
                       }
                     }

                     function foodcallback(results, status) {
                          if (status == google.maps.places.PlacesServiceStatus.OK) {
                            for (var i = 0; i < results.length; i++) {
                              var place = results[i];
                              createMarker(results[i]);
                            }
                          }
                        }

                     function foodcallback(results, status) {
                          if (status == google.maps.places.PlacesServiceStatus.OK) {
                            for (var i = 0; i < results.length; i++) {
                              var place = results[i];
                              createMarker(results[i]);
                            }
                          }
                        }


                  function foodMarkers(place) {
                      var placeLoc = place.geometry.location;
                      var marker = L.marker((e.latlng),{icon:savedIcon}).addTo(map);
                      }

    }

  function onMapClick(e) {

      popup
          .setLatLng(e.latlng)
          .setContent("Add scenic spot?")
          .openOn(map);

      let pos = [e.latlng.lat, e.latlng.lng];


      $('#save-spot').click(function(){

        // $('#modal').modal('hide');

        var spotName = $('#spot-name').val();
        var spotDescription = $('#spot-description').val();

        // create if statement so can only submit once

        spotsRef.push().set({
              spotname: spotName,
              location: pos,
              description: spotDescription,
            });


        });


      $('.leaflet-popup').on('click',function(){
        map.closePopup();
        $('#myModal').modal();

      });

  }

  function spotsToArray(snapshot){

      var spots = [''];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        spots.push(item);

      });
      return spots;


  }

})();

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
