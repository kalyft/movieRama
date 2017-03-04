/*
 *  fundamendal functions.
 * 
 */

var endPoint = 'https://api.themoviedb.org/3';
var page = 1;
var api_key = 'bc50218d91157b1ba4f142ef7baaa6a0';
var searchPage = 1;
var genrePage = 1;
var totalPages;
var clearOld = true;
var Movies = new Array();
var Genres = new Array();
var maxReviews = 2;

getGenres();
getNextUpcomingPage();

function getGenres() {
	$('#loading').show();

	$.ajax({
		url: endPoint + '/genre/movie/list?api_key='+ api_key,
		data: {
			format: 'json'
		},
		error: function() {
			console.log('Genres not loaded!');
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			storeGernes(data);
			genrePage++;
		},
		complete: function(){
			$('#loading').hide();
		},
		type: 'GET'
	});
}

function storeGernes(data) {
	for (i = 0; i < data.genres.length; i++) {
		Genres.push(data.genres[i]);
	}
}

function getNextUpcomingPage() {
	$('#loading').show();

	$.ajax({
		url: endPoint + '/movie/now_playing?api_key='+api_key+'&page='+page,
		data: {
			format: 'json'
		},
		error: function() {
			$('.now-palying').html('<p>An error has occurred</p>');
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			console.log('success');
			importNowPlaying(data);
			console.log(page);
			page ++;
		},
		complete: function(){
			$('#loading').hide();
		},
		type: 'GET'
	});
}

function importNowPlaying(data) {
	for (i = 0; i < data.results.length; i++) {
		var poster_path  = data.results[i].poster_path;
		var overview     = data.results[i].overview;
		var release_date = data.results[i].release_date;
		var genre_ids    = data.results[i].genre_ids;
		var id           = data.results[i].id;
		var title        = data.results[i].title; 
		var vote_average = data.results[i].vote_average;

		var movie = new Movie(poster_path, overview, release_date, genre_ids, id, title, vote_average);

		$('#now-palying-results').append(movie.createElement());

		$('#now-palying-results').find('#'+id).one("click",getDetails);
		$('#now-palying-results').find('#'+id).on("click",showDetails);
	}
}

function getSearchMovie(string) {
	$('#loading').show();

	$.ajax({
		url: endPoint + '/search/movie?api_key='+api_key+'&query='+ string +'&page='+searchPage,
		data: {
			format: 'json'
		},
		error: function() {
			$('#search-results').html('<p>An error has occurred</p>');
		},
		dataType: 'json',
		success: function(data) {
			if (clearOld) { 
				$('#search-results').empty();
			}
			console.log(data);
			importSearchResult(data);
		},
		complete: function(){
			$('#loading').hide();
		},
		type: 'GET'
	});	
}

function importSearchResult(data) {
	for (i = 0; i < data.results.length; i++) {
		var poster_path  = data.results[i].poster_path;
		var overview     = data.results[i].overview;
		var release_date = data.results[i].release_date;
		var genre_ids    = data.results[i].genre_ids;
		var id           = data.results[i].id;
		var title        = data.results[i].title; 
		var vote_average = data.results[i].vote_average;
		
		var movie = new Movie(poster_path, overview, release_date, genre_ids, id, title, vote_average);

		$('#search-results').append(movie.createElement());
		$('#search-results').find('#'+id).one("click",getDetails);
		$('#search-results').find('#'+id).on("click",showDetails);
	}
	totalPages  = data.total_pages;
} 

function getDetails() {
	feature = $(this).parent().attr("id");
	id = this.getAttribute('id');

	getTrailer(id,feature);
	getReviews(id,feature);
	getSimilars(id,feature);
}

function getTrailer(id,feature) {
	$('#loading').show();

	$.ajax({
		url: endPoint + '/movie/'+ id +'/videos?api_key='+api_key,
		data: {
			format: 'json'
		},
		error: function() {
			$('#search-results').html('<p>An error has occurred</p>');
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			importTrailer(data,id,feature);
		},
		complete: function(){
			$('#loading').hide();
		},
		type: 'GET'
	});	
}

function importTrailer(data, id,feature) {
	var found = false;
	var item = $("#" + feature).find('#details_' + id);

	for (i = 0; i < data.results.length; i++) {
		var type = data.results[i].type;
		if (type == 'Trailer') {
			var found = true;
			var site   = data.results[i].site;
			var key    = data.results[i].key;

			if (site == 'YouTube'){
				$(item).find('.trailer').append('<iframe width="290" height="130" src="https://www.youtube.com/embed/'+ key +'" frameborder="0" allowfullscreen></iframe>');
			}
			break;
		}
	}
	if (!found) {
		$(item).find('.trailer').append('<div class="no_trailer"> No Trailer Available </div>');
	}
}

function getReviews (id,feature) {
	$('#loading').show();
	
	$.ajax({
		url: endPoint + '/movie/'+ id +'/reviews?api_key='+api_key,
		data: {
			format: 'json'
		},
		error: function() {
			$('#search-results').html('<p>An error has occurred</p>');
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			importReviews(data,id,feature);
		},
		complete: function(){
			$('#loading').hide();
		},
		type: 'GET'
	});	
}

function importReviews(data, id,feature) {
	console.log("importReviews");
	var item = $("#" + feature).find('#details_' + id);
	for (i = 0; i < data.results.length; i++) {
		if (i == maxReviews) {
			break;
		}
		var author     = data.results[i].author;
		var content    = data.results[i].content;
		var review_id  = data.results[i].id;
		
		$(item).find('.reviews').append('<div class="review-content"> Review '+ (i+1) +'  : '+ content +'</div>');
	}

	if (data.results.length == 0) {
		$(item).find('.reviews').append('<div class="review-content">No Reviews</div>');
	}
}

function getSimilars (id) {
	$('#loading').show();

	$.ajax({
		url: endPoint + '/movie/'+ id +'/similar?api_key='+api_key,
		data: {
			format: 'json'
		},
		error: function() {
			$('#search-results').html('<p>An error has occurred</p>');
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			importSimilars(data,id);
		},
		complete: function(){
			$('#loading').hide();
		},
		type: 'GET'
	});	
}

function importSimilars(data, id) {
	console.log("importSimilars");

	for (i = 0; i < data.results.length; i++) {

		var poster_path  = data.results[i].poster_path;
		var overview     = data.results[i].overview;
		var release_date = data.results[i].release_date;
		var genre_ids    = data.results[i].genre_ids;
		var similar_id   = data.results[i].id;
		var title        = data.results[i].title; 
		var vote_average = data.results[i].vote_average;
		
		var movie = new Movie(poster_path, overview, release_date, genre_ids, similar_id, title, vote_average);
		var item = $("#" + feature).find('#details_' + id);
		$(item).find('.similar').append(movie.createSimilarElement());

		if (i == 10) {
			break;
		}
	}
	if (data.results.length == 0) {
		var item = document.getElementById('details_' + id);
		$(item).find('.similars').append('<div>No Similars</div>');
	}
} 
