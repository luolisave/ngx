<?php  extract($GLOBALS['data']);  ?><!DOCTYPE html>
<html>
    <head>
        <title><?php if(!empty($title))echo $title . " | "; ?>  Single File Framework</title>
        <link rel="stylesheet" type="text/css" href="<?php ECHO SITE_URL."/public/css/style.css" ?>" />
    </head>
    <body>
    
    <?php if(!empty($msg))echo $msg; ?>