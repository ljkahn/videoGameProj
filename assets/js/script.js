// Do everything inside jquery function to make sure DOM loads first
$(function () {
    // VARIABLE DECLARATIONS

    // Declare variable for rawgURL
    var rawgURL = "https://api.rawg.io/api/";
    // Declare variable for rawg API key
    var rawgID = "?key=ad61e1d9ed3844018c1885a37313c3e9";
    // Declare genres array variable
    var genres = [];
    // Declare variable for api endpoint
    reviewUrl = "https://gamereviews.p.rapidapi.com/games/destructoid";
    // Declare variable to store object of method, key, and host
    reviewOptions = {
        method: "GET",
        headers: {
        "X-RapidAPI-Key": "e1809c1148msh63d6d06814bd88cp1562f3jsna58fa1824902",
        "X-RapidAPI-Host": "gamereviews.p.rapidapi.com",
        },
    };
    

    // FUNCTION DECLARATIONS

    //   function getData() {
    //     let requestLink = rawgURL + "genres" + rawgID;

    //     // console.log(requestLink);

    //     fetch(requestLink)
    //       .then(function (response) {
    //         if (response.ok) {
    //           //Data returns
    //           return response.json();
    //         } else if (response.status === 404) {
    //           //404 error
    //         }
    //       })
    //       .then(function (data) {
    //         // console.log(data);
    //       });
    //   }

    function renderCurrentTopGame() {
        let requestLink =
        rawgURL +
        "games" +
        rawgID +
        "&ordering=-metacritic&dates=2022-01-01,2023-09-05";

        fetch(requestLink)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let topGameImg = $(".top-game-img");
            let topGameName = $(".top-game-name");
            let topGameScore = $(".top-game-score");
            let topGameGenre = $(".top-game-genre");

            for (let i = 0; i < 3; i++) {
            $(topGameImg[i]).attr("src", data.results[i].background_image);
            $(topGameName[i]).text(data.results[i].name);
            $(topGameScore[i]).text(
                "Metacritic Score: " + data.results[i].metacritic
            );

            for (let x = 0; x < data.results[i].genres.length; x++) {
                $(topGameGenre[i]).append("<li>" + data.results[i].genres[x].name) +
                "</li>";
            }
            }
        });
    }

    // Declare findMatches async function
    async function findMatches(userInput) {
        // Use the platform selector to get the associated platform id
        var platform = $('.form-select').val();
        // If no platform chosen use the pc code for generic search
        if (!platform) {
            platform = 4;
        }

        // Declare variable with all concatenated queries
        let queries =
        "games" +
        rawgID +
        "&search_precise=true" +
        "&search_exact=true" +
        "&exclude_additions=true" +
        "&ordering=-metacritic" +
        "&platforms=" + platform +
        "&exclude_collection=true" +
        "&dates=2010-01-01,2023-08-05" +
        "&search=";

        // Clear genres array every time findMatches is called
        genres = [];

        // Use for of loop to iterate through array of user input
        for (const element of userInput) {
        console.log(userInput);
        // Declare variable for endpoint with concatenated queries and user input
        let requestSearch = rawgURL + queries + element;
        // Declare data variable that will get the results from fetching the above variable
        const data = await fetch(requestSearch)
            // then function uses fetch results
            .then(function (response) {
            // Validation
            if (response.status === 404) {
                return;
            }
            return response.json();
            });

        // console.log(data);
        console.log(data);
        // Make input lowercase for comparison
        var namesLower = element.toLowerCase();
        // Declare results variable to reduce dot notation
        var results = data.results;
        // for loop to compare results against user input
        for (var i = 0; i < results.length; i++) {
            var dataGenres = results[i].genres;
            var resultsLower = results[i].name.toLowerCase();
            // Limit search to game titles including user input and a metacritic score
            if (
            resultsLower.includes(namesLower) &&
            results[i].metacritic &&
            results[i].suggestions_count > 200
            ) {
            // Nested loop finds each genre if game has more than one listed
            for (const key of dataGenres) {
                // Push genres of top matches to genres array by id
                genres.push(key.name);
                // console.log(key.id);
                console.log(key.name);
            }
            }
        }
        }

        // remove duplicates
        genres = [...new Set(genres)];
        console.log(genres);

        // For each genre pulled from the favorite games
        for (const element of genres) {
        searchGenre(element);
        console.log(element);
        }
        console.log(genres.length);
    }

    // Create function for searching by genre
    function searchGenre(aGenre) {
        // Convert searches to lowercase to pull up results
        aGenre = aGenre.toLowerCase();
        // If input is RPG search by genre id to pull up results
        if (aGenre === "rpg") {
        // RPG id
        aGenre = 5;
        } else if (aGenre === "massively multiplayer") {
        // MMO id
        aGenre = 59;
        }

        // Declare variable to store api queries
        var genreSearchQuery =
        "games" +
        rawgID +
        "&ordering=-metacritic" +
        "&genres=" +
        aGenre +
        "&exclude_additions=true" +
        "&dates=2015-01-01,2023-08-05";

        // Concat queries to endpoint URL
        var requestGenres = rawgURL + genreSearchQuery;

        // Fetch request data for games by genre
        fetch(requestGenres)
        .then(function (response) {
            // Validation
            if (response.status === 404) {
            return;
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // renderGenreList(data, 5);
            renderGenreList(data);
        });
    }

    //Creates 20 card to display game when a genre is selected from
    //the nav bar on load, as to not clog the HTML file
    function createGenreList() {
        let genreList = $(".genre-list");
        let genreGameCard = $(".game-genre-card");

        for (let i = 0; i < 19; i++) {
        genreGameCard.clone().appendTo(genreList);
        }
    }

    //Update the text and images of the cards to show the data for the current genre
    // function renderGenreList(data, iterations) {
    function renderGenreList(data) {
        let genreList = $(".genre-list");

        //Reveals all the cards
        // for (let a = 0; a < iterations; a++) {
        for (let a = 0; a < 20; a++) {
        genreList.children().eq(a).removeClass("hide");
        }

        let genreGameImg = $("[id=genre-game-img]");
        let genreGameName = $("[id=genre-game-name]");
        let genreGameScore = $("[id=genre-game-score]");
        let genreGenreList = $("[id=genre-genre-list]");
        let genrePlatformsList = $("[id=genre-platform-list]");

        for (let x = 0; x < data.results.length; x++) {
        //Sets image, name, and metacritic score
        $(genreGameImg[x]).attr("src", data.results[x].background_image);
        $(genreGameName[x]).text(data.results[x].name);
        $(genreGameScore[x]).text(
            "Metacritic Score: " + data.results[x].metacritic
        );

        //Creates a list of every genre listed listed for the game
        for (let y = 0; y < data.results[x].genres.length; y++) {
            $(genreGenreList[x]).append(
            "<li>" + data.results[x].genres[y].name + "</li>"
            );
        }

        //Creates a list of all platforms the game is on
        for (let z = 0; z < data.results[x].platforms.length; z++) {
            $(genrePlatformsList[x]).append(
            "<li>" + data.results[x].platforms[z].platform.name + "</li>"
            );
        }
        }
    }

    function renderCurrentTopGame() {
        let requestLink =
        rawgURL +
        "games" +
        rawgID +
        "&ordering=-metacritic&dates=2022-01-01,2023-09-05";
        fetch(requestLink)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let topGameImg = $(".top-game-img");
            let topGameName = $(".top-game-name");
            let topGameScore = $(".top-game-score");
            let topGameGenre = $(".top-game-genre");

            for (let i = 0; i < 3; i++) {
            $(topGameImg[i]).attr("src", data.results[i].background_image);
            $(topGameName[i]).text(data.results[i].name);
            $(topGameScore[i]).text(
                "Metacritic Score: " + data.results[i].metacritic
            );

            for (let x = 0; x < data.results[i].genres.length; x++) {
                $(topGameGenre[i]).append("<li>" + data.results[i].genres[x].name) +
                "</li>";
            }
            }
        });
    }

    // EVENT LISTENERS

    // Show main and hide favorites list
    $("#home-button").on("click", function (event) {
        $("#favorites-list").addClass("hide");
        $("#main").removeClass("hide");
    });

    //favorites button --> local storage
    $("#favorites-button").on("click", function (event) {
        // var userInput = $("#input").val();

        $("#main").addClass("hide");
        $("#favorites-list").removeClass("hide");

        //store search results
        //create variable to store searches in

        var favGames = JSON.parse(localStorage.getItem("favorites")) || [];

        function updateFave() {
        favGames.forEach(function (game) {
            $("#favorites-list").append(`<li>${game}</li>`);
        });
        }

        var game = $("#input").val();
        favGames.unshift(game);
        localStorage.setItem("favorite-game", JSON.stringify(favGames));
        updateFave();
    });

    // EVENT LISTENERS

    //genre button event listener to display games based on the api genre data
    $(".dropdown-item").on("click", function (event) {
        event.stopPropagation();
        $("#main").addClass("hide");
        $("#games-list").removeClass("hide");

        //store search results
        //create variable to store searches in

        var favGames = JSON.parse(localStorage.getItem("favorites")) || [];

        function updateFave() {
        favGames.forEach(function (game) {
            $("#favorites-list").append(`<li>${game}</li>`);
        });
        }

        var game = $("#input").val();
        favGames.unshift(game);
        localStorage.setItem("favorite-game", JSON.stringify(favGames));
        updateFave();
    });

    //genre button event listener to display games based on the api genre data
    $(".dropdown-item").on("click", function (event) {
        event.stopPropagation();
        $("#main").addClass("hide");
        $("#recommendation").addClass("hide");
        $("#games-list").removeClass("hide");

        var choice = event.target.textContent;
        console.log(choice);
        searchGenre(choice);

        //input = whatever number they choose from dropdown
        // var listLimit = $('input')
        // for (var i = 0; i < listLimit; i++) {

        //     searchGenre()
        // };
    });

    $("#game-seeker").on("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        $("main").addClass("hide");
        $("#recommendation").addClass("hide");
        $("#games-list").removeClass("hide");
        // Declare variable for user input
        userFavorites = [
        $("#game-1").val(),
        $("#game-2").val(),
        $("#game-3").val(),
        ];

        findMatches(userFavorites);
    });

    // FUNCTION CALLS

    // getData();
    // findMatches();
    createGenreList();
    renderCurrentTopGame();
    reviewLinks();
















































    // Create a function for a second server side api
    function reviewLinks() {
        // Fetch data with the url and object
        fetch(reviewUrl, reviewOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);

            // Declare variable for review class
            var reviews = $(".reviews");
            // Start loop at 1 to skip first result, didn't recognize it
            for (var i = 1; i < 15; i++) {
            // Remove "Reviews: " from every review title
            var fixedTitle = data[i].title.substr(data[i].title.indexOf(" ") + 1);
            // Give reviews[i] the url of data[i] to link to the appropriate site
            $(reviews[i]).attr("href", data[i].url);
            // Add text of revised review title
            $(reviews[i]).text(fixedTitle);
            }
        });
    }

  // Push this down to keep code above the closing bracket/parenthesis
});
