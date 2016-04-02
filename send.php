<?php
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$msg = [
	'match_id' => '123', 
	'expire' => '2000', 
	'handler' => 'output',
	'url' => 'http://stage.goin.la',
	'params' => ['match_id' => '123', 'key1' => 'val1'],
	'message' => 'message come from php'
];

$redis->publish('match-schedule', json_encode($msg));
