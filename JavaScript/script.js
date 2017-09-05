var tempUnit = "Imperial"; // Type of 'temperature unit', other types are.. Kelvin, Metric: (Celsius), Imperial: (Fahrenheit)
var DataOf;
var locationGeoCoding;
var tempOf;
var weatherID;
var weatherTypeOf = 'weather';
var tempOfType;
var daysOfTheWeek = [];
var coordsOf;
var gtTypeForcast = 'Hourly'; // 'Hourly' default (for see-hourly-btn)
var revGeoCoding;
var locationQuery;
var locationOf;
var getLocationsOf = JSON.parse(localStorage.getItem('saved-locations'));
var placeID;
var savedDisplay = false;
var currentPlaceID;
var checkedTF = false;
if (getLocationsOf == null) {
	var savedLocations = [];
} else {
	var savedLocations = getLocationsOf;
}
var locationOf;
var googleAPIKeyOf = 'GOOGLEAPIKEY';
var darkskyAPIKeyOf = 'DARKSKYAPIKEY';
//var coordsOf = '34.189857,-118.451355';

function getParameterByName(name, url) { 
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var queryStringOf = getParameterByName('location');

var getLocationQuery = function() {									//place_id
		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + locationQuery + '&key=' + googleAPIKeyOf, function(response) { 
			locationGeoCoding = response;
			console.log(locationGeoCoding);
			//console.log('true');
			var addressCompLength = locationGeoCoding.results[0].address_components.length // Is there ever more than 1 result?
			var countryOf = locationGeoCoding.results[0].address_components[addressCompLength - 1].long_name;
			getBG(countryOf)
			
			var latOf = locationGeoCoding.results[0].geometry.location.lat;
			var lngOf = locationGeoCoding.results[0].geometry.location.lng;
			placeID = locationGeoCoding.results[0].place_id;
			coordsOf = latOf + "," + lngOf;
			locationOf = locationGeoCoding.results[0].formatted_address;
			
			/*for (x = 0; x < savedLocations.length; x++) {
				var savedLng = savedLocations[x].substring(savedLocations[x].indexOf(",") + 1);
				var savedLat = savedLocations[x].substring(0, savedLocations[x].indexOf(",")); 
				
				for (i = 0; i < locationGeoCoding.results.length; i++) {
				  if (locationGeoCoding.results[i].geometry.location.lng === savedLng && locationGeoCoding.results[i].geometry.location.lat === savedLat) {
					  console.log('true ' + i);
				  } else {
					  console.log('false');
				  }
				  alert(locationGeoCoding.results.length);
				}
			}*/
			
			
			
			runWeatherCall();
		});

}

if (queryStringOf != null) {
	locationQuery = queryStringOf;
	getLocationQuery();
}

var runWeatherCall = function() {
$.getJSON('https://api.darksky.net/forecast/' + darkskyAPIKeyOf + '/' + coordsOf + '?lang=en&callback=?', function(response) { //Callback?
		DataOf = response;
		console.log(DataOf);
		if (savedDisplay != true) {
			weatherAPI();
		} else if (savedDisplay === true) {
			if (querySaved < savedLocations.length) {
				tempOfCurrent = Math.floor(DataOf.currently.temperature);
				$('#saved-location-temp-' + querySaved).html(tempOfCurrent);
				$('#saved-location-canvas-' + querySaved).attr('class', DataOf.currently.icon);
				$('#saved-location-sum-' + querySaved).html(DataOf.currently.summary);
				$('#saved-wind-temp-' + querySaved).html(DataOf.currently.windSpeed + ' mph'); 
				
				
				
				/* for (currentDay = 0; currentDay < 6; currentDay++) {
					var dateOf = new Date(DataOf.daily.data[currentDay].time*1000); // Gets 'date-time; in seconds, then multiplies to turn into 'milliseconds'
					var getDayOf = dateOf.getDay(); // Gets day number (of the week) from 'dateOf' var
					tempOfMax = Math.floor(DataOf.daily.data[currentDay].temperatureMax); //Grabs MAX temp for that day
					tempOfMin = Math.floor(DataOf.daily.data[currentDay].temperatureMin); //Grabs MIN temp for that day
					$('.s-day-of-' + currentDay).html(daysOfTheWeek[getDayOf]);
					$('.s-temp-of-' + currentDay).html(tempOfMax);
					$('.s-temp-of-low-' + currentDay).html(tempOfMin);
					$('.s-icon-' + currentDay).attr('class', DataOf.daily.data[currentDay].icon);
					$('.s-sum-' + currentDay).html(DataOf.daily.data[currentDay].summary);
				} */
				querySaved++;
				runSkyCons();
				getSavedLocations();
			} 		
		}
}); 
}

var weatherAPI = function() {
	tempOfCurrent = Math.floor(DataOf.currently.temperature); //Gets current temp, then floors that number
	var weatherOfCurrent = DataOf.currently.summary; //Gets summary from 'currently' to display within header
	var weatherOfDesc = DataOf.hourly.summary; 
	
	var canvasCount = 1; // 'Placeholder' var as to not count 'main-canvas'
	$('canvas:eq(0)').attr('class', DataOf.currently.icon); //Gets 'icon' data, puts into canvas to get an icon, using 'Skycons' (see below)

	$('.temp-of-0').html(tempOfCurrent + "<small>&#176; F</small>"); //Puts current temp (tempOfCurrent) into '#temp-of-0' (header)
	
	$('#weather-of-0').html(weatherOfCurrent);
	//$('.weather-of-descr').html('"' + weatherOfDesc + '"');
	$('.wind-speed').html(DataOf.currently.windSpeed + ' mph' );
	
	getTime();
	for (var dayCount = 0; dayCount < DataOf.daily.data.length; dayCount++) { //Gets and puts data in 4 days (not counting first or '0' index
		tempOfMax = Math.floor(DataOf.daily.data[dayCount].temperatureMax); //Grabs MAX temp for that day
		tempOfMin = Math.floor(DataOf.daily.data[dayCount].temperatureMin); //Grabs MIN temp for that day
		var weatherOfDaily = DataOf.daily.data[dayCount].summary;
		$('canvas:eq(' + canvasCount + ')').attr('class', DataOf.daily.data[dayCount].icon);
		$('.temp-of-' + canvasCount).html(tempOfMax + "<small>&#176;</small>");
		$('#low-temp-' + dayCount).html(tempOfMin);
		$('#weather-of-' + dayCount).html(weatherOfDaily);
		//$('.weather-of-descr').html('"' + weatherOfDesc + '"');
		
		var dateOf = new Date(DataOf.daily.data[dayCount].time*1000); // Gets 'date-time; in seconds, then multiplies to turn into 'milliseconds'
		var getDayOf = dateOf.getDay(); // Gets day number (of the week) from 'dateOf' var
		$('.day-of-' + dayCount).html(daysOfTheWeek[getDayOf]); // Puts day from the week via the daysOfTheWeek array, into header (I.E [getDayOf == 1] = 'Monday')
		canvasCount++;
	}
	if (revGeoCoding == undefined) {
		getLocationDets();
	}
	
	runSkyCons(); //Runs 'skycons' (weather icon display)
} 
  
$('#celsius-of').click(function() {
	if (tempUnit != 'Metric') {
		tempUnit = 'Metric'; //Changes 'tempUnit' to Metric: (Celsius);	
		
		//For 'main' temp header
		tempOfType = $('.temp-of-0').html().match(/\d+/)[0];
		var tempOf = (tempOfType - 32) * 5/9;
		var celsiusTemp = Math.round(tempOf * 10) / 10;
		$('.temp-of-0').html(celsiusTemp + "<small>&#176; C</small>");	
		
		for (var tempCountC = 1; tempCountC <= $('.temp-of-max').length; tempCountC++) { // For MAX temp to > celsius 
			tempOfType = $('.temp-of-' + tempCountC).html().match(/\d+/)[0];
			var tempOf = (tempOfType - 32) * 5/9;
			var celsiusTemp = Math.round(tempOf * 10) / 10;
			$('.temp-of-' + tempCountC ).html(celsiusTemp + "<small>&#176;</small>");	
		}
		
		for (var tempCountLow = 0; tempCountLow < $('.temp-of-low').length; tempCountLow++) { // For MIN temp to > celsius 
			tempOfType = $('#low-temp-' + tempCountLow).html().match(/\d+/)[0];
			tempOf = (tempOfType - 32) * 5/9;
			celsiusTemp = Math.round(tempOf * 10) / 10;
			$('#low-temp-' + tempCountLow ).html(celsiusTemp + "<small>&#176;</small>");
		}
		
	}
});

$('#fahrenheit-of').click(function() {
	if (tempUnit != 'Imperial') {
		tempUnit = 'Imperial'; //Changes 'tempUnit' to Imperial: (Fahrenheit)
		
		//For 'main' temp header
		tempOfType = $('.temp-of-0').html().match(/\d+/)[0];
		tempOf = Math.round(tempOfType * 1.8 + 32);
		$('.temp-of-0').html(tempOf + "<small>&#176; F</small>");
		
		for (var tempCountF = 1; tempCountF <= $('.temp-of-max').length; tempCountF++) { // For MAX temp to > fahrenheit
			tempOfType = $('.temp-of-' + tempCountF).html().match(/\d+/)[0];
			tempOf = Math.round(tempOfType * 1.8 + 32);
			$('.temp-of-' + tempCountF).html(tempOf + "<small>&#176;</small>");
		}
		
		for (var tempCountFLow = 0; tempCountFLow < $('.temp-of-low').length; tempCountFLow++) { // For MIN temp to > fahrenheit
			tempOfType = $('#low-temp-' + tempCountFLow).html().match(/\d+/)[0];
			tempOf = Math.round(tempOfType * 1.8 + 32);
			$('#low-temp-' + tempCountFLow).html(tempOf + "<small>&#176;</small>");
		}
	}
});

var getTime = function() { // This function gets the 'time'
	var newDate = new Date();
	var currentMoment = moment.tz(DataOf.timezone).toString();
	console.log(currentMoment);
	var nDateZone = currentMoment.substring(15, currentMoment.length); // Cuts string using (substring)
	var grabDate = newDate.getDate(); // Day in the month (1-31)
	var timezoneOf;
	var exampleString = 'ExampleString';
	
	daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; //0-6 days (0 based index) starting on Sunday
	
    $('#timezone-of').html("<small>( " + nDateZone + " )</small>");

	$('#todays-date').html(currentMoment.substring(0, 15)).hover( // Hover over the 'date' of the day, and you will see timezone details
	function() {
			$('#timezone-of').css('display', 'inline-block');
		}, function() {
			$('#timezone-of').css('display', 'none');
		}
	);
	
	var getCurrentTime = function() {
		var hoursOf = newDate.getHours(); //Current Hour (0 - 23)
		var minsOf = newDate.getMinutes(); //Current Minute (0 - 59)
		
		var timezoneOf = DataOf.currently.time * 1000;
		var currentTimeOf = moment.tz(timezoneOf, DataOf.timezone).format('h:mm a');
		
		/* Without Moment.js 
		if (minsOf < 10) {
			minsOf = "0" + minsOf;
		} 
		
		if (hoursOf > 12) { //time is 4
			currentHour = hoursOf - 12;
			hoursOf = currentHour + ":" + minsOf + " PM";
		} else if (hoursOf < 12) {
			currentHour = parseInt(hoursOf, 10);
			if (currentHour == 00) {
				currentHour = '12';
			}
			hoursOf = currentHour + ":" + minsOf + " AM";
		}
		*/
		
		$('.time-of').html(currentTimeOf);
	}
	
	getCurrentTime();
	
} 

$('#see-hourly-btn').click(function() {
	 // Gets time from 'first' hourly forecast from array
	var hourOf;
	var canvasCountH = 1;
	tempUnit = "Imperial";
	console.log(gtTypeForcast);
	if ( gtTypeForcast == 'Hourly') {
		gtTypeForcast = 'Daily';
	$('.temp-of-low').css('display', 'none');
	var hourlyForecast = function() {
		
		/* Without moment.js
		var getTimeDiff = getHTimestamp.getTimezoneOffset(); // Gets offset between that time (UTC) and local time
		var getHours = getHTimestamp.getHours(); // Local time 
		var currentHour;

		
		if (getHours > 12) { //time is 4
			currentHour = getHours - 12;
			hourOf = currentHour + ":00 PM";
		} else if (getHours < 12) {
			currentHour = parseInt(getHours, 10);
			if (currentHour == 00) {
				currentHour = '12';
			}
			hourOf = currentHour + ":00 AM";
		}*/
		
		hourOf = currentTimeOf;
	}
	
	$('canvas:eq(0)').attr('class', DataOf.hourly.data[0].icon); //Gets 'icon' data, puts into canvas to get an icon, using 'Skycons' (see below)

	$('.temp-of-0').html(Math.floor(DataOf.hourly.data[0].temperature) + "<small>&#176; F</small>"); //Puts current temp (tempOfCurrent) into '#temp-of-0' (header)
	
	$('#weather-of-0').html(DataOf.hourly.data[0].summary);
	$('.wind-speed').html(DataOf.hourly.data[0].windSpeed + ' mph' );
	
										//DataOf.daily.hourly.length || until day is over > 12
	for (var hourCount = 0; hourCount < 8; hourCount++) { 
		//var getHTimestamp = new Date(DataOf.hourly.data[hourCount].time * 1000); //Gets timestamp from Hourly (starting at 0(index)) converts it to local time (Without Moment.js)
		
		var timezoneOf = DataOf.hourly.data[hourCount].time * 1000;
		var currentTimeOf = moment.tz(timezoneOf, DataOf.timezone).format('h:mm a').toString();
		
		hourlyForecast();
		tempOfHourly = Math.floor(DataOf.hourly.data[hourCount].temperature); //Grabs temp for that hour
		var weatherOfDaily = DataOf.hourly.data[hourCount].summary;
		$('canvas:eq(' + canvasCountH + ')').attr('class', DataOf.hourly.data[hourCount].icon);
		$('.temp-of-' + hourCount).html(tempOfHourly + "<small>&#176;</small>");
		$('#weather-of-' + hourCount).html(weatherOfDaily);
		
		var dateOf = new Date(DataOf.daily.data[hourCount].time*1000); // Gets 'date-time; in seconds, then multiplies to turn into 'milliseconds'
		var getDayOf = dateOf.getDay(); // Gets day number (of the week) from 'dateOf' var
		$('.day-of-' + hourCount).html(hourOf); // Puts day from the week via the daysOfTheWeek array, into header (I.E [getDayOf == 1] = 'Monday')
		canvasCountH++;
	}
	$('#see-hourly-btn').html('See daily');
	runSkyCons();
	} else if ( gtTypeForcast == 'Daily') {
		gtTypeForcast = 'Hourly';
		weatherAPI()
		$('.temp-of-low').css('display', 'inline-block');
		$('#see-hourly-btn').html('See Hourly');
	}
	
});

var getLocationDets = function() {
	$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordsOf + '&key=' + googleAPIKeyOf, function(response) { 
			revGeoCoding = response;
			console.log(revGeoCoding);
			$('#add-city-button').css('display', 'inline-block'); //As to not load the button in before true/false (if statement) can be determined
			//locationOf = revGeoCoding.results[4].formatted_address; //Possibly change '4' into something better, due to differing array sizes?
			//locationOf = DataOf.results[0].formatted_address;
			$('.location-of').html(locationOf);
			// Gets place_id from Local storage array, then compares with the results of 'revGeoCoding'
			for (x = 0; x < savedLocations.length; x++) { //Local storage array
				for (i = 0; i < revGeoCoding.results.length; i++) { //Results of 'reverse geo' 
					if ( savedLocations[x] == revGeoCoding.results[i].place_id || savedLocations[x] == locationGeoCoding.results[0].place_id ) { // '||' helps avoid duplication of (saved) locations
						//console.log(revGeoCoding.results[i].place_id + ' True');
						currentPlaceID = locationGeoCoding.results[0].place_id;
						checkedTF = true;
						$('#add-location').removeClass('fa-plus-square').addClass('fa-check').css('color', '#2e7d32');
						$('#add-city-button').prop("disabled", true);
					} else {
						console.log('false');
					}
				} 
			}
	});
}

/*Skycons*/
var runSkyCons = function() {
	var icons = new Skycons({"color": "wheat"}),
	
		list  = [
		 "clear-day", "clear-night", "partly-cloudy-day",
		 "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
		 "fog"
		],
		i;

	for (i = list.length; i--;) {
    var weatherType = list[i],
        elements = document.getElementsByClassName(weatherType);
    for (e = elements.length; e--;) {
        icons.set(elements[e], weatherType);
    }
}
icons.play();
}

console.log(savedLocations);
$('#add-city-button').unbind().click(function() {
	if (savedLocations.length < 5) {
		savedLocations.push(placeID);
		console.log(savedLocations);
		$('#add-location').removeClass('fa-plus-square').addClass('fa-check').css('color', '#2e7d32');
		$('#add-city-button').prop("disabled", true);
		checkedTF = true;
		localStorage.setItem('saved-locations', JSON.stringify(savedLocations));
	} else if (savedLocations.length >= 5) {
		alert('To many saved locations');
	}
});

$('#saved-locations').unbind().click(function() {
	savedLocationsFunc();
	$('.body-container').fadeOut('fast');	
	$('.ct4').fadeIn('slow');
	$('#location-search').prependTo('#empty-col').css('float', 'none');
});

var savedLocationsFunc = function() {
	placeID = savedLocations;
	getLocationsOf = JSON.parse(localStorage.getItem('saved-locations'));
	console.log(savedLocations);
	getSavedLocations();
}
var querySaved = 0;
function getSavedLocations() {
	//for (querySaved = 0; querySaved < savedLocations.length; querySaved++) {
		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + savedLocations[querySaved] + '&key=' + googleAPIKeyOf, function(response) { 
				locationResponse = response;
				console.log(locationResponse);
				savedDisplay = true;
				var savedLat = locationResponse.results[0].geometry.location.lat;
				var savedLng = locationResponse.results[0].geometry.location.lng;
				coordsOf = savedLat + "," + savedLng;
				runWeatherCall(); // Wait until to proceed..
				$('#saved-location-' + querySaved).html(locationResponse.results[0].formatted_address); //Gets name of location and puts it into main header
					
					
		});
	
}

$('.saved-box').click(function() {
	var savedLocationVal = $(this).find('.saved-location').text();
	if (savedLocationVal != "") {
		window.location.href="Main.html" + "?location=" + savedLocationVal;
	}
});
	
	
var pageOf = 1;
$("#right-button").unbind().click(function() {
	$("#right-button").css('display', 'none');
	$('#saved-locations').css('display', 'none');
	$(".weather-cols").animate({
		left: "-85%"
	}, 2000, function() {
		for (o = 0; o < 4; o++) {
			$('#day-' + o).css('display', 'none');
		}
		$(".weather-cols").css('left', '0');
		pageOf++;
		$("#left-button").css('display', 'inline-block');
		for (restODays = 5; restODays <= 8; restODays++) {
			$('#day-' + restODays).fadeIn('slow');
		}
		$('#saved-locations').fadeIn('slow');
	}); //$('canvas:eq(0)').css('display', 'none');
});

$("#left-button").unbind().click(function() {
	$("#left-button").css('display', 'none');
	$('#saved-locations').css('display', 'none');
	$(".weather-cols").animate({
		left: "85%"
	}, 2000, function() {
		for (o = 8; o > 4; o--) {
			$('#day-' + o).css('display', 'none');
		}
		$(".weather-cols").css('left', '0');
		pageOf++;
		$("#right-button").css('display', 'inline-block');
		for (restODays = 0; restODays <= 4; restODays++) {
			$('#day-' + restODays).fadeIn('slow');
		}
		$('#saved-locations').fadeIn('slow');
	}); //$('canvas:eq(0)').css('display', 'none');
});

$('.button-con').mouseenter(function() {
   if (checkedTF === true) {
   $('#add-location').css('display', 'none');
   $('#remove-city-button').css('display', 'inline-block');
   }
  })
  .mouseleave(function() {
  if (checkedTF === true) {
    $('#remove-city-button').css('display', 'none');
	$('#add-location').css('display', 'inline-block');
  }
});

 $('#remove-city-button').click(function() {
	 var indexToRemove = savedLocations.indexOf(currentPlaceID); 
	 savedLocations.splice(indexToRemove, 1);
	 localStorage.setItem('saved-locations', JSON.stringify(savedLocations));
	 checkedTF = false;					
	 
	 $('#remove-city-button').css('display', 'none');
	 $('#add-location').css('display', 'inline-block');
	 $('#add-location').removeClass('fa-check').addClass('fa-plus-square').css('color', 'white');
	 $('#add-city-button').prop("disabled", false);
	
 });
 
var getBG = function(country) {
	var collectionID;
	/* Location BG, starting countries (to display bg for) { (At least 6 photos ea)
		- United States
		- United Kingdom
		- Japan
		- China
		- Russia
		- Germany
		- Spain
		- Mexico
		- Turkey
		- France
		- Italy
		- South Africa
		- * More to be added
	}
	*/

	switch (country) {
		case 'United States':
			collectionID = '1147412';
			break
		case 'Japan':
			collectionID = '1147421';
			break
		case 'China':
			collectionID = '1147428';
			break
		case 'Russia':
			collectionID = '1147437';
			break
		case 'Germany':
			collectionID = '1147445';
			break
		case 'Spain':
			collectionID = '1147453';
			break
		case 'Mexico':
			collectionID = '1147457';
			break
		case 'Turkey':
			collectionID = '1147464';
			break
		case 'France':
			collectionID = '1147508';
			break
		case 'Italy':
			collectionID = '1147514';
			break
		case 'South Africa':
			collectionID = '1147521';
			break
		default:
			collectionID = '779288';
	}
	$('body').css('background-image', 'url("https://source.unsplash.com/collection/' + collectionID + '/1600x900")');
	
}
