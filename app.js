var redis = require("redis")
    , Scheduler = require('redis-scheduler')
    , request = require('request')
    , winston = require('winston')
    , subscriber = redis.createClient()
    , queue  = new Scheduler({ host: 'localhost', port: 6379, db: 0 })
    , logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({level: 'debug'}),
            new (winston.transports.File)({ filename: 'app.log', level: 'info' })
        ]
    });

function trigger(err, key)
{
    var data = JSON.parse(key);
    logger.debug(data);

    if(!data.hasOwnProperty('url')) {
        return logger.error('`url` is required');
    }
    if(!data.hasOwnProperty('params')) {
        return logger.error('`params` is required');
    }

    var url    = data.url;
    var params = data.params;

    request.post(url, function(err, res, body) {
        if(err) {
            return logger.error('Trigger failed: ' + err);
        }
        logger.info(body);
    }).form(params);
}

subscriber.on("message", function(channel, message) {
    var data = JSON.parse(message);
    if(!data.hasOwnProperty('expire')) {
        return logger.error('`expire` is required');
    }
    var delay = {key: message, expire: parseInt(data.expire), handler: trigger};
    queue.schedule(delay, function(err){
        logger.debug("matched be scheduled to calculate versus at the time.");
    });
    logger.info(data);
});

subscriber.subscribe("match-schedule");
logger.info('Start to listen `match-schedule` queue...');