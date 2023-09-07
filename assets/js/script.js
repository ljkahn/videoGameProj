// Do everything inside jquery function to make sure DOM loads first
$(function () {
  // VARIABLE DECLARATIONS

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

  function getData() {
    let requestLink = rawgURL + "genres" + rawgID;

    // console.log(requestLink);

    fetch(requestLink)
      .then(function (response) {
        if (response.ok) {
          //Data returns
          return response.json();
        } else if (response.status === 404) {
          //404 error
        }
      })
      .then(function (data) {
        // console.log(data);
      });
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
    // Declare variable with all concatenated queries
    let queries =
      "games" +
      rawgID +
      "&search_precise=true" +
      "&search_exact=true" +
      "&exclude_additions=true" +
      "&ordering=-metacritic" +
      "&exclude_collection=true" +
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
      console.log(results);
      // Make input lowercase for comparison
      var namesLower = element.toLowerCase();
      // Declare results variable to reduce dot notation
      var results = data.results;
      // for loop to compare results against user input
      for (var i = 0; i < results.length; i++) {
        var dataGenres = results[i].genres;
        var resultsLower = results[i].name.toLowerCase();
        // Limit search to game titles including user input and a metacritic score
        // consider adding this or similar for narrower results  -> && results[j].suggestions_count > 600
        if (
          resultsLower.includes(namesLower) &&
          results[i].metacritic &&
          results[i].suggestions_count > 600
        ) {
          // Nested loop finds each genre if game has more than one listed
          for (const key of dataGenres) {
            // Push genres of top matches to genres array by id
            genres.push(key.name);
            // console.log(key.id);
            // console.log(key.name);
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
  }
  // Create function for searching by genre
  function searchGenre(aGenre) {
    // Convert searches to lowercase to pull up results
    aGenre = aGenre.toLowerCase();
    // If input is RPG search by genre id to pull up results
    if (aGenre === "rpg") {
      // RPG id
      aGenre = 5;
    }
    // Declare variable to store api queries
    var genreSearchQuery =
      "games" +
      rawgID +
      "&ordering=-metacritic" +
      "&genres=" +
      aGenre +
      "&exclude_additions=true";

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
  function renderGenreList(data) {
    let genreList = $(".genre-list");

    //Reveals all the cards
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

  // EVENT LISTENERS

  // LIA - Use this in your event listener when I'm done with the genreSearch function

  // For each genre pulled from the favorite games
  for (const element of genres) {
    searchGenre(element);
    console.log(element);
  }

  // EVENT LISTENERS

  // LIA - Use this in your event listener when I'm done with the genreSearch function

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
  //     searchGenre()
  // };

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

  //genre button event listener to display games based on the api genre data
  $(".dropdown-item").on("click", function (event) {
    event.stopPropagation();
    $("#main").addClass("hide");
    $("#games-list").removeClass("hide");

    // FUNCTION CALLS

    getData();
    createGenreList();
    // findMatches();
    renderCurrentTopGame();

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
    searchGenre("world of warcraft");

    //input = whatever number they choose from dropdown
    // var listLimit = $('input')
    // for (var i = 0; i < listLimit; i++) {

    //     searchGenre()
    // };
  });

  // EVENT LISTENERS

  $("#game-finder").on("click", function (event) {
    event.stopPropagation();
    event.preventDefault();
    // Declare variable for user input
    var userFavorites = [
      $("#input-1").val(),
      $("#input-2").val(),
      $("#input-3").val(),
    ];

    findMatches(userFavorites);
  });

  // EVENT LISTENERS

  // FUNCTION CALLS

  getData();
  // findMatches();
  renderCurrentTopGame();

  // Push this down to keep code above the closing bracket/parenthesis
});
