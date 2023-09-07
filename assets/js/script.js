// Do everything inside jquery function to make sure DOM loads first
$(function () {

    // VARIABLE DECLARATIONS
    
    // Declare variable for rawgURL
    var rawgURL = "https://api.rawg.io/api/";
    // Declare variable for rawg API key
    var rawgID = "?key=ad61e1d9ed3844018c1885a37313c3e9";
    // Declare variable for user input  [$('input-1'), $('input-2'), $('input-3')]
    var userFavorites = ["hades", 'god of war', 'limbo']

    
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
    
    
    // Declare findMatches async function
    async function findMatches () {
        // Declare variable with all concatenated queries
        var queries = "games" + rawgID + "&search_precise=true" + "&search_exact=true" + "&ordering=-metacritic" + "&search=";
        // Declare genres variable to store genres of favorite games
        var genres = [];
        
        // Use for of loop to iterate through array of user input
        for (const element of userFavorites) {
            // Declare variable for endpoint with concatenated queries and user input
            let requestSearch = rawgURL + queries + element;
            // Declare data variable that will get the results from fetching the above variable
            const data = await fetch(requestSearch)
            // 
            .then(function (response) {
                // Validation
                if (response.status === 404) {
                    return;
                }
                return response.json();
            })
            console.log(data);
            // Declare results variable to make dot 
            var results = data.results;
            // console.log(results);
            // Make input lowercase for comparison
            var namesLower = element.toLowerCase();
            // for loop to compare results against user input
            for (var j = 0; j < results.length; j++) {
                var dataGenres = results[j].genres
                var resultsLower = results[j].name.toLowerCase();
                // Limit search to game titles including user input and a metacritic score
                if (resultsLower.includes(namesLower) && results[j].metacritic) {
                    // Nested loop finds each genre if game has more than one listed 
                    for (const key of dataGenres) {
                        // Push genres of top matches to genres array
                        genres.push(results[j].genres[0].name);
                    }
                }
            }
        }
        // remove duplicates
        genres = [...new Set(genres)];
        console.log(genres);
        
        // For each genre pulled from the favorite games 
        // for (const element of genres) {
            
        // }           
    }

    // Create function for searching by genre
    // asynch function searchGenre (aGenre) {
    //     var genreSearchQuery = "games" + rawgID + "&ordering=-metacritic"
    // }
    
    
    // EVENT LISTENERS
    
    // LIA - Use this in your event listener when I'm done with the genreSearch function  
    // var listLimit = $('input')
    // for (var i = 0; i < listLimit; i++) {
    //     // Call genreSearch()
    // }

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
    
        })
    
    
         //genre button event listener to display games based on the api genre data
        $("#nav-el").on("click", function (event) {
            event.stopPropagation();
            $("#main").addClass("hide"); 
            $("#games-list").removeClass("hide");
    
    
        
        var choice = event.target;
        var userSelect = choice.getAttribute("id");
    
        findMatches ();
        
    })
    
    
    
    
    
    

    
    // FUNCTION CALLS
    
    getData();
    findMatches();

// Push this down to keep code above the closing bracket/parenthesis
});