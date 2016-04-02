Scheduler queue
====

The scheduler queue is based on [new version of Redis 2.8+](https://redis.io) provide feature called expire event of key notification. Written in NodeJS.

Preparation
===

1. Install `Redis 2.8+`  
1. Enabling keyspace notification by either setting `notifiy-keyspace-events Ex` in redis configuration file.

Installation
===

    git clone and run npm install


Usage
===

There is only one way to talk with it, using `Redis Channel`. Such like below:

```php

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$option = [
	'expire' => '2000', 
	'url' => 'URL_YOU_WANT_TO_TRIGGER',
	'params' => ['match_id' => '123', 'key1' => 'val1']
];

$redis->publish('match-schedule', json_encode($option));

```

* option
    * expire (integer) - million second.
    * url (string) - A whole URL what you want to trigger at time.
    * params (array) - act as parameters when call callback URL.
    
> [NOTE] The `$option` must be a valid JSON string. 