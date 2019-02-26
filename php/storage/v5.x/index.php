<?php
/*
<!--
@Author: Li Luo
@Version: 3.3.1
@Date:   2016-11-04T15:52:36-04:00
# @Last modified by:   Li Luo
# @Last modified time: 2017-03-17T14:30:41-04:00
-->
//*/
include 'database.php';
include 'config.php';


// match methods
if($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  header( "HTTP/1.1 200 OK" );
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  exit();
}else if($_SERVER['REQUEST_METHOD'] == 'POST'){
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	include 'auth.php';
    if(!empty($_GET['upload'])){
        include 'upload.php'; //upload files
        exit();
    }else if(!empty($_GET['email'])){
        include 'email.php'; //upload files
        exit();
    }else{
        include 'post.php';
        exit();
    }
}else if($_SERVER['REQUEST_METHOD'] == 'GET'){
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	include 'auth.php';
    if(!empty($_GET['upload'])){
        include 'upload.php';
        exit();
    }else{
        include 'get.php';
        exit();
    }
}else if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
    include 'auth.php';
	include 'delete.php';
    exit();
}



// functions
