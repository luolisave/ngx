<?php
/*
<!--
@Author: Li Luo
@Date:   2016-11-04T15:52:36-04:00
@Last modified by:   Li Luo
@Last modified time: 2016-11-07T16:05:30-05:00
-->
//*/

// 1. get data from client
$fileContent = file_get_contents("php://input");
$args = json_decode($fileContent, true);



// 3. save thing to database
if($_GET["stype"] == "sqlite"){
	$tmpData = base64_encode($fileContent);
	//$tmpData = urlencode($fileContent);
	$array = array(
			"hash" => $hash,
			"username" => $username,
			"update_date" => date("Y-m-d H:i:s"),
			"update_time" => time(),
			"status" => "1",
			"type" => empty($_GET['type'])?'unkown':$_GET['type'],
			"meta" => empty($args["meta"])?"":$args["meta"],
			"data" => $tmpData,
	);

	$rs = $db->from("note")->where("hash = '$hash' AND username = '$username' AND  status='1'")->find();
	if(empty($rs)){ // if record hash(row) does exist, go create
		$db->from("note")->add($array);
		echo '{"status":1, "info":"data created to db.", "version" : "'.VERSION.'"}';
	}else{
		$db->from("note")->where("hash = '$hash' AND username = '$username' AND status='1'")->update($array);
		echo '{"status":1, "info":"data updated to db.", "version" : "'.VERSION.'"}';
	}
	//echo $db->last_sql;
}else if($_GET["stype"] == "file"){
	// save file to ./datastore folder, filename same as hash.
	$dir = './datastore/'.$username.'/';
	if (!is_dir($dir)) {
	  // dir doesn't exist, make it
	  mkdir($dir);
	}
	if(file_put_contents('./datastore/'.$username.'/'.$hash, $fileContent)){
		echo '{"status":1, "info":"data saved to file."}';
	}else{
		echo '{"status":0, "info":"file save error."}';
	}
}else{
	echo '{"status":0, "info":"undefined store type."}';
}
?>
