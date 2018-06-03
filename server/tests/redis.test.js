


var redis = require('redis')
var client = redis.createClient()


var redredisearch = require('redredisearch')

redredisearch.setClient(client)

// redredisearch.createClient()

// var search = redredisearch.createSearch('pets',{}, function(err, search) {
//     /* ... */
// });

var strs = [];
strs.push('Tobi wants four dollars');
strs.push('Tobi only wants $4');
strs.push('Loki is really fat');
strs.push('Loki, Jane, and Tobi are ferrets');
strs.push('Manny is a cat');
strs.push('Luna is a cat');
strs.push('Mustachio is a cat');



var search = redredisearch.createSearch('pets',{}, function(err,search) {

    strs.forEach(function(str, i){ search.index(str, i); });
});

console.log(search)

search
    .query(query = 'Tobi dollars')
    .end(function(err, ids){
        if (err) throw err;
        console.log('Search results for "%s":', query);
        ids.forEach(function(id){
            console.log('  - %s', strs[id]);
        });
        process.exit();
    });