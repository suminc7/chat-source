const config = require('../config');
const redis = require('redis');
// Redis
const client = redis.createClient(config.redis);
client.on('error', redisError);

function redisError(err) {
    throw new Error('Redis error ' + err);
}

module.exports = client

// key list

// room:list                            zsets   - room list 조회용 키
// room:title                           sets    -  room search를 위한 키
// room:HkLmLkAQM                       hashes  - 룸 정보
// users:HkLmLkAQM                      sets    - 룸안의 유저 리스트


// users                                hashes  - 접속된 모든 유저 목록
// user:5a34f0b25943855b7460e36d        hashes  - 유저정보 저장