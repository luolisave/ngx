<?php
# @Author: Li Luo
# @Date:   2017-01-18T11:02:03-05:00
# @Last modified by:   Li Luo
# @Last modified time: 2017-01-18T14:52:56-05:00

//remove uploaded files
$upload_directory = 'datastore/'.$username.'/upload/'.$hash;
$dir = $upload_directory;
$it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
$files = new RecursiveIteratorIterator($it,
             RecursiveIteratorIterator::CHILD_FIRST);
foreach($files as $file) {
    if ($file->isDir()){
        rmdir($file->getRealPath());
    } else {
        unlink($file->getRealPath());
    }
}
rmdir($dir);



if($_GET["stype"] == "sqlite"){
    $rs = $db->from('note')->where("hash = '$hash' AND username = '$username' AND status='1'")->delete();
    if($rs == 1){
        echo '{"status":1, "info":"item deleted!"}';
    }else{
        echo '{"status":0, "info":"error on delete item."}';
    }
}else if($_GET["stype"] == "file"){
    @unlink ('./datastore/'.$username.'/'.$hash);
    echo '{"status":1, "info":"file deleted!"}';
}
