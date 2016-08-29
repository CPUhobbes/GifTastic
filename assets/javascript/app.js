/*
 *STATIC VARIABLES
 */
 var TOPICS=["South Park","Bob\'s Burgers", "Archer","Futurama", "American Dad","Family Guy", "Venture Brothers", "Rick and Morty", "The Simpsons", "Bojack Horseman", 
 "Daria", "Robot Chicken"];

 var GIPHY_API_KEY = "dc6zaTOxFJmzC";



//On page load, display all defualt buttons
$(document).ready(function(){
	displayButtons();
	
});

//If enter is pressed in the textbox, add that button
$("input").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        addButton();
    }
});

//If Add TV Show button is pressed, add that button
$("#addButton").on("click", function(){
	addButton();

});

//If a TV show button is clicked, get API results and display them
$(document).on("click", ".buttonSearch", function(){

	var tvshow = $(this).data("name");
	runAPI(tvshow);
	tvBackground(tvshow);

});

//If a gif is clicked and not running, run the gif, else stop the gif
$(document).on("click", ".imageClick", function(){
	var animate = $(this).data("animate");
	var static = $(this).data("static");
	//console.log(animate);

	if($(this).attr("data-state") === "static"){
		$(this).attr("src", animate);
		$(this).attr("data-state", "animate");

	}
	else{
		$(this).attr("src", static);
		$(this).attr("data-state", "static");
	}

});


//Add TV show to array and display buttons
function addButton(){
	TOPICS.push($("#addCategoryBox").val());
	displayButtons();

}

//Create buttom for each element in the button array
function createButton(name){

	var singleButton = $("<button>");

	singleButton.attr("data-name",name);
	singleButton.attr("class","btn btn-primary buttonSearch");
	singleButton.html(name);
	$("#buttonContainer").append(singleButton);
}

//Display each element in the button array
function displayButtons(){
	$("#buttonContainer").empty();
	for(var i=0;i<TOPICS.length;++i){
			createButton(TOPICS[i]);
	}
}

//Run API call and get gif still image and actual gif.  Display gif still image
function runAPI(name){

	var queryURL = "http://api.giphy.com/v1/gifs/search?q="+name+"&api_key="+GIPHY_API_KEY;

	$.ajax({url: queryURL, method: 'GET'})
	 .done(function(response) {
	 	$("#imageContainer").empty();

	 	var imgArraylength;
	 	var multiples=1;

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
	    		multiples+=1;
	    	}
	 	}
	 	//console.log(multiples);
	 	createImgContainers(response.data,multiples,imgArraylength);
	}); 

}

//Get background from tvmaze API and set background to image
//If multiple shows have same name, undefined response will be returned (per API documentation)
function tvBackground(tvshow){

var queryURL = "http://api.tvmaze.com/singlesearch/shows?q="+tvshow;

	$.ajax({url: queryURL, method: 'GET', 
		success: function (response) {
        	$("body").css({"background-image": "url("+response.image.original+")"});
    	}, 
    	//If cannot find show use default black image
    	error: function (response){
    		$("body").css({"background-image": "url(\"../images/bg_default.png\")"});
    	}

	});
}

//Create image containers for each gif
function createImgContainers(gifObject,multiples,imgArraylength){
	
	var rowDivArray= new Array();
	for(var i=0;i<multiples;++i){
		var tempRow = $("<div>");
		tempRow.attr("class","row");
		rowDivArray.push(tempRow);
	}

	//console.log(rowDivArray.length);

	var rowCounter=0;

	for(var i=0;i<imgArraylength;++i){
		
		if(i%2===0&& i!=0){
			rowCounter+=1;
		}

		var imgContainer = $("<div>");
		var imgText = $("<p>");
		var img = $("<img>");

		imgContainer.attr("class","col-md-6");
		imgText.attr("class", "imgText")
		imgText.html("Rating:" +gifObject[i].rating.toUpperCase());
		img.attr("src", gifObject[i].images.fixed_height_still.url);
		img.attr("alt", "anImage");
		img.attr("data-static", gifObject[i].images.fixed_height_still.url);
		img.attr("data-animate", gifObject[i].images.fixed_height.url);
		img.attr("data-state", "static");
		img.attr("class", "imageClick");

		imgContainer.append(imgText,img);


		//console.log("item"+i+"  "+rowCounter);
		rowDivArray[rowCounter].append(imgContainer);

	}
	for(var i=0;i<rowDivArray.length;++i){
		$("#imageContainer").append(rowDivArray[i]);
	}
}