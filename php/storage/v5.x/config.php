<?php
/*
<!--
@Author: Li Luo
@Date:   2016-11-04T16:11:10-04:00
@Last modified by:   Li Luo
@Last modified time: 2016-11-07T14:29:41-05:00
@api url: http://api.lluo.dev/storage/v2/get.php
@api url: http://api.lluo.dev/storage/v2/set.php
-->
*/
date_default_timezone_set('America/Toronto');

// 1. golbal constants
define("VERSION", "5.0.0");
define("PASS_CODE", "passcode");
//Database //sqlite:
define("DB_DSN", "sqlite:datastore/ndata.sqlite"); //mysql:host=localhost;dbname=test; //sqlite:ndata.sqlite //sudo apt-get install php5-sqlite
define("DB_USERNAME", "");
define("DB_PASSWORD", "");


// 2. set sqlite as default
if(empty($_GET["stype"])){
  $_GET["stype"] = "sqlite";
}
if(empty($_GET["ctype"])){
  $_GET["ctype"] = "json";
}



$db = new Database(DB_DSN, DB_USERNAME, DB_PASSWORD);
