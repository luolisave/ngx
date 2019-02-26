<?php
/*
<!--
@Author: Li Luo
@Date:   2016-11-04T15:52:36-04:00
# @Last modified by:   Li Luo
# @Last modified time: 2017-01-18T10:58:53-05:00
-->
//*/
	// getsetmsg.php is for store small amount of data in sqlite only
	// will run when !empty($_GET["setmsg"]) && !empty($_GET["getmsg"])
	if($_GET["stype"] == "ss" || $_GET["stype"] == "simplestore" || $_GET["stype"] == "simple_store"){
		include "getsetmsg.php";
		exit();
	}

	if($_GET["stype"] == "sqlite"){
		$rs = $db->from('note')->where("hash = '$hash' AND username = '$username' AND status='1'")->find();

		if(empty($rs)){
			echo '{"status":0, "info":"DB record not found!"}';
			exit();
		}

		if(!empty($rs) && !empty($rs["data"])){
			if($_GET["ctype"] == 'raw'){
				$rv = base64_decode($rs["data"]);
				echo $rv;
			}else{
				$rv = base64_decode($rs["data"]);
				$tmpData = json_decode($rv, true);
				if($tmpData == false){
					// if not json, return in raw
					echo $rv;
					exit();
				}
				$rv = array(
					"status" => 1,
					"info" => "retrived successfully",
					"version" => VERSION,

					"hash" => $rs["hash"],
					"username" => $rs["username"],
					"update_date" => $rs["update_date"],
					"update_time" => $rs["update_time"],
					"type" => $rs["type"],
					"data" => $tmpData,
				);
				echo json_encode($rv);
			}
		}
	}else if($_GET["stype"] == "file"){
		$fileContent = @file_get_contents('./datastore/'.$username.'/'.$hash);
		if($_GET["ctype"] == 'raw'){
			if($fileContent){
				echo $fileContent;
			}else{
				http_response_code(404);
				echo "File not found!";
			}
		}else{
			if($fileContent){

				if($_GET["ctype"] == 'raw'){
					$rv = $fileContent;
				}else{
					$tmpData = json_decode($fileContent, true);
					if($tmpData == false){
						// if not json, return in raw
						echo $fileContent;
						exit();
					}
					$rv = array(
						"status" => 1,
						"info" => "retrived successfully",
						"data" => $tmpData
					);
				}
				echo json_encode($rv);

				//
			}else{
				http_response_code(404);
				echo '{"status":0, "info":"File not found!"}';
			}
		}
	}
