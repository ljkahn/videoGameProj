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
  // Declare variable for giant bomb api key
  var bombKey = "e5af497a03a411164e9f7c6c123e898f0a91fcff";
  // Declare variable for giant bomb endpoint url
  var bombUrl = "https://www.giantbomb.com/api/games/?api_key=";

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
            for (let i = 0; i < 3; i++) 
            {
                $(topGameImg[i]).attr("src", data.results[i].background_image);
                $(topGameName[i]).text(data.results[i].name);
                $(topGameScore[i]).text("Metacritic Score: " + data.results[i].metacritic);

                for (let x = 0; x < data.results[i].genres.length; x++) 
                {
                    $(topGameGenre[i]).append("<li>" + data.results[i].genres[x].name) +
                    "</li>";
                }

                $(favBtn[i]).on("click", function() {
                    addToFavs(data.results[i])
                });
            }
        });
    }

    async function listGenres(aGenre) {
        // Convert searches to lowercase to pull up results
        aGenre = aGenre.toLowerCase();
        // If input is RPG search by genre id to pull up results
        if (aGenre === "rpg") 
        {
            // RPG id
            aGenre = 5;
        } 
        else if (aGenre === "massively multiplayer") 
        {
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
        if (response.response === 404) 
        {
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
        if (aGenre === "rpg") 
        {
            // RPG id
            aGenre = 5;
        } 
        else if (aGenre === "massively multiplayer") 
        {
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
        if (response.response === 404) 
        {
            return;
        }

        const data = await response.json();

        console.log(data);
        // renderGenreList(data, 5);
        for (let i = 0; i < data.results.length; i++)
        {
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
        for (const element of userInput) 
        {
        // Declare variable for endpoint with concatenated queries and user input
            let requestSearch = rawgURL + queries + element;
        // Declare data variable that will get the results from fetching the above variable
            const response = await fetch(requestSearch)
            // then function uses fetch results

            //Can get data
            if (response.response === 404) 
            {
                return;
            }

            const data = await response.json();
            
            // Make input lowercase for comparison
            var namesLower = element.toLowerCase();
            // Declare results variable to reduce dot notation
            var results = data.results;
            // for loop to compare results against user input
            for (var i = 0; i < results.length/2; i++) 
            {
                var dataGenres = results[i].genres;
                var resultsLower = results[i].name.toLowerCase();
                // Limit search to game titles including user input and a metacritic score
                if (
                resultsLower.includes(namesLower) &&
                results[i].metacritic &&
                results[i].suggestions_count > 200
                ) 
                {
                    // Nested loop finds each genre if game has more than one listed
                    for (const key of dataGenres) 
                    {
                        // Push genres of top matches to genres array by id
                        genres.push(key.name);
                    }
                }
            }
        }
        

        // remove duplicates
        genres = [...new Set(genres)];

        const awaitGenres = async function () 
        {
            let searchGenres = [];
            for (const element of genres) {
                searchGenres = await searchGenre(element, platform);              
            }
            return searchGenres;
        }
        
        const searchReturn = await awaitGenres();

        //Gets 20 random games from list and adds them to the list to be rendered
        for (let i = 0; i < 20; i++)
        {
            let pick = Math.floor(Math.random() * searchResults.length);
            let game = searchResults[pick];

            if (i === 0)
            {
                refinedList.push(game);
                continue;
            }
            
            for (let x = 0; x < refinedList.length; x++)
            {
                if (refinedList[x].name !== game.name)
                {
                    refinedList.push(game);
                    break;
                }
            }
        }
        console.log(refinedList);
        renderGameList(refinedList);
    }

    //Renders refinedList
    function renderGameList(data)
    {
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

        for (let i = 0; i < iteration; i++)
        {
            genreList.children().eq(i).addClass("hide");
        }
        
        //Updates card with data
        for (let x = 0; x < data.length; x++) 
        {
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
                "<li>" + data[x].genres[y].name + "</li>");
            }

            //Creates a list of all platforms the game is on
            for (let z = 0; z < data[x].platforms.length; z++) {
                $(genrePlatformsList[x]).append(
                "<li>" + data[x].platforms[z].platform.name + "</li>");
            }

            $(unusedBtn[x]).addClass("hide");
            $(favBtn[x]).removeClass("hide");

            $(favBtn[x]).off();
            
            $(favBtn[x]).on("click", function() {
                addToFavs(data[x])
            });
        }
    }

    // remove duplicates
    genres = [...new Set(genres)];
    console.log(genres);

    // For each genre pulled from the favorite games
    // for (const element of genres) {
    searchGenre(genres[0]);
    //     console.log(element);
    // }
  

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
      for (let y = 0; y < data.results[x].genres.length / 2; y++) {
        $(genreGenreList[x]).append(
          "<li class = 'text-start greyBodyText'>" +
            data.results[x].genres[0].name +
            "</li>"
        );
      }

      //Creates a list of all platforms the game is on
      for (let z = 0; z < data.results[x].platforms.length; z++) {
        $(genrePlatformsList[x]).append(
          "<li class ='text-start greyBodyText'>" +
            data.results[x].platforms[z].platform.name +
            "</li>"
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
        for (let i = 0; i < iteration - 1; i++)
        {
            genreGameCard.clone().appendTo(genreList);
        }
      }
    })
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

        for (let a = 0; a < iteration; a++) 
        {
            genreList.children().eq(a).addClass("hide");
        }

        for (let x = 0; x < data.results.length; x++) 
        {
             //Reveals all the cards
            genreList.children().eq(x).removeClass("hide");

            for (let y = 0; y < data.results[x].genres.length; y++) 
            {
                $(genreGenreList[x]).children().remove();
            }

            for (let z = 0; z < data.results[x].platforms.length; z++) 
            {
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
                "<li>" + data.results[x].genres[y].name + "</li>");
            }

            //Creates a list of all platforms the game is on
            for (let z = 0; z < data.results[x].platforms.length; z++) {
                $(genrePlatformsList[x]).append(
                "<li>" + data.results[x].platforms[z].platform.name + "</li>");
            }

            $(unusedBtn[x]).addClass("hide");
            $(favBtn[x]).removeClass("hide");

            $(favBtn[x]).off();

            $(favBtn[x]).on("click", function() {
                addToFavs(data.results[x])
            });
        }
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

    function addToFavs(game)
    {
        favoritesList.push(game);

        localStorage.setItem("favList", JSON.stringify(favoritesList));
    }

    var game = $("#input").val();
    favGames.unshift(game);
    localStorage.setItem("favorite-game", JSON.stringify(favGames));
    updateFave();
  });

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
        for (let a = 0; a < iteration; a++) 
        {
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
    $("#clear-favs").on("click", function() {
        localStorage.clear();
        let favs = "";

        renderGameList(favs);
    })

    // FUNCTION CALLS
    createGenreList();
    renderCurrentTopGame();
});
