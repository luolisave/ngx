<?php  extract($GLOBALS['data']);  ?>
<h1>Please Login</h1>
<form action="<?php echo SITE_URL ?>/index.php?s=public/login" method="post">
    user name: <input name="vt_username" />
    password:  <input type="password" name="vt_password" />
    <input type="submit" name="vt_submit" value="Login" />
</form>
        
