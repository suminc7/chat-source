const slack = require('slack');
const env = require('node-env-file');
const os = require('os');


env(__dirname + '/../.env');


exports.websocket = function() {
    console.log('NODE_ENV:', process.env.NODE_ENV)
    if(process.env.NODE_ENV === 'production'){
        slack.chat.postMessage({
            token: process.env.SLACK_TOKEN,
            channel: '#general',
            text: `websocket server listening on : \`8080\`, running on node *$${process.version}*\nhostname: \`${os.hostname()}\``
        })
    }

}

exports.dockerBuild = function() {
    slack.chat.postMessage({
        token: process.env.SLACK_TOKEN,
        channel: '#general',
        text: `build Dockerfile`
    })
}