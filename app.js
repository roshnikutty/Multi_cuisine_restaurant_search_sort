var GOOGLE_MAPS_URL = "https://maps.googleapis.com/maps/api/geocode/json";
var state = {};
var stateTempLocation = {
    tempLat: 42.360,
    tempLng: -71.0589
};


function getLocationDataFromApi(inputLocation, callback) {              //JSON request to get latitude, longitude of input
    var locationApiKey = "AIzaSyDukMh5S7oj9tP0jfnq_7MNUFN8mjKddpA";
    var query = {
        address: inputLocation,
        key: locationApiKey
    }
    console.log(inputLocation);
    $.getJSON(GOOGLE_MAPS_URL, query, callback);
}

function setState(data){
    setLocation(data);
    setSearchParameters();
    initMap();
}

function setLocation(data) {    //returns latitude, longitude on input location                             
    state = {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
    };
    // initMap();
}

function setSearchParameters(){
    state.searchObj = getSearchParams();
}

//----------------------------------Map-----------------------------------------
var map;
var infowindow;

function initMap() {

    if ((typeof state.lat == 'undefined') && (typeof state.lng == 'undefined')) {
        //If no location is in the form, temp lat and temp lng to init map.
        map = new google.maps.Map(document.getElementById('map'), {
            center: stateTempLocation,
            zoom: 12
        });
        return;
    }
    
    var stateSearchObject = state.searchObj;
    console.log(state);
    var inputLocation = { lat: state.lat, lng: state.lng };
    console.log(inputLocation);
    // console.log(state);

    map = new google.maps.Map(document.getElementById('map'), {
        center: inputLocation,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    console.log(state);

    stateSearchObject.inputCusineProp.forEach(function (item) {
        console.log(item);
        service.textSearch({
            query: item,                                    //this would iterate over each cuisine
            location: inputLocation,
            radius: stateSearchObject.inputRadiusProp,         //this should take input radius
            type: 'restaurant',
            rankBy: google.maps.places.RankBy.PROMINENCE
        }, renderResults);
    });

}

function renderResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        displayGoogleSearchData(results);
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function displayGoogleSearchData(results) {
    var resultState = [];
    var resultElement = "";
    var openNow = "";
    var priceLevel = "";
    if (results) {
        $(".rating-sort").toggleClass("no-show");    //reveal sort button
        results.forEach(function (item) {
            console.log(item);
            if (item.opening_hours) {
                if (item.opening_hours.open_now == true) {
                    openNow = "   <span class = 'open_color'>Open now</span>";
                }
                else {
                    openNow = "   <span class = 'closed_color'>Closed now</span>";
                }
            }
            if (item.price_level == 1) { priceLevel = "    $"; }
            if (item.price_level == 2) { priceLevel = "    $$"; }
            if (item.price_level == 3) { priceLevel = "    $$$"; }
            if (item.price_level == 4) { priceLevel = "    $$$$"; }
            var resultRow = "<div class = 'result-row'><p><b>Restaurant  </b> " + item.name + " " + openNow + " " + "</p><p><b>Address  </b> " + item.formatted_address + "</p><p><b>Rating  </b> " + item.rating + "<span class = 'dollar'>" + priceLevel + "</span>" + "</p></div>";
            resultState.push([item.rating.toString(), resultRow]);
            resultElement = resultElement + resultRow;
        });
    }
    else {
        return "No results were found.";
    }
    $(".js-results").append(resultElement);


    //Action on clicking 'Sort by Ratings' button
    $(".rating-sort").on('click', function (event) {
        event.preventDefault();
        var sortResultElement = "";
        $(".js-results").empty();
        resultState.sort().reverse();
        for (var item in resultState) {
            sortResultElement = sortResultElement + resultState[item][1];
        }
        $(".js-results").html(sortResultElement);
    });
}


//-----------------------------------------Map Marker ends---------------------------



//---------------------------------------Input data from form------------------------------
$(".listing").click(function (event) {

    event.preventDefault();
    $('.js-results').empty();
    console.log("clicked");
    var inputLocation = $(".location").val();
    getLocationDataFromApi(inputLocation, setState);   //returns latitude, longitude of input location 

    //var allCuisines = cuisineSelection.join("|") + "|restaurant|food|eat";
    console.log(state);

    //getDataFromApi(searchObj, inputLocation, displayGoogleSearchData);
});

// function createState(searchObject) {
//     var stateSearchObject = searchObject;
//     return stateSearchObject;
// }
function getSearchParams(){
    var inputRadius = $(".radius").val() * 1610;            //converting input miles to meters
    var cuisineSelection = [];
    $(".selection:checked").each(function (i) {
        cuisineSelection.push($(this).val());
    });

    var searchObj = {
        inputCusineProp: cuisineSelection,
        inputRadiusProp: inputRadius
    };
    
    return searchObj;
}