/*Usage of 'Unsplash API', not needed, due to random photo hotlink 'https://source.unsplash.com/collection/768992/1600x900'.

$.getJSON('https://api.unsplash.com/collections/768992/photos/?client_id=API_KEY_HERE&per_page=20', function(response) { 
	console.log(response);
	var unsplashRes = response;
	var photoURLS = [];
	for (i = 0; i < unsplashRes.length; i++) {
		photoURLS.push(unsplashRes[i].urls.regular);
	}
	
	//console.log(photoURLS);
	var linkRand = Math.floor(Math.random() * unsplashRes.length) + 1;
	console.log(linkRand);
	//$('body').css('background-image', 'url("' + photoURLS[linkRand] + '")');
	//$('body').css('background-image', 'url("' + https://source.unsplash.com/collection/768992/1600x900 + '")');
	
	$('#author-of-image').html('<a href="' + unsplashRes[linkRand].links.html + '" class="image-link">' + unsplashRes[linkRand].user.first_name + " " + unsplashRes[linkRand].user.last_name + '</a>');
});*/

var getLocationQuery = function() {
	window.location.href="Main.html" + "?location=" + $('#location-input').val();
}

$('#geo-location-btn').click(function() {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			//getCoords(position.coords.latitude, position.coords.longitude);
			coordsOf = position.coords.latitude + ',' + position.coords.longitude;
			window.location.href="Main.html" + "?location=" + coordsOf;
		});
	} else {
		$(this).text('Sorry, geolocation isn\'t supported in your browser!');
		$(this).prop('disabled', true);
		$(this).css('background-color', '#D32F2F');
	}
	
});