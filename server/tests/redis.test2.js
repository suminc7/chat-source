var redis = require('redis');
var client = redis.createClient();
var shortid = require('shortid');


var cursor = '0';
var arr = [];




function getHash() {
    // client.smembers('myrooms:21', function(err, reply){
    //     console.log(reply)
    // })
}


function scan(){
    client.zscan('roomlist', cursor, 'MATCH', '*:안녕12*', 'COUNT', '10', function(err, reply){
        if(err){
            throw err;
        }
        cursor = reply[0];

        if(reply[1].length){
            arr.push(...reply[1])
        }
        console.log(reply)
        if(cursor === '0'){
            console.log(arr)
            getHash()
            return console.log('Scan Complete');
        }else{
            // do your processing
            // reply[1] is an array of matched keys.
            // console.log(reply[1]);
            return scan();
        }
    });
}

function sort() {
    //sort roomlist by score get # get *->title limit 0 5 desc

    client.sort(
        'roomlist',
        'BY',
        'score',
        'GET',
        '#',
        'GET',
        '*->title',
        'LIMIT',
        '0',
        '5',
        'DESC',
        function(err,values) {
            if (err) throw err;

            console.log(JSON.stringify(values,null,' '));
            client.quit();
        }
    );
}

function createKeys(){
    for(var i = 1;i< 500;i++){
        client.sadd('myrooms:'+i, 'user'+i); // 2
    }

    client.quit();
}

function createHashRooms(){

    var zroomlist = []
    var zroomtitle = []

    for(var i = 1;i< 500;i++){

        const id = shortid.generate()
        const title = '안녕'+i+'하세요.'
        const created = i

        const data = {
            'id': id,
            'creator': 'user'+i,
            'title': title,
            'maxUser': Math.floor(5 + Math.random() * 10),
            'created': created
        }

        client.hmset('roomlist:'+i, data); // 2


        zroomlist.push(created, 'roomlist:'+i)
        zroomtitle.push(created, 'roomtitle:'+i)
    }

    client.zadd('roomlist', zroomlist)
    client.zadd('roomtitle', zroomtitle)

    client.hgetall('roomlist:1', (err, reply) => {
        console.log('hmget', reply)
    })
    client.hgetall('roomlist:2', (err, reply) => {
        console.log('hmget', reply)
    })

    client.quit();
}

sort()
// scan(); //call scan function
// createHashRooms()