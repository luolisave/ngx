<?php
/*
<!--
@Author: Li Luo
@Date:   2016-11-18T12:16:36-04:00
@Last modified by:   Li Luo
@Last modified time: 2016-11-18T12:16:36-04:00
-->
//*/

// simple store
// store simple message by using GET method.


if(!empty($_GET["setmsg"])){

    $tmpData = urldecode($_GET["setmsg"]);
    $tmpData = base64_encode($tmpData);
    //$tmpData = urlencode($fileContent);
    $array = array(
            "hash" => $hash,
            "username" => $username,
            "update_date" => date("Y-m-d H:i:s"),
            "update_time" => time(),
            "status" => "1",
            "type" => empty($_GET['type'])?'simple_store':$_GET['type'],
            "meta" => empty($args["meta"])?"":$args["meta"],
            "data" => $tmpData,
    );

    $rs = $db->from("note")->where("hash = '$hash' AND username = '$username' AND  status='1'")->find();
    if(empty($rs)){ // if record hash(row) does exist, go create
        $db->from("note")->add($array);
        if($_GET["ctype"] == 'raw'){
            header('Content-Type: text/plain');
            echo 'putmsg: data created to db successfully';
        }else{
            echo '{"status":1, "info":"putmsg: data created to db successfully.", "version" : "'.VERSION.'"}';
        }
    }else{
        $db->from("note")->where("hash = '$hash' AND username = '$username' AND status='1'")->update($array);
        if($_GET["ctype"] == 'raw'){
            header('Content-Type: text/plain');
            echo 'putmsg: data updated to db successfully.';
        }else{
            echo '{"status":1, "info":"putmsg: data updated to db successfully.", "version" : "'.VERSION.'"}';
        }
    }
    //echo $db->last_sql;
    
}else if(!empty($_GET["getmsg"])){
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
            if(json_decode(base64_decode($rs["data"]), true)){
                $tmpData = json_decode(base64_decode($rs["data"]), true);
            }else{
                $tmpData = base64_decode($rs["data"]);
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
}