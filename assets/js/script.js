// Do everything inside jquery function to make sure DOM loads first
$(function () {
    // VARIABLE DECLARATIONS
    var iteration = 20;
    var searchResults = [];
    var refinedList = [];
    var favoritesList = JSON.parse(localStorage.getItem("favList")) || [];

    var day = dayjs();

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

    //Gets and renders the top rated games of the last month
    function renderCurrentTopGame() {
        let lastMonth = dayjs().subtract(30, 'day');
        let requestLink =
            rawgURL +
            "games" +
            rawgID +
            "&ordering=-metacritic&dates=" +
            lastMonth +
            "," +
            day;

        fetch(requestLink)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                let topGameImg = $(".top-game-img");
                let topGameName = $(".top-game-name");
                let topGameScore = $(".top-game-score");
                let topGameGenre = $(".top-game-genre");
                let favBtn = $(".top-add-favorite");

                //Renders data
                for (let i = 0; i < 3; i++) {
                    $(topGameImg[i]).attr("src", data.results[i].background_image);
                    $(topGameName[i]).text(data.results[i].name);
                    $(topGameScore[i]).text("Metacritic Score: " + data.results[i].metacritic);

                for (let x = 0; x < data.results[i].genres.length; x++) 
                {
                    //Only show 2 genres
                    if (x === 2)
                    {
                        break;
                    }

                    $(topGameGenre[i]).append("<li>" + data.results[i].genres[x].name) +
                    "</li>";
                }

                    $(favBtn[i]).on("click", function () {
                        addToFavs(data.results[i])
                    });
                }
            });
    }

    async function listGenres(aGenre) {
        // Convert searches to lowercase to pull up results
        aGenre = aGenre.toLowerCase();
        // If input is RPG search by genre id to pull up results
        if (aGenre === "rpg") {
            // RPG id
            aGenre = 5;
        }
        else if (aGenre === "massively multiplayer") {
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
        const response = await fetch(requestGenres)
        // Validation
        if (response.response === 404) {
            return;
        }

        const data = await response.json();

        renderGenreList(data);
    }

    // Create function for searching by genre
    async function searchGenre(aGenre, platform) {
        // Convert searches to lowercase to pull up results
        aGenre = aGenre.toLowerCase();
        // If input is RPG search by genre id to pull up results
        if (aGenre === "rpg") {
            // RPG id
            aGenre = 5;
        }
        else if (aGenre === "massively multiplayer") {
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
            "&dates=2015-01-01,2023-08-05" +
            "&platforms=" + platform;

        // Concat queries to endpoint URL
        var requestGenres = rawgURL + genreSearchQuery;

        // Fetch request data for games by genre
        const response = await fetch(requestGenres)
        // Validation
        if (response.response === 404) {
            return;
        }

        const data = await response.json();

        console.log(data);
        // renderGenreList(data, 5);
        for (let i = 0; i < data.results.length; i++) {
            let game = data.results[i];
            searchResults.push(game);
        }

        return searchResults;
    }

    // Declare findMatches async function
    async function findMatches(userInput, platform) {
        // Declare variable with all concatenated queries
        let queries =
            "games" +
            rawgID +
            "&search_precise=true" +
            "&search_exact=true" +
            "&exclude_additions=true" +
            "&ordering=-metacritic" +
            "&exclude_collection=true" +
            "&dates=2010-01-01,2023-08-05" +
            "&platforms=" +
            platform +
            "&search=";

        // Clear genres array every time findMatches is called
        genres = [];
        searchResults = [];
        refinedList = [];

        // Use for of loop to iterate through array of user input
        for (const element of userInput) {
            // Declare variable for endpoint with concatenated queries and user input
            let requestSearch = rawgURL + queries + element;
            // Declare data variable that will get the results from fetching the above variable
            const response = await fetch(requestSearch)
            // then function uses fetch results

            //Can get data
            if (response.response === 404) {
                return;
            }

            const data = await response.json();

            // Make input lowercase for comparison
            var namesLower = element.toLowerCase();
            // Declare results variable to reduce dot notation
            var results = data.results;
            // for loop to compare results against user input
            for (var i = 0; i < results.length / 2; i++) {
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
                    }
                }
            }
        }


        // remove duplicate genres
        genres = [...new Set(genres)];

        const awaitGenres = async function () {
            let searchGenres = [];
            for (const element of genres) {
                searchGenres = await searchGenre(element, platform);
            }
            return searchGenres;
        }

        const searchReturn = await awaitGenres();


        // console.log(searchResults);

        // Create a new set to store unique object ids
        const uniqueIds = new Set();

        // Use filter to remove duplicates based on the ids
        const uniqueObjects = searchResults.filter(obj => {

            // Check if the id is already in the set
            if (uniqueIds.has(obj.id)) {
                // Return false if it's a duplicate to make sure it isn't added
                return false;
            }

            // If not a duplicate, add it to the set and return true to include obj
            uniqueIds.add(obj.id);
            return true;
        });


        console.log(searchResults);
        console.log(uniqueObjects);


        //Gets 20 random games from list and adds them to the list to be rendered
        for (let i = 0; i < 20; i++) {
            refinedList.push(uniqueObjects[i]);
        }

        //     let pick = Math.floor(Math.random() * uniqueObjects.length);
        //     let game = uniqueObjects[pick];

        console.log(refinedList);
        renderGameList(refinedList);
    }

    //Renders refinedList
    function renderGameList(data) {
        //Hides other menus
        $("#main").addClass("hide");
        $("#recommendation").addClass("hide");

        let genreList = $(".genre-list");
        let genreGameImg = $("[id=genre-game-img]");
        let genreGameName = $("[id=genre-game-name]");
        let genreGameScore = $("[id=genre-game-score]");
        let genreGenreList = $("[id=genre-genre-list]");
        let genrePlatformsList = $("[id=genre-platform-list]");

        let unusedBtn = $(".genre-add-favorite");
        let favBtn = $(".search-add-favorite");

        var loadingText = $('#loading-text');
        loadingText.addClass("hide");

        for (let i = 0; i < iteration; i++) {
            genreList.children().eq(i).addClass("hide");
        }

        //Updates card with data
        for (let x = 0; x < data.length; x++) {
            //Renders cards
            genreList.children().eq(x).removeClass("hide");

            for (let y = 0; y < data[x].genres.length; y++) {
                $(genreGenreList[x]).children().remove();
            }

            for (let z = 0; z < data[x].platforms.length; z++) {
                $(genrePlatformsList[x]).children().remove();
            }

            //Sets image, name, and metacritic score
            $(genreGameImg[x]).attr("src", data[x].background_image);
            $(genreGameName[x]).text(data[x].name);
            $(genreGameScore[x]).text(
                "Metacritic Score: " + data[x].metacritic);

            //Creates a list of every genre listed listed for the game
            for (let y = 0; y < data[x].genres.length; y++) {
                $(genreGenreList[x]).append(
                    "<li class ='text-start greyBodyText'>" + data[x].genres[y].name + "</li>");
            }

            //Creates a list of all platforms the game is on
            for (let z = 0; z < data[x].platforms.length; z++) {
                $(genrePlatformsList[x]).append(
                    "<li class ='text-start greyBodyText'>" + data[x].platforms[z].platform.name + "</li>");
            }

            $(unusedBtn[x]).addClass("hide");
            $(favBtn[x]).removeClass("hide");

            $(favBtn[x]).off();

            $(favBtn[x]).on("click", function () {
                addToFavs(data[x])
            });
        }
    }

    //Creates 20 card to display game when a genre is selected from
    //the nav bar on load, as to not clog the HTML file
    function createGenreList() {
        let genreList = $(".genre-list");
        let genreGameCard = $(".game-genre-card");

        for (let i = 0; i < iteration - 1; i++) {
            genreGameCard.clone().appendTo(genreList);
        }
    }

    //Update the text and images of the cards to show the data for the current genre
    // function renderGenreList(data, iterations) {
    function renderGenreList(data) {

        let genreList = $(".genre-list");
        let genreGameImg = $("[id=genre-game-img]");
        let genreGameName = $("[id=genre-game-name]");
        let genreGameScore = $("[id=genre-game-score]");
        let genreGenreList = $("[id=genre-genre-list]");
        let genrePlatformsList = $("[id=genre-platform-list]");

        let unusedBtn = $(".search-add-favorite");
        let favBtn = $(".genre-add-favorite");

        for (let a = 0; a < iteration; a++) {
            genreList.children().eq(a).addClass("hide");
        }

        for (let x = 0; x < data.results.length; x++) {
            //Reveals all the cards
            genreList.children().eq(x).removeClass("hide");

            for (let y = 0; y < data.results[x].genres.length; y++) {
                $(genreGenreList[x]).children().remove();
            }

            for (let z = 0; z < data.results[x].platforms.length; z++) {
                $(genrePlatformsList[x]).children().remove();
            }

            //Sets image, name, and metacritic score
            $(genreGameImg[x]).attr("src", data.results[x].background_image);
            $(genreGameName[x]).text(data.results[x].name);
            $(genreGameScore[x]).text(
                "Metacritic Score: " + data.results[x].metacritic);

            //Creates a list of every genre listed listed for the game
            for (let y = 0; y < data.results[x].genres.length; y++) {
                $(genreGenreList[x]).append(
                    "<li class ='text-start greyBodyText'>" + data.results[x].genres[y].name + "</li>");
            }

            //Creates a list of all platforms the game is on
            for (let z = 0; z < data.results[x].platforms.length; z++) {
                $(genrePlatformsList[x]).append(
                    "<li class ='text-start greyBodyText'>" + data.results[x].platforms[z].platform.name + "</li>");
            }

            $(unusedBtn[x]).addClass("hide");
            $(favBtn[x]).removeClass("hide");

            $(favBtn[x]).off();

            $(favBtn[x]).on("click", function () {
                addToFavs(data.results[x])
            });
        }
    }

    function addToFavs(game) {
        favoritesList.push(game);

        localStorage.setItem("favList", JSON.stringify(favoritesList));
    }

    // EVENT LISTENERS

    // Show main and hide favorites list
    $("#home-button").on("click", function (event) {
        let genreList = $(".genre-list");
        let resultsHeader = $("#results-header");
        $("#favorites-list").addClass("hide");
        resultsHeader.addClass("hide");
        let genreHeader = $("#genre-header");
        genreHeader.addClass("hide");
        let clearFavsBtn = $("#clear-favs");
        clearFavsBtn.addClass("hide");
        $("#main").removeClass("hide");

        //Hides all game cards
        for (let a = 0; a < iteration; a++) {
            genreList.children().eq(a).addClass("hide");
        }

        //Clears form
        $("#platform-selection").val("Choose...");
        $("#game-1").val("");
        $("#game-2").val("");
        $("#game-3").val("");
    });

    $("#favorites-button").on("click", function (event) {
        $("#main").addClass("hide");
        $("#favorites-list").removeClass("hide");
        let genreHeader = $("#genre-header");
        genreHeader.addClass("hide");
        let resultsHeader = $('#results-header');
        resultsHeader.addClass("hide");
        let clearFavsBtn = $("#clear-favs");
        clearFavsBtn.removeClass("hide");

        let favs = JSON.parse(localStorage.getItem("favList"));
        let favBtn = $(".search-add-favorite");

        renderGameList(favs);

        $(favBtn).addClass("hide");
    });

    //genre button event listener to display games based on the api genre data
    $(".dropdown-item").on("click", function (event) {
        event.stopPropagation();

        var choice = event.target.textContent;

        let resultsHeader = $("#results-header");
        let genreHeader = $("#genre-header");
        let favHeader = $("#favorites-list");
        let clearFavsBtn = $("#clear-favs");
        clearFavsBtn.addClass("hide");

        //Updates header with current genre name
        $(genreHeader).text(choice + " Games:");
        genreHeader.removeClass("hide");

        resultsHeader.addClass("hide");
        favHeader.addClass("hide");
        $("#main").addClass("hide");
        $("#recommendation").addClass("hide");
        $("#games-list").removeClass("hide");

        //Gets and renders games from genre selected
        listGenres(choice);
    });

    $("#game-seeker").on("click", function (event) {
        event.stopPropagation();
        event.preventDefault();

        //Hides other menus
        $("main").addClass("hide");
        $("#recommendation").addClass("hide");
        $("#games-list").removeClass("hide");
        let genreHeader = $("#genre-header");
        genreHeader.addClass("hide");
        let resultsHeader = $('#results-header');
        resultsHeader.removeClass("hide");
        let favHeader = $("#favorites-list");
        favHeader.addClass("hide");
        let clearFavsBtn = $("#clear-favs");
        clearFavsBtn.addClass("hide");

        // Declare variable for user input
        var platformSelection = $('#platform-selection option:selected').val();

        var userFavorites = [
            $("#game-1").val(),
            $("#game-2").val(),
            $("#game-3").val(),
        ];

        //Loading text when games are searched
        var loadingText = $('#loading-text');
        loadingText.removeClass("hide");

        findMatches(userFavorites, platformSelection);
    });

    // Clears local storage on click
    $("#clear-favs").on("click", function () {
        localStorage.clear();
        let favs = "";

        renderGameList(favs);
    })

    // FUNCTION CALLS
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