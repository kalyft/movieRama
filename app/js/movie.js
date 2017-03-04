/*
 *  Movie class
 * 
 */
 
function Movie(poster_path, overview, release_date, genre_ids, id, title, vote_average) {
	this.poster_path  = poster_path;
	this.overview     = overview;
	this.release_date = release_date;
	this.genres       = genre_ids;
	this.id           = id;
	this.title        = title;
	this.vote_average = vote_average;
	this.genre_names  = null;

	this.getImgLink = function() {
		if (this.poster_path == null) {
			return 'img/no_image.png';
		} else {
			return 'https://image.tmdb.org/t/p/w300' + this.poster_path;
		}
	};
	
	this.getOverview = function(){
		if (this.overview == "") {
			this.overview = "N/A";
		}
		return this.overview;
	};
	
	this.getReleaseDate = function(){
		if (this.release_date == "") {
			this.release_date = "N/A";
		}
		return this.release_date;
	};
	
	
	this.getGernes = function() {
		if (this.genre_names == null) {
			
			var genre_names = new Array();
			for (var i=0; i<this.genres.length; i++) {
				var j = _.findKey(Genres, { 'id': this.genres[i] });
				if (j !== undefined) {
					genre_names.push([Genres[j].name]);
				}
			}
			this.genre_names = _.join(genre_names,', ');
			
			return this.genre_names;
		} else {
			this.genre_names;
		} 
	};

	this.createElement = function() {
		var html = "<li id="+ this.id +" class='transform' > \
						<div class='primary' > \
							<img src="+ this.getImgLink() +"> \
							<div class='primaries'> \
								<div class='title'> Title : "+ this.title +"</div> \
								<div class='vote_average'> Avg Vote : "+ this.vote_average +"</div> \
								<div class='overview'> Overview : "+ this.getOverview() +"</div> \
								<div class='genres'> Genre(s) : "+ this.getGernes() +"</div> \
								<div class='release_date'> Release Date : "+ this.getReleaseDate() +"</div> \
							</div> \
						</div> \
						<div class='details' id=details_"+ this.id +" hidden = true' >  \
							<div class ='trailer_label'> Trailer : </div> \
							<div class ='similar_label'> Similars :</div> \
							<div class ='trailer'> </div> \
							<div class ='similars'> <div class ='similar'> </div></div> \
							<div class ='reviews'> </div> \
						</div> \
					</li>";
		Movies.push([this.id,this]);
		return html;
	};

	this.createSimilarElement = function() {
		var html = "<div class='similar_item'> \
						<img src=" + this.getImgLink() + "> \
						<div class='similar_title'> "+ this.title+"</div> \
					</div>";
		return html;
	};
};
