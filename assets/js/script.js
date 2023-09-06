// Do everything inside jquery function to make sure DOM loads first
$(function () {

    // VARIABLE DECLARATIONS
    
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

    //Pulls recent games with highest metacritic score and displays their data
    function renderCurrentTopGame()
    {
        let requestLink = rawgURL +"games" + rawgID + "&ordering=-metacritic&dates=2022-01-01,2023-09-05";
        fetch(requestLink)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let topGameImg = $(".top-game-img");
            let topGameName = $(".top-game-name");
            let topGameGenre = $(".top-game-genre")
            let topGameScore = $(".top-game-score");
            
            for (let i = 0; i < topGameImg.length; i++)
            {
                $(topGameImg[i]).attr('src', data.results[i].background_image);
                $(topGameName[i]).text(data.results[i].name);
                $(topGameScore[i]).text("Metacritic Score: " + data.results[i].metacritic);

                //Gets all genres listed for game
                for (let x = 0; x < data.results[i].genres.length; x++)
                {
                    $(topGameGenre[i]).append("<li>" + data.results[i].genres[x].name) + "</li>";
                }
            }
        })

    }


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
    renderCurrentTopGame();


// Push this down to keep code above the closing bracket/parenthesis
});