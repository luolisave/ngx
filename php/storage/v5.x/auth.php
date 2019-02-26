<?php
/*
<!--
@Author: Li Luo
@Date:   2016-11-04T15:52:36-04:00
@Last modified by:   Li Luo
@Last modified time: 2016-11-07T14:06:45-05:00
-->
//*/

$passcode = !empty($_GET['passcode'])?$_GET['passcode']:'';
$hash = empty($_GET['hash'])? '': $_GET['hash'];
$username = empty($_GET['username'])?'':$_GET['username'];

if(!empty($passcode)){
  if($passcode == PASS_CODE){
    //continue
  }else{
    echo '{"status":0, "info":"invalid passcode."}';
    exit();
  }
}else{
  echo '{"status":0, "info":"please provide passcode."}';
  exit();
}

if(empty($hash)){
  echo '{"status":0, "info":"please provide hash!"}';
  exit();
}

if(empty($username)){
  echo '{"status":0, "info":"Please provide username(gmail address etc.)"}';
  exit();
}
