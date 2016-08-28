/*
 *STATIC VARIABLES
 */
 var TOPICS=["South Park","Bob\'s Burgers", "Archer","Futurama", "American Dad","Family Guy", "Venture Brothers", "Rick and Morty", "The Simpsons", "Bojack Horseman", 
 "Daria", "Robot Chicken"];

 var GIPHY_API_KEY = "dc6zaTOxFJmzC";




$(document).ready(function(){
	displayButtons();
	
});


$(document).on("click", ".buttonSearch", function(){

	var tvshow = $(this).data("name");
	runAPI(tvshow);
	tvBackground(tvshow);

});

$("#addButton").on("click", function(){
	TOPICS.push($("#addCategoryBox").val());
	displayButtons();

});


$(document).on("click", ".imageClick", function(){
	var animate = $(this).data("animate");
	var static = $(this).data("static");
	console.log(animate);

	if($(this).attr("state") === "static"){
		$(this).attr("src", animate);
		$(this).attr("state", "animate");

	}
	else{
		$(this).attr("src", static);
		$(this).attr("state", "static");
	}

});


function createButton(name){

	var singleButton = $("<button>");

	singleButton.attr("data-name",name);
	singleButton.attr("class","buttonSearch");
	singleButton.html(name);
	$("#buttonContainer").append(singleButton);
}

function displayButtons(){
	$("#buttonContainer").empty();
	for(var i=0;i<TOPICS.length;++i){
			createButton(TOPICS[i]);
	}
}


function runAPI(name){

	var queryURL = "http://api.giphy.com/v1/gifs/search?q="+name+"&api_key="+GIPHY_API_KEY;

	$.ajax({url: queryURL, method: 'GET'})
	 .done(function(response) {
	 	$("#imageContainer").empty();

	 	var imgArraylength;
	 	var multiplesFive=1;

	 	//Check to see if object array length is no greater than 10 (per HW requirement)
	 	if(response.data.length>=10){
	 		imgArraylength =10;
	 	}
	 	else{
	 		imgArraylength= response.data.length;
	 	}

	    for(var i=0;i<imgArraylength;++i){
	    	//createImgContainer(response.data[i]);
	    	if((i+1)%2===0){
	    		multiplesFive+=1;
	    	}
	 	}
	 	console.log(multiplesFive);
	 	createImgContainers(response.data,multiplesFive,imgArraylength);
	}); 

}

function createImgContainers(gifObject,multiplesFive,imgArraylength){
	
	var rowDivArray= new Array();
	for(var i=0;i<multiplesFive;++i){
		var tempRow = $("<div>");
		tempRow.attr("class","row");
		rowDivArray.push(tempRow);
	}

	console.log(rowDivArray.length);

	var rowCounter=0;

	for(var i=0;i<imgArraylength;++i){
		
		if(i%2===0&& i!=0){
			rowCounter+=1;
		}

		var imgContainer = $("<div>");
		var imgText = $("<p>");
		var img = $("<img>");

		imgContainer.attr("class","col-md-6");
		imgText.html("Rating:" +gifObject[i].rating.toUpperCase());
		img.attr("src", gifObject[i].images.fixed_height_still.url);
		img.attr("alt", "anImage");
		img.attr("data-static", gifObject[i].images.fixed_height_still.url);
		img.attr("data-animate", gifObject[i].images.fixed_height.url);
		img.attr("state", "static");
		img.attr("class", "imageClick");

		imgContainer.append(imgText,img);


		console.log("item"+i+"  "+rowCounter);
		rowDivArray[rowCounter].append(imgContainer);

		

		

	}
	for(var i=0;i<rowDivArray.length;++i){
		$("#imageContainer").append(rowDivArray[i]);
	}



	// var imgContainer = $("<div>");
	// var imgText = $("<p>");
	// var img = $("<img>");

	// imgText.html(gifObject.rating);
	// img.attr("src", gifObject.images.fixed_width_still.url);
	// img.attr("data-static", gifObject.images.fixed_width_still.url);
	// img.attr("data-animate", gifObject.images.fixed_width.url);
	// img.attr("state", "static");
	// img.attr("class", "imageClick");

	// imgContainer.append(imgText,img);
	// $("#imageContainer").append(imgContainer);


}

function tvBackground(tvshow){

var queryURL = "http://api.tvmaze.com/singlesearch/shows?q="+tvshow;

	$.ajax({url: queryURL, method: 'GET'

})
	 .done(function(response) {
	 	$("body").css({"background-image": "url("+response.image.original+")"});
	});
}