// Do everything inside jquery function to make sure DOM loads first
$(function () {

    // VARIABLE DECLARATIONS
    
    // Declare variable for rawgURL
    var rawgURL = "https://api.rawg.io/api/";
    // Declare variable for rawg API key
    var rawgID = "?key=ad61e1d9ed3844018c1885a37313c3e9";
    // Declare variable for user input
    var userFavorites = [$('#input-1'), $('#input-2'), $('#input-3')]

    
    // FUNCTION DECLARATIONS
    
    function getData()
    {
        let requestLink = rawgURL + "genres" + rawgID;
        
        console.log(requestLink);
        
        fetch(requestLink)
        .then(function (response) {
            if (response.ok)
            {
                //Data returns
                return response.json();
            }
            else if (response.status === 404)
            {
                //404 error
            }
        })
        .then(function (data) {
            console.log(data);
        })
    }





    
    // Realistically I'll move the code in this function up into the getData function because I'll need access to the local variables
    // function findMatches () {
        // Search input against database with game search endpoint
        
        // Get genre and store in variable
        // var userGenre = data.genreElement

        // search userGenre for top games of same genre
        // 

    // }
    
    
    
    
    // EVENT LISTENERS
    
// Show main and hide favorites list
$("#home-button").on("click", function(event){
    $("#favorites-list").addClass("hide"); 
    $("#main").removeClass("hide");

});




    //favorites button --> local storage 
    $("#favorites-button").on("click", function(event){
        // var userInput = $("#input").val();

        $("#main").addClass("hide"); 
        $("#favorites-list").removeClass("hide");

     //store search results
     //create variable to store searches in

     var favGames = JSON.parse(localStorage.getItem("favorites"))|| [];

     function updateFave () {
             favGames.forEach(function(game) {
                 $("#favorites-list").append(`<li>${game}</li>`);
             });

             
         };


        var game =$("#input").val();
        favGames.unshift(game);
        localStorage.setItem("favorite-game", JSON.stringify(favGames));
        updateFave();

     });


     //genre button event listener to display games based on the api genre data
     $("#nav-el").on("click", function (event) {
        event.stopPropagation();
        $("#main").addClass("hide"); 
        $("#games-list").removeClass("hide");


     
     var choice = event.target;
     var userSelect = choice.getAttribute("id");

     findMatches ();
      
})
    
    // Declare findMatches function
    function findMatches () {

        // userFavorites.forEach(element => {
            
            // Search input against database with game search endpoint
            let requestSearch = rawgURL + "games" + rawgID + "&search=" + "god of war" + "&search_exact=true";
            console.log(requestSearch);
        // });
            fetch(requestSearch)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    return;
                }
            })
            .then(function (data) {
                console.log(data);
                // Get genre and store in variable
                
                // var userGenre = data.genreElement
                
                // search userGenre for top games of same genre
                
                
            })
    }
    
    
    
    
    // EVENT LISTENERS
    
    
    
    
    
    
    

    
    // FUNCTION CALLS
    
    getData();
    findMatches();

// Push this down to keep code above the closing bracket/parenthesis
});