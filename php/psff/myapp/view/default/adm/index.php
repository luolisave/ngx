<?php  extract($GLOBALS['data']);  ?>
        <p>
            Welcome Back, <?php if(!empty($_SESSION["adm"]["username"])){echo $_SESSION["adm"]["username"];} ?>  
            |  
            <a href="<?php echo SITE_URL."/index.php?s=public/logout" ?>">Logout</a>
        </p>
        <h4>List of functions</h4>
        <ul>
            <li>
                <a href="<?php echo SITE_URL."/index.php?s=adm/tour_list" ?>">List Tours</a>
                <ul>
                    <li><a href="<?php echo SITE_URL."/index.php?s=adm/tour_add" ?>">Add a vTour</a></li>
                </ul>
            </li>
            
        </ul>
        
        <h4>List of admin functions</h4>
        <ol>
            <li><a href="<?php echo SITE_URL."/adminer.php" ?>">Adminer</a> (Database Management Tool. Choose sqlite3 -> ndata.sqlite)</li>
            
        </ol>