var redis = require('redis');
var client = redis.createClient();
var shortid = require('shortid');


// client.keys('*', (err, values) => {
//     console.log(values)
// })

client.smembers('room:search:안녕', (err, values) => {
    console.log(values)
})


function sort(key) {
    //sort roomlist by score get # get *->title limit 0 5 desc

    client.sort(
        key,
        'BY',
        'room:*->created',
        'GET', '#',
        'GET', 'room:*->creator',
        'GET', 'room:*->title',
        'GET', 'room:*->tags',
        'GET', 'room:*->maxUser',
        'GET', 'room:*->users',
        'GET', 'room:*->created',
        'LIMIT',
        '0',
        '5',
        'DESC',
        function(err,values) {
            if (err) throw err;

            console.log(JSON.stringify(values,null,' '));

        }
    );
}

var cursor = '0';
var arr = [];

const _ = require('lodash')

function scan(q){
    client.hscan('room:title', cursor, 'MATCH', '*'+q+'*', 'COUNT', '10', function(err, reply){
        if(err){
            throw err;
        }
        cursor = reply[0];

        if(reply[1].length){
            for (let i = 0;i<reply[1].length;i++){
                if(i%2 === 1) arr.push(reply[1][i])
            }
            // arr.push(...reply[1])
        }
        // console.log(reply)
        if(cursor === '0'){
            console.log(arr)
            setKey(q, arr)
            client.quit();
            return console.log('Scan Complete');
        }else{
            // do your processing
            // reply[1] is an array of matched keys.
            // console.log(reply[1]);
            return scan();
        }
    });
}


// sort()
// scan('반가')

function setKey(q, arr) {


    client.sadd('room:search:'+q, arr)

    sort('room:search:'+q)
}