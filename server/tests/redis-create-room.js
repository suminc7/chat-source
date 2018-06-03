var redis = require('redis');
var client = redis.createClient();
var shortid = require('shortid');


function createHashRooms(){

    var zroomlist = []
    var zroomtitle = []

    // for(var i = 1;i< 500;i++){

        const id = shortid.generate()
        const title = '안녕'+i+'하세요.'
        const created = new Date().getTime()

        const data = {
            'id': id,
            'creator': 'user'+Math.floor(5 + Math.random() * 10),
            'title': title,
            'maxUser': Math.floor(5 + Math.random() * 10),
            'created': created
        }

        client.hmset('room:'+id, data); // 2


        zroomlist.push(created, 'roomlist:'+i)
        zroomtitle.push('roomtitle:'+i+':'+title)
    // }

    client.zadd('roomlist', zroomlist)
    client.sadd('roomtitle', zroomtitle)

    client.hgetall('roomlist:1', (err, reply) => {
        console.log('hmget', reply)
    })
    client.hgetall('roomlist:2', (err, reply) => {
        console.log('hmget', reply)
    })

    client.quit();
}

// sort()
// scan(); //call scan function
createHashRooms()