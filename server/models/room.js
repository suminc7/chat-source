const _ = require('lodash');
const shortid = require('shortid');
const client = require('../src/redis');
const io = require('../src/io').get();

exports.create = function({ creator, title, maxUser, tags }) {

    return new Promise((resolve, reject) => {
        const id = shortid.generate();
        const created = new Date().getTime();

        const data = {
            id,
            creator,
            title,
            tags,
            maxUser,
            users: 0,
            created
        };

        client.hmset('room:'+id, data);
        //sort
        client.zadd('room:list', created, id);
        //search
        client.sadd('room:title', id+':'+title);
        // client.hset('room:title', title, id);

        resolve(id)
    })
};

exports.list = function(page, key = 'room:list') {



    if(isNaN(Number(page))){
        page = 1
    }

    const pageCount = 5;
    const offset = (page-1) * pageCount;

    return new Promise((resolve, reject) => {
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
            'LIMIT', offset, pageCount,
            'DESC',
            (err, values) => {
                if (err) reject(err);
                const keys = ['id', 'creator', 'title', 'tags', 'maxUser', 'users', 'created'];
                const rooms = _.map(_.chunk(values, keys.length), arr => {
                    const obj = _.zipObject(keys, arr);
                    // obj.tags = obj.tags.split(',');
                    return obj;
                });
                resolve(rooms)



            }
        );
    })

};

exports.check = function(id){
    return new Promise((resolve, reject) => {
        client.hget('room:'+id, 'id', (err, value) => {
            if (err) throw new Error('hget failed');
            if(!value) reject(404);
            resolve(value)
        });
    })
};

// exports.users = function(id) {
//
//
//     return new Promise((resolve, reject) => {
//
//         if(io.sockets.adapter.rooms.hasOwnProperty(id)){
//             client.hmget('users', Object.keys(io.sockets.adapter.rooms[id].sockets), (err, values) => {
//                 if (err) throw new Error('users hmget failed');
//
//
//
//
//                 const users = values.length ? values : []
//                 client.sadd('room:users:'+id, users.toString())
//                 client.hset('room:'+id, 'users', users.toString());
//                 resolve(users)
//             })
//
//
//
//         }else{
//             resolve([])
//         }
//
//     })
//
// };




exports.userlist = function(page, key) {


    console.log('**********************         userlist', key);

    if(isNaN(Number(page))){
        page = 1
    }

    const pageCount = 5;
    const offset = (page-1) * pageCount;

    return new Promise((resolve, reject) => {
        client.sort(
            key,
            'BY',
            key,
            'GET', 'user:*->id',
            'GET', 'user:*->nickname',
            'LIMIT', offset, pageCount,
            'DESC',
            function(err,values) {
                if (err) reject(err);
                // resolve(values)


                const keys = ['id', 'nickname'];

                const rooms = _.map(_.chunk(values, keys.length), arr => {
                    return _.zipObject(keys, arr)
                });
                console.log('userlist', rooms);
                resolve(rooms)
            }
        );
    })

};

exports.join = function(id, userId) {


    const multi = client.multi();

    multi.sadd('users:'+id, userId);
    multi.hset('room:'+id, 'users', io.sockets.adapter.rooms[id].length);


    multi.exec(function (err, replies) {
        if (err) throw new Error('join sadd,hset failed');
    });

};

exports.updateUser = function(id) {

    client.hset('room:'+id, 'users', io.sockets.adapter.rooms[id].length);

};

exports.info = function(id) {

    return new Promise((resolve, reject) => {
        client.hgetall(`room:${id}`, (err, value) => {
            if (err) throw new Error('hgetall failed');
            if(!value) return reject(404);
            resolve(value)
        })
    });
};

exports.update = function(id, data) {
    return new Promise((resolve, reject) => {

         const getRoom = () => {
            return new Promise(resolve => {
                client.hmget('room:'+id, 'id', 'title', (err, value) => {
                    if (err) throw new Error('hmget failed', err);
                    if(!value) return reject(404);

                    resolve({ id, data, value })
                });
            })
        };

        const removeRoomTitle = ({ id, data, value }) => {
            return new Promise(resolve => {
                if(data.title) {
                    client.srem('room:title', value[0]+':'+value[1]);
                    client.sadd('room:title', `${id}:${data.title}`, (err, value) => {
                        if (err) throw new Error('sadd failed', err);
                        if(!value) return reject(404);
                        resolve(value)
                    });

                }else{
                    resolve()
                }
            })
        };

        const setRoom = () => {
            return new Promise(resolve => {
                data.tags = data.tags.toString();

                client.hmset('room:'+id, data, (err, value) => {
                    if (err) throw new Error('hmset failed', err);
                    if(!value) return reject(404);
                    resolve(id)
                });
            })
        };

        getRoom()
            .then(removeRoomTitle)
            .then(setRoom)
            .then(this.info)
            .then(data => {
                resolve(data)
            })
            .catch(err => {
                throw new Error(err);
            })


    });
};



exports.leave = function(id, userId) {
    if (io.sockets.adapter.rooms[id]) {
        console.log('leave', id, userId);
        this.updateUser(id);
        client.srem('users:'+id, userId)
    } else {
        client.hget('room:'+id, 'title', (err, title) => {
            if (err) throw new Error('hget failed');
            console.log('hget compleate', id, title);

            client.del('users:'+id, (err, value) => {
                if (err) throw new Error('hash delete failed');
                console.log('hash deleted', id, value)
            });

            client.del('room:'+id, (err, value) => {
                if (err) throw new Error('hash delete failed');
                console.log('hash deleted', id, value)
            });
            client.zrem('room:list', id, (err, value) => {
                if (err) throw new Error('zrem delete failed');
                console.log('zset deleted', id, value)
            });

            client.srem('room:title', id+':'+title, (err, value) => {
                if (err) throw new Error('srem delete failed');
                console.log('srem deleted', id, value)
            });
        })


    }

};

exports.search = function(page, q) {

    const findKey = () => {

        return new Promise((resolve, reject) => {
            client.smembers('room:search:'+q, (err, values) => {
                if (err) throw new Error('search smembers failed');
                console.log('findSetKey', values);
                // if(values.length) {
                    resolve(values)
                // } else {
                //     scanKey()
                // }
            })

        })
    };

    const scanKey = (values) => {
        console.log('scanKey', values);

        return new Promise((resolve, reject) => {
            console.log('scanKey1', values.length);

            let cursor = '0';
            const arr = [];

            function scan() {

                client.sscan('room:title', cursor, 'MATCH', '*' + q + '*', 'COUNT', '10', function(err, reply){
                    if (err) throw new Error('search sscan failed');

                    cursor = reply[0];
                    const searchedValue = reply[1];

                    if(searchedValue.length){
                        for (let i = 0;i<searchedValue.length;i++){
                            arr.push(searchedValue[i].split(':')[0])
                        }
                        // arr.push(...reply[1])
                    }
                    // console.log(reply)
                    if(cursor === '0'){
                        if(arr.length){
                            // setKey(q, arr)
                            const searchkey = 'room:search:'+q;
                            client.sadd(searchkey, arr, (err, values) => {
                                if (err) throw new Error('search sadd failed');

                                client.expire(searchkey, 10, () => {
                                    resolve(values)
                                })

                            })
                        }else{
                            resolve(null)
                        }

                    }else{
                        // do your processing
                        // reply[1] is an array of matched keys.
                        // console.log(reply[1]);
                        return scan();
                    }
                });

            }
            scan()

        });
    };

    const listKey = () => {
        return this.list(page, 'room:search:'+q)
    };

    return findKey()
        .then(values => {
            if(values.length) {
                console.log('values', values);
                return values
            } else {
                return scanKey(values)
            }
        })
        .then(listKey)
};