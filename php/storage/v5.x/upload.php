<?php
# @Author: Li Luo
# @Date:   2017-01-18T11:38:03-05:00
# @Last modified by:   Li Luo
# @Last modified time: 2017-03-17T14:20:57-04:00

function url_origin( $s, $use_forwarded_host = false )
{
    $ssl      = ( ! empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on' );
    $sp       = strtolower( $s['SERVER_PROTOCOL'] );
    $protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
    $port     = $s['SERVER_PORT'];
    $port     = ( ( ! $ssl && $port=='80' ) || ( $ssl && $port=='443' ) ) ? '' : ':'.$port;
    $host     = ( $use_forwarded_host && isset( $s['HTTP_X_FORWARDED_HOST'] ) ) ? $s['HTTP_X_FORWARDED_HOST'] : ( isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : null );
    $host     = isset( $host ) ? $host : $s['SERVER_NAME'] . $port;
    return $protocol . '://' . $host;
}

function full_url( $s, $use_forwarded_host = false )
{
    return url_origin( $s, $use_forwarded_host ) . $s['REQUEST_URI'];
}

//$absolute_url = full_url( $_SERVER );
//echo $absolute_url;
//$my_url = substr( $absolute_url, 0, strrpos( $absolute_url, "?"));
//echo $my_url;
//echo '<br>';


if($_POST){
    // Check if image file is a actual image or fake image
        //make directory if not exist
        if(empty($username) || empty($hash)){
            exit('{"status":0,"info":"please provide username and hash."}');
        }
        $upload_directory = 'datastore/'.$username.'/upload/'.$hash;
        if (!file_exists($upload_directory)) {
            mkdir($upload_directory, 0777, true);
        }

        //copy files to Directory
        //var_dump($_FILES);
        if (!copy($_FILES["fileToUpload"]['tmp_name'], $upload_directory.'/'.$_FILES["fileToUpload"]['name'])) {
            echo "failed to copy $file...\n";
        }

        //find image url
        $absolute_url = full_url( $_SERVER );
        $my_url = substr( $absolute_url, 0, strrpos( $absolute_url, "?"));
        $my_path = $upload_directory.'/'.$_FILES["fileToUpload"]['name'];
        //echo $upload_directory.'/'.$_FILES["fileToUpload"]['name'] , '<br>';
        $my_file_url = $my_url . $my_path;
        //echo $my_file_url;




        //
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            if($_GET["ctype"] == 'raw'){
                echo $my_file_url;
            }else{
                $array = array(
            			"status" => 1,
            			"info" => "file is an image.",
            			"fileUrl" => $my_file_url
            	);
                echo json_encode($array);
            }
        }else {
            if($_GET["ctype"] == 'raw'){
                echo $my_file_url;
            }else{
                $array = array(
            			"status" => 1,
            			"info" => "file is no an image.",
            			"fileUrl" => $my_file_url
            	);
                echo json_encode($array);
            }
        }
}else{
    header('Content-Type: text/html');
    ?>
    <!DOCTYPE html>
    <html>
    <body>

    <form action="#" method="post" enctype="multipart/form-data">
        Select image to upload:
        <input type="file" name="fileToUpload" id="fileToUpload">
        <input type="submit" value="Upload Image" name="submit">
    </form>

    </body>
    </html>
    <?php
}
