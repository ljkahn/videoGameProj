//Random stuff
//More random
//Even more random
//
//
//
// Do everything inside jquery function to make sure DOM loads first
$(function () {

    // VARIABLE DECLARATIONS

    // The quick brown fox jumped over the lazy dog TEST TEST TEST TEST TEST
    
    // Declare variable for rawgURL
    var rawgURL = "https://api.rawg.io/api/";
    // Declare variable for rawg API key
    var rawgID = "?key=ad61e1d9ed3844018c1885a37313c3e9";
    // Declare variable for user input
    var userInput;

    
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
    
    
    
    
    
    
    
    
    // FUNCTION CALLS
    
    getData();


// Push this down to keep code above the closing bracket/parenthesis
});