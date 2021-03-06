
const express = require('express');
const app = express();

const jsonfile = require('jsonfile');
const file = 'pokedex.json'
const PORT_NUMBER = 3001;


var capFirstLetter = (string) => {

    return string.charAt(0).toUpperCase() + string.substr(1);
};


// var stripSlashes = (string) => {

//     if (string.charAt(0) === "/") string = string.substr(1);
//     if (string.charAt(string.length - 1) === "/") string = string.substr(0, string.length - 1);
//     return string;
// };


var handleRequestRoot = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting Pokedex root`)

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        let html = "";

        html += `<html><body style="margin:5vw;"><h1>Welcome to the online Pokedex!</h1><h3 style="color:red;">Pokemon:</h3>`;

        for (i in obj.pokemon) {

            html += `<a href = "/${obj.pokemon[i].name}">${parseInt(i)+1}. ${obj.pokemon[i].name}</a><br>`;
        };

        html += `</body></html>`;

        response.send(html);
    });
};


var handleRequestName = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting name = ${request.params.name}`)

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        const pokes = obj.pokemon
        const pokeName = request.params.name

        for (i in pokes) {

            if (pokes[i].name.toLowerCase() === pokeName.toLowerCase()) {

                let html = "";

                html += `<html><body style="margin:5vw;"><h1>${pokes[i].name}</h1>`;
                html += `<img src = '${pokes[i].img}'>`;
                html += `<h2>Pokedex ID number: <span style="color:red;">${pokes[i].num}</span></h2>`;
                html += `<h2>Height: ${pokes[i].height}</h2>`;
                html += `<h2>Weight: ${pokes[i].weight}</h2>`;

                if (pokes[i].type.length > 1) {

                    html += '<h2>Types:</h2>'
                    pokes[i].type.forEach( function(elem) {
                        html += `<ul style="color:blue;">${elem}</ul>`;
                    });

                } else {html += `<h2>Type: ${pokes[i].type}</h2>`;};

                if (pokes[i].weaknesses.length > 1) {

                    html += '<h2>Weaknesses:</h2>'
                    pokes[i].weaknesses.forEach( function(elem) {
                        html += `<ul style="color:blue;">${elem}</ul>`;
                    });

                } else {html += `<h2>Weakness: ${pokes[i].weaknesses}</h2>`;};

                html += `</body></html>`;

                return response.send(html);

            };
        };

        response.status (302);
        response.redirect ('/');
        // response.send (`<html><body><h1 style="margin:5vw;">Could not find information about ${request.params.name.toUpperCase()} - Is that a new pokemon? Gotta catch em' all!</h1></body></html>`);
    });
};


var handleRequestType = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path)
    console.log(`Requesting all Pokemon with type = ${request.params.type}`);

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        const pokes = obj.pokemon
        const pokeType = request.params.type;

        const resultTypes = [];

        for (i in pokes) {

            if (pokes[i].type.includes(capFirstLetter(pokeType.toLowerCase()))) {

                resultTypes.push(pokes[i].name);
            };
        };

        if (resultTypes.length === 0) {

            response.status (302);
            response.redirect ('/');
        }

        else {response.send(resultTypes);};
    });
};


var handleRequestWeak = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting all Pokemon that are weak to ${request.params.weaknesses}`)

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        const pokes = obj.pokemon
        const pokeWeakness = request.params.weaknesses;

        const resultWeak = [];

        for (i in pokes) {

            if (pokes[i].weaknesses.includes(capFirstLetter(pokeWeakness.toLowerCase()))) {

                resultWeak.push(pokes[i].name);
            };
        };

        if (resultWeak.length === 0) {

            response.status (302);
            response.redirect ('/');
        }

        else {response.send(resultWeak);};
    });
};


var handleRequestEvo = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting previous evolutions for ${request.params.prevevos}`);

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        const pokes = obj.pokemon;
        const pokeName = request.params.prevevos;

        for (i in pokes) {

            if (pokes[i].name.toLowerCase() === pokeName.toLowerCase()) {

                if (pokes[i].prev_evolution) {

                    return response.send (pokes[i].prev_evolution);

                } else {return response.send (`${capFirstLetter(request.params.prevevos.toLowerCase())} has no previous evolutions!`);};
            };
        };

        response.status (302);
        response.redirect ('/');
    });
};


var handleRequestSearch = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting Pokemon with ${request.params.searchattribute} ${request.query.compare} than ${request.query.amount}...`);
    console.log(request.query);

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        const pokes = obj.pokemon;
        const attr = request.params.searchattribute;

        var operators = {
            'more': function(a, b) { return a > b },
            'less': function(a, b) { return a < b },
        };

        let html = "";
        html += `<html><body style="margin:5vw;"><h1>Pokedex Query</h1><h3 style="color:red;">Pokemon with ${request.params.searchattribute.replace('_', ' ')} ${request.query.compare} than ${request.query.amount}:</h3>`;

        for (i in pokes) {

            if (operators[request.query.compare] (parseFloat(pokes[i][request.params.searchattribute]), (request.query.amount))) {

                html += `<a href = "/${pokes[i].name}">${parseInt(i)+1}. ${pokes[i].name}</a><br>`;
            };
        };

        html += `</body></html>`;
        return response.send (html);
    });
};


app.get('/search/:searchattribute', handleRequestSearch);
app.get('/type/:type', handleRequestType );
app.get('/weaknesses/:weaknesses', handleRequestWeak );
app.get('/prevevolution/:prevevos', handleRequestEvo );
app.get('/:name', handleRequestName );
app.get('/', handleRequestRoot );

app.listen(PORT_NUMBER, () => console.log('~~~ Tuning in to the waves of port 3001 ~~~'));




// Pokedex part 2
// For each route type, create one app.get handler.
// In the response to the request, send back only HTML.
// format the HTML to output a nicely formatted page with each pokemon attribute.

// Further
// Use a ul element for each attribute in the pokemon that has more than one thing: i.e., type.
// create a page at the root route / that displays links to each pokemon's page.
// (hint: the html is created in a loop)

// Further
// If the user requests a pokemon or something that doesn't exist, redirect them back to the root URL.
// add CSS (right now, this has to be in a style tag in the HTML you send back)

// Further
// Create a route for each of these: spawn_chance, avg_spawns that will show each pokemon
// that is more or less than the given number. Example: /search/spawn_chance?amount=1&compare=less
// will send back a formatted HTML page with a list of every pokemon with a spawn chance less than 1.
// Example 2: /search/avg_spawns?amount=0.8&compare=more

// Further
// Create the same routes for: height, weight and spawn_time.


