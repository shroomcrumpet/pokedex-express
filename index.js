
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

            return `This is ${pokes[i].name}, it is number ${pokes[i].num} in the Pokedex. Its height and weight are ${pokes[i].height} and ${pokes[i].weight} respectively. It also has ${pokes[i].type.length} elemental type(s) and ${pokes[i].weaknesses.length} elemental weakness(es)!`;
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


var handleRequest = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        if (request.path === '/') {
            response.send("Welcome to the online Pokdex!");
        } else {

            result = searchByName(obj, stripSlashes(request.path));

            if (result === 'notFound') {

                response.status (404);
                response.send (`Could not find information about ${stripSlashes(request.path).toUpperCase()} - Is that a new pokemon? Gotta catch em' all!`);
            }

            else {response.send(result);};

        };
    });
};


var handleRequestType = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        if (request.path === '/type/') {
            response.send("Extend the URL to search by specific types e.g. */type/fire to search for all Fire Pokemon");
        } else {

            result = searchByType(obj, stripSlashes(request.path).substr(5));

            if (result === 'notFound') {

                response.status (404);
                response.send (`Could not find any ${capFirstLetter(stripSlashes(request.path).substr(5).toLowerCase())} Pokemon - Is that a new type? Gotta catch em' all!`);
            }

            else {response.send(result);};

        };
    });
};


var handleRequestWeak = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        if (request.path === '/weaknesses/') {
            response.send("Extend the URL to search by specific weakness types e.g. */weaknesses/fire to search for all Pokemon weak to fire");
        } else {

            result = searchByWeakness(obj, stripSlashes(request.path).substr(11));

            if (result === 'notFound') {

                response.status (404);
                response.send (`Could not find any Pokemon weak to ${capFirstLetter(stripSlashes(request.path).substr(11).toLowerCase())} - Is that a new type? Gotta catch em' all!`);
            }

            else {response.send(result);};

        };
    });
};


var handleRequestEvo = (request, response) => {

    console.log("Handling response now...");
    console.log("Request path: " + request.path);

    let result;

    jsonfile.readFile(file, (err, obj) => {

        if (err) {console.log(err)};

        if (request.path === '/prevevolution/') {
            response.send("Extend the URL to search previous evolutions e.g. */prevevolution/charizard to search for all of Charizard's previous evolutions");
        } else {

            result = searchPrevEvo(obj, stripSlashes(request.path).substr(14));

            if (result === 'noPrevEvo') {

                response.status (404);
                response.send (`${capFirstLetter(stripSlashes(request.path).substr(14).toLowerCase())} has no previous evolutions!`);

            } else if (result === 'noSuchPoke') {

                response.status (404);
                response.send (`Could not find information about ${capFirstLetter(stripSlashes(request.path).substr(14).toLowerCase())} - Is that a new Pokemon? Gotta catch em' all!`);

            }

            else {response.send(result);};

        };
    });
};


app.get('/type/*', handleRequestType );
app.get('/weaknesses/*', handleRequestWeak );
app.get('/prevevolution/*', handleRequestEvo );
app.get('*', handleRequest );

app.listen(PORT_NUMBER, () => console.log('~~~ Tuning in to the waves of port 3001 ~~~'));



// ### Further

// Handle the case where an invalid pokemon name is provided (eg. `/some-name`).
// Return a message that says "Could not find information about `<pokemon_name>` - Is that a new pokemon? Gotta catch em' all!"
// (replace `<pokemon_name>` with the requested for pokemon name) Set the status code to 404.

// ### Further

// Detect if the user didn't put anthing in the path. Return a message saying "Welcome to the online Pokdex!"

// Instead of showing just the weight, show all the details of the requested pokemon for `/some-name` route, in a full sentence.
// i.e., "This is Bulbasaur, he is 45kg in weight! He also..." etc., etc.

// Expose a new route for `/type/some-type` that returns a message listing the names of all pokemon
// that have the specified type (eg. `/type/grass` should show a page with names of all pokemon of grass type).

// Expose a new route for `/weaknesses/some-weakness` that returns a message listing the names of all pokemon
// that have the specified weakness (eg. `/weakness/rock`).

// Expose a new route for `/nextevolution/some-name` that returns a message listing the names of all pokemon
// that the pokemon evolves *from* (eg. `/nextevolution/charizard`).







