var apiURL = "https://api.rawg.io/api/";
var apiID = "?key=ad61e1d9ed3844018c1885a37313c3e9";

getData();

function getData()
{
    let requestLink = apiURL + "genres" + apiID;

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