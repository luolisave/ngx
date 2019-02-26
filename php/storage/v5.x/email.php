<?php
# @Author: Li Luo
# @Date:   2017-03-17T14:26:16-04:00
# @Last modified by:   Li Luo
# @Last modified time: 2017-03-20T10:30:38-04:00

ini_set( 'display_errors', 1 );
error_reporting( E_ALL );

$email_from = "";
$email_to = "";
$email_subject = "";
$emial_content = "";

if(!$_POST){
	$fileContent = file_get_contents("php://input");
	$args = json_decode($fileContent, true);

	if($args){
		$email_from = $args["email_from"];
		$email_to = $args["email_to"];
		$email_subject = $args["email_subject"];
		$email_content = $args["email_content"];
	}else{
		exit("error on decode json body");
	}

}else{
	$email_from = $_POST["email_from"];
	$email_to = $_POST["email_to"];
	$email_subject = $_POST["email_subject"];
	$email_content = $_POST["email_content"];
}



if(!empty($email_from) && !empty($email_to) && !empty($email_subject) && !empty($email_content)){
	$to      = $email_to;
	$subject = $email_subject;
	$message = $email_content;
	$headers = 'From: '. $email_from . "\r\n" .
		'Reply-To: info@mail.lluo.ca' . "\r\n" .
		'X-Mailer: PHP/' . phpversion();

	mail($to, $subject, $message, $headers);
}else{
	exit('email_from, email_to, email_subject and email_content cannot empty!');
}
