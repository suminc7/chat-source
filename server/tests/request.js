const axios = require('axios')


exports.roomList = function() {


    return axios.get('/api/room/list?page='+1)
        .then((response) => {
            const id = response.data.rooms[0]
            console.log(id)
        })
        .catch((error) => {
            console.log(error.response.data);
        });
}

exports.userList = function(id) {


    return axios.get(`/api/room/${id}/users`)
        .then((response) => {
            // const id = response.data.rooms[0]
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error.response.data);
        });
}