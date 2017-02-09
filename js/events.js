/* 
 * User interaction events
 * 
 */

$(document).ready(function() {
	$('#search-results').scroll(onScroll);
	$('#now-palying-results').scroll(onScroll);

	$("#search-string" ).keyup(function() {
		var string = $(this).val();
		searchPage = 1;
		if (string.length > 2){
			string = encodeURI(string);
			clearOld = true;
			getSearchMovie(string);
		}
	});
});

function onScroll(){
	var scrollPosition = $(this).scrollTop();
	var feature = this.getAttribute('id');

	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight){

		if(feature == 'now-palying-results') {
			getNextUpcomingPage();
		} else {

			if (totalPages > searchPage) {
				searchPage++;
				clearOld = false;
				var string = $("#search-string" ).val();
				var string = $("#search-string" ).val();
				getSearchMovie(string);
			}
		}
	}
}

function showDetails() {
	$(this).toggleClass('transform-active');
	if($(this).find('div.details')[0].hidden){
		$(this).find('div.details')[0].hidden=false;
	}else{
		$(this).find('div.details')[0].hidden=true;
	}
}






