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
    
    // Declare findMatches function
    function findMatches () {

        userFavorites
        // Search input against database with game search endpoint
        let requestLink = rawgURL + "search" + rawgID;

        console.log(requestLink);

        // Get genre and store in variable
        // var userGenre = data.genreElement

        // search userGenre for top games of same genre
        

    }
    
    
    
    
    // EVENT LISTENERS
    
    
    
    
    
    
    
    
    // FUNCTION CALLS
    
    getData();


// Push this down to keep code above the closing bracket/parenthesis
});