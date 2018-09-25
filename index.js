
const express = require('express');
const app = express();

const jsonfile = require('jsonfile');
const file = 'pokedex.json'
const PORT_NUMBER = 3001;


var capFirstLetter = (string) => {

    return string.charAt(0).toUpperCase() + string.substr(1);
};



var stripSlashes = (string) => {

    if (string.charAt(0) === "/") string = string.substr(1);
    if (string.charAt(string.length - 1) === "/") string = string.substr(0, string.length - 1);
    return string;
};


var searchByName = (object, pokeName) => {

    const pokes = object.pokemon

    for (i in pokes) {

        if (pokes[i].name.toLowerCase() === pokeName.toLowerCase()) {

            let html = "";

            html += `<html><body><h1>${pokes[i].name}</h1>`;
            html += `<img src = '${pokes[i].img}'>`;
            html += `<h2>Pokedex ID number: ${pokes[i].num}</h2>`;
            html += `<h2>Height: ${pokes[i].height}</h2>`;
            html += `<h2>Weight: ${pokes[i].weight}</h2>`;
            html += `<h2>Type(s): ${pokes[i].type}</h2>`;
            html += `<h2>Weakness(es): ${pokes[i].weaknesses}</h2>`;
            html += `</body></html>`;

            return html;
        };
    };

    return 'notFound';
};


var searchByType = (object, pokeType) => {

    const pokes = object.pokemon
    const resultTypes = [];

    for (i in pokes) {

        if (pokes[i].type.includes(capFirstLetter(pokeType.toLowerCase()))) {

            resultTypes.push(pokes[i].name);
        };
    };

    if (resultTypes.length === 0) {return 'notFound';}
    else return resultTypes;
};


var searchByWeakness = (object, pokeWeakness) => {

    const pokes = object.pokemon
    const resultWeak = [];

    for (i in pokes) {

        if (pokes[i].weaknesses.includes(capFirstLetter(pokeWeakness.toLowerCase()))) {

            resultWeak.push(pokes[i].name);
        };
    };

    if (resultWeak.length === 0) {return 'notFound';}
    else return resultWeak;
};


var searchPrevEvo = (object, pokeName) => {

    const pokes = object.pokemon

    for (i in pokes) {

        if (pokes[i].name.toLowerCase() === pokeName.toLowerCase()) {

            if (pokes[i].prev_evolution) {
                return pokes[i].prev_evolution;

            } else return 'noPrevEvo';

        };
    };

    return 'noSuchPoke';
};


var handleRequestName = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting name = ${request.params.name}`)

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        result = searchByName(obj, request.params.name);

        if (result === 'notFound') {

            response.status (404);
            response.send (`Could not find information about ${request.params.name.toUpperCase()} - Is that a new pokemon? Gotta catch em' all!`);
        }

        else {response.send(result);};

    });
};


var handleRequestType = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path)
    console.log(`Requesting type = ${request.params.type}`);

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        if (request.path === '/type/') {
            response.send("Extend the URL to search by specific types e.g. */type/fire to search for all Fire Pokemon");
        } else {

            result = searchByType(obj, request.params.type);

            if (result === 'notFound') {

                response.status (404);
                response.send (`Could not find any ${capFirstLetter(request.params.type.toLowerCase())} Pokemon - Is that a new type? Gotta catch em' all!`);
            }

            else {response.send(result);};

        };
    });
};


var handleRequestWeak = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting weaknesses for ${request.params.weaknesses}`)

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        if (request.path === '/weaknesses/') {
            response.send("Extend the URL to search by specific weakness types e.g. */weaknesses/fire to search for all Pokemon weak to fire");
        } else {

            result = searchByWeakness(obj, request.params.weaknesses);

            if (result === 'notFound') {

                response.status (404);
                response.send (`Could not find any Pokemon weak to ${capFirstLetter(request.params.weaknesses.toLowerCase())} - Is that a new type? Gotta catch em' all!`);
            }

            else {response.send(result);};

        };
    });
};


var handleRequestEvo = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);
    console.log(`Requesting previous evolutions for ${request.params.prevevos}`);

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        if (request.path === '/prevevolution/') {
            response.send("Extend the URL to search previous evolutions e.g. */prevevolution/charizard to search for all of Charizard's previous evolutions");
        } else {

            result = searchPrevEvo(obj, request.params.prevevos);

            if (result === 'noPrevEvo') {

                response.status (404);
                response.send (`${capFirstLetter(request.params.prevevos.toLowerCase())} has no previous evolutions!`);

            } else if (result === 'noSuchPoke') {

                response.status (404);
                response.send (`Could not find information about ${capFirstLetter(request.params.prevevos.toLowerCase())} - Is that a new Pokemon? Gotta catch em' all!`);

            }

            else {response.send(result);};

        };
    });
};


app.get('/type/:type', handleRequestType );
app.get('/weaknesses/:weaknesses', handleRequestWeak );
app.get('/prevevolution/:prevevos', handleRequestEvo );
app.get('/:name', handleRequestName );
app.get('/', (request, response) => {response.send("Welcome to the online Pokdex!");} );

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
// that is more or less than the given number. Example: /search/spawn_chance?amount=1&compare=less will send back a formatted HTML page with a list of every pokemon with a spawn change less than 1. Example 2: /search/avg_spawn?amount=0.8&compare=more

// Further
// Create the same routes for: height, weight and spawn_time.





