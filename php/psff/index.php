<?php
/*
 * Single File Framework
 * @author: Jack Luo
 * @date: 2014/03/27
 */
define("PROJ_NAME", 'PHP Single File Framework');
define("VERSION", '2.10.1');

//Debug: output error for debug
error_reporting(-1);
ini_set('display_errors', 'On');

/*
 * SECTION 0: Pre-Define
 */
// 0.1 Start session
session_start();

// 0.2 Setup timezone
date_default_timezone_set('America/Toronto');

// 0.3 set current url as default SITE_URL
if (empty($_SERVER['SERVER_PORT']) || $_SERVER['SERVER_PORT'] == 80 || $_SERVER['SERVER_PORT'] == 443) {
    $current_port = '';
} else {
    $current_port = ':' . $_SERVER['SERVER_PORT'];
}

$pre_site_url = empty($_SERVER['SERVER_NAME'])?'':$_SERVER['SERVER_NAME']; 
$secure_connection = false;
if (isset($_SERVER['HTTPS'])) {
    if ($_SERVER["HTTPS"] == "on") {
        $secure_connection = true;
    }
}
$request_url = dirname($_SERVER['SCRIPT_NAME']); //$_SERVER['PHP_SELF']
if ($request_url == '/')
    $request_url = '';
if ($secure_connection == true) {
    $pre_site_url = "https://" . $pre_site_url . $current_port . $request_url;
} else {
    $pre_site_url = "http://" . $pre_site_url . $current_port . $request_url;
}

/*
 * SECTION 1: Define
 */
define("DEBUG", FALSE);
define("DOC_ROOT", dirname(__FILE__));
define("SITE_URL", $pre_site_url);        //need config  //
define("APP_NAME", "myapp");

define("DEFAULT_ACTION", "index");
define("DEFAULT_METHOD", "index");

//Create folder structure automatically if folder of APP_NAME does not exist
define("AUTO_CREATE_FOLDERS", TRUE);
define("CONTROLLER_NAME", "controller");
define("VIEW_NAME", "view");
define("VIEW_TPL", "default"); //default folder inside view folder
define("MODEL_NAME", "model");

//Database
//sqlite:
define("DB_DSN", "sqlite:ndata.sqlite"); //mysql:host=localhost;dbname=test; //sqlite:ndata.sqlite //sudo apt-get install php5-sqlite
define("DB_USERNAME", "");
define("DB_PASSWORD", "");
//mysql:
define("MYDB_DSN", ""); //mysql:host=localhost;dbname=test;
define("MYDB_USERNAME", "test");
define("MYDB_PASSWORD", "test");

//Email
include_once(DOC_ROOT . '/include/PHPMailer/PHPMailerAutoload.php');
// gmail: sendGmail() function
define("GMAIL_USERNAME", "");
define("GMAIL_PASSWORD", "");
define("GMAIL_SMTP_DEBUG", 0); // 0: off ; 1: client messages;  2: client and server messages
define("GMAIL_FROM_NAME", "Recrazy Studio");
// mandrill: sendMmail() function
define("MMAIL_USERNAME", "");
define("MMAIL_API_KEY", "");
define("MMAIL_SMTP_DEBUG", 0); // 0: off ; 1: client messages;  2: client and server messages
define("MMAIL_FROM_NAME", "Recrazy Studio");


/* SECTION 2: ROUTING CLASS
 * 
 */
class Router extends BaseClass {
    private $routing_string;
    private $controller;
    private $action; //action same as controller
    private $method;
    private $controller_path;
    private $view_path;
    private $model_path;

    public function __construct() {
        $this->controller_path = DOC_ROOT . '/' . APP_NAME . '/' . CONTROLLER_NAME;
        $this->view_path = DOC_ROOT . '/' . APP_NAME . '/' . VIEW_NAME . '/' . VIEW_TPL . '/' . DEFAULT_ACTION;
        // a. set routing action and method.
        $this->setActionAndMethod();

        if (!empty($_POST))
            $GLOBALS['data']['post'] = $_POST;
        if (!empty($_GET))
            $GLOBALS['data']['get'] = $_GET;
        if (!empty($_GET))
            $GLOBALS['data']['request'] = $_REQUEST;
    }

    public function doRounting() {
        //b. populate $_GET
        $this->setGETbyPathinfo();

        //c. auto create basic folder structure for /index/index
        if (AUTO_CREATE_FOLDERS) {
            $this->setDefaultFolders();
        }

        //d. include files from MVC
        $this->includeController();
    }

    //d. include files from MVC
    private function includeController() {
        if (empty($this->action) || empty($this->method)) {
            return false;
        }

        $controller_file = $this->controller_path . '/' . $this->action . '.' . CONTROLLER_NAME . '.php';
        $controller_file_name = $this->action . '.' . CONTROLLER_NAME . '.php';

        try {
            if (file_exists($controller_file)) {
                require_once($controller_file);
                $class_name = $this->action . '_' . CONTROLLER_NAME;
                $this->controller = new $class_name;
                $method = $this->method;
                $this->controller->$method();
            } else {
                $this->log('Controller file: "' . $controller_file . '" does not exist!');
            }
            //$this->controller = new 
        } catch (Exception $e) {
            $this->log($e->getMessage());
        }
    }

    //c. auto create basic folder structure for /index/index
    private function setDefaultFolders() {
        //For controller
        $default_folder_path = DOC_ROOT . '/' . APP_NAME . '/' . CONTROLLER_NAME;
        if (!file_exists($default_folder_path)) {
            mkdir($default_folder_path, 0777, true);
        }

        $default_controller_file = $default_folder_path . '/' . DEFAULT_ACTION . '.' . CONTROLLER_NAME . '.php';
        if (!file_exists($default_controller_file)) {
            $php_file_string = '<?php' . "\n" .
                    "class index_controller extends ControllerClass{" . "\n" .
                    '	public function index(){' . "\n" .
                    '		$this->assign("data","here is some data");' . "\n" .
                    '		//show default view file' . "\n" .
                    '		$this->display();' . "\n\n\n" .
                    '		echo "<br /><br /><br />Read From Database:";' . "\n" .
                    '		$rs = $this->db->from("test")->select();' . "\n" .
                    '		var_dump($rs);' . "\n" .
                    '	}' . "\n" .
                    '}'
            ;

            file_put_contents($default_controller_file, $php_file_string);
        }

        //For viewer
        if (!file_exists($this->view_path)) {
            mkdir($this->view_path, 0777, true);
        }

        $default_view_file = $this->view_path . '/' . DEFAULT_METHOD . '.php';
        if (!file_exists($default_view_file)) {
            $html_file_string = '<?php  extract($GLOBALS[\'data\']);  ?><!DOCTYPE html><html><head><title>' . PROJ_NAME . ' - default view file</title></head><body><h1>This is a view file</h1><p>View file path:' . $default_view_file . '</p></body></html>';
            file_put_contents($default_view_file, $html_file_string);
        }

        //For model
        $this->model_path = DOC_ROOT . '/' . APP_NAME . '/' . MODEL_NAME;
        if (!file_exists($this->model_path)) {
            mkdir($this->model_path, 0777, true);
        }
        return true;
    }

    //b. populate $_GET
    private function setActionAndMethod() {
        $this->routing_string = "";
        if (!empty($_SERVER['PATH_INFO'])) {
            $this->routing_string = $path_info = $_SERVER['PATH_INFO'];
        } else if (!empty($_GET['s'])) {
            $this->routing_string = $path_info = $_GET['s'];
        } else {
            $this->routing_string = "";
        }

        $result = array();
        if (!empty($this->routing_string)) {
            $pi = explode('/', $this->routing_string);
            foreach ($pi as $key => $value) {
                if (!empty($value)) {
                    $result[] = $value;
                }
            }
        }

        if (!empty($result[0])) {
            $this->action = $result[0];
        } else {
            $this->action = DEFAULT_ACTION;
        }
        if (!empty($result[1])) {
            $this->method = $result[1];
        } else {
            $this->method = DEFAULT_METHOD;
        }
    }

    // a. set routing action and method.
    private function setGETbyPathinfo() {
        $path_info = "";
        if (!empty($_SERVER['PATH_INFO']) || !empty($_GET['s'])) {
            if (!empty($_SERVER['PATH_INFO'])) {
                $path_info = $_SERVER['PATH_INFO'];
            } else if (!empty($_GET['s'])) {
                $path_info = $_GET['s'];
                $path_info = preg_replace('/^\/*/', '', $path_info);
                $path_info = '/' . $path_info;
            }
            $pi = explode('/', $path_info);
            $result = array();
            foreach ($pi as $key => $value) {
                if ($key % 2 == 1 && $key >= 3) {
                    if (!empty($value) && !empty($pi[($key + 1)])) {
                        $_GET[$value] = $pi[($key + 1)];
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    }

    public function getAction() {
        return $this->action;
    }

    public function getController() {
        return $this->action;
    }

    public function getMethod() {
        return $this->method;
    }

}

/* SECTION 3: DATABASE
 * 
 */
class Database {
    public $dbh;
    public $options = array();
    public $last_sql = '';
    public $debug = false;

    function __construct($dsn, $username = '', $password = '') {
        try {
            $this->dbh = new PDO($dsn, $username, $password);
        } catch (Exception $e) {
            echo 'Connection failed: ' . $e->getMessage();
            $dsn = null;
        }
    }

    public function __call($func, $args) {
        if (in_array($func, array('from', 'field', 'join', 'order', 'where', 'limit'))) {
            if ($func == 'from') {
                $this->options = array();
            }
            $this->options[$func] = $args;
            return $this;
        }
    }

    public function query($sql) {
        if (empty($sql)) {
            return false;
        }
        $sql = trim($sql);
        $this->last_sql = $sql;
        if($this->debug)echo $this->last_sql;
        try {
            $is_select = substr($sql, 0, 6);
            if ($is_select == 'SELECT') {
                $sth = $this->dbh->query($sql);
                $result = array();
                while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                    $result[] = $row;
                }
                return $result;
            } else {
                $sth = $this->dbh->exec($sql);
                return $sth;
            }
        } catch (Exception $e) {
            error_log('Caught exception : ' . $e->getMessage());
            return false;
        }
    }

    public function select() {
        if (empty($this->options['field'][0])) {
            $this->options['field'][0] = '*';
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = " WHERE {$this->options['where'][0]} ";
        }
        if (empty($this->options['limit'][0])) {
            $limit = '';
        } else {
            $limit = " LIMIT {$this->options['limit'][0]} ";
        }
        if (empty($this->options['order'][0])) {
            $order = '';
        } else {
            $order = " ORDER BY {$this->options['order'][0]} ";
        }
        $sql = "SELECT {$this->options['field'][0]} FROM {$this->options['from'][0]} {$where} {$order} {$limit}";

        $rs = $this->query($sql);
        return $rs;
    }

    public function find() {
        if (empty($this->options['field'][0])) {
            $this->options['field'][0] = '*';
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = " WHERE {$this->options['where'][0]} ";
        }
        if (empty($this->options['limit'][0])) {
            $limit = '';
        } else {
            $limit = " LIMIT {$this->options['limit'][0]} ";
        }
        if (empty($this->options['order'][0])) {
            $order = '';
        } else {
            $order = " ORDER BY {$this->options['order'][0]} ";
        }
        $sql = "SELECT {$this->options['field'][0]} FROM {$this->options['from'][0]} {$where} {$order} {$limit}";

        $rs = $this->query($sql);
        if (!empty($rs[0])) {
            return $rs[0];
        } else {
            return $rs;
        }
    }

    public function count() {
        if (empty($this->options['field'][0])) {
            $this->options['field'][0] = '*';
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = " WHERE {$this->options['where'][0]} ";
        }
        if (empty($this->options['limit'][0])) {
            $limit = '';
        } else {
            $limit = " LIMIT {$this->options['limit'][0]} ";
        }
        if (empty($this->options['order'][0])) {
            $order = '';
        } else {
            $order = " ORDER BY {$this->options['order'][0]} ";
        }
        $sql = "SELECT COUNT(*) as count FROM {$this->options['from'][0]} {$where} {$order} {$limit}";

        $rs = $this->query($sql);
        return $rs[0]['count'];
    }

    public function add($data) {
        if (!is_array($data)) {
            return false;
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = "WHERE {$this->options['where'][0]} ";
        }

        $sql_field = array();
        $sql_value = array();
        foreach ($data as $key => $value) {
            $sql_field[] = '`' . $key . '`';
            $sql_value[] = "'" . $value . "'";
        }
        $sql_field = implode(',', $sql_field);
        $sql_value = implode(',', $sql_value);

        $sql = "INSERT INTO {$this->options['from'][0]} 
                ($sql_field) 
                VALUES 
                ($sql_value);";

        $rs = $this->query($sql);
        return $rs;
    }

    public function update($data) {
        if (!is_array($data)) {
            return false;
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = "WHERE {$this->options['where'][0]} ";
        }

        $sql_field = array();
        foreach ($data as $key => $value) {
            $sql_field[] = '"' . $key . '" = "' . $value . '"';
        }
        $sql_update = implode(" , ", $sql_field);

        $sql = "UPDATE {$this->options['from'][0]} 
                SET $sql_update $where";

        $rs = $this->query($sql);
        return $rs;
    }

    public function delete() {
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = "WHERE {$this->options['where'][0]} ";
        }
        $sql = "DELETE FROM {$this->options['from'][0]} $where";

        $rs = $this->query($sql);
        return $rs;
    }

}

/* SECTION 4: ControllerClass
 * 
 */
class ControllerClass extends BaseClass {
    private $router;
    private $action;
    private $method;

    public function __call($name, $arguments) {
        // Note: value of $name is case sensitive.
        echo "Error: Calling method '$name' " . implode(', ', $arguments) . " which is not exist! \n";
        exit;
    }

    public function display($tpl = '', $control_path = '') {
        $this->router = new Router();
        $this->action = $this->router->getAction();
        $this->method = $this->router->getMethod();

        $tpl_file = "";
        if (empty($control_path)) {
            $tpl_file = DOC_ROOT . '/' . APP_NAME . '/' . VIEW_NAME . '/' . VIEW_TPL . '/' . $this->action . '/';
        } else {
            $tpl_file = DOC_ROOT . '/' . APP_NAME . '/' . VIEW_NAME . '/' . VIEW_TPL . '/' . $control_path . '/';
        }

        if (empty($tpl)) {
            $tpl_file = $tpl_file . $this->method . '.php';
        } else {
            $tpl_file = $tpl_file . $tpl . '.php';
        }

        if (file_exists($tpl_file)) {
            require_once($tpl_file);
        } else {
            echo "no such file exist!" . " ($tpl_file) ";
            exit;
        }
    }

    protected function assign($name, $value = '') {
        if (empty($name)) {
            $this->throw_error('Name cannot empty!');
        }
        $GLOBALS['data'][$name] = $value;
        return true;
    }

    protected function redirect($url) {
        if (empty($url)) {
            $this->throw_error('Name cannot empty!');
        }
        $url = SITE_URL . '/' . $url;
        try {
            @header("Location: $url");
        } catch (Exception $e) {
            $e->getMessage(); // TODO: we need do something at here.
        }
    }
}

/* SECTION 5: BaseClass
 * 
 */

class BaseClass {

    public $db;  //sqlite database connection (as default)
    public $mydb; //mysqlite database connection (as optional)
    public $testFlag = true;

    public function __construct() {
        $db_dsn = DB_DSN;
        if (!empty($db_dsn)) {
            $this->db = new Database(DB_DSN, DB_USERNAME, DB_PASSWORD);
            if(DEBUG) $this->db->debug = true;
        } else {
            $this->db = null;
        }
        

        $mydb_dsn = MYDB_DSN;
        if (!empty($mydb_dsn)) {
            $this->mydb = new Database(MYDB_DSN, MYDB_USERNAME, MYDB_PASSWORD);
            if(DEBUG) $this->mydb->debug = true;
        } else {
            $this->mydb = null;
        }
    }

    protected function ajaxReturn($data, $info = '', $status = 1, $type = '') {
        $result = array();
        $result['status'] = $status;
        $result['info'] = $info;
        $result['data'] = $data;
        if (empty($type))
            $type = 'JSON';
        if (strtoupper($type) == 'JSON') {
            // 返回JSON数据格式到客户端 包含状态信息
            header("Content-Type:text/html; charset=utf-8");
            exit(json_encode($result));
        } elseif (strtoupper($type) == 'XML') {
            // 返回xml格式数据
            header("Content-Type:text/xml; charset=utf-8");
            exit(xml_encode($result));
        } elseif (strtoupper($type) == 'EVAL') {
            // 返回可执行的js脚本
            header("Content-Type:text/html; charset=utf-8");
            exit($data);
        } else {
            // TODO 增加其它格式
        }
    }

    protected function randString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }

    // method to send email
    public function sendGmail($from, $to, $subject, $message, $from_name = "", $to_name = "", $is_html = true) {
        //Create a new PHPMailer instance
        $mail = new PHPMailer();
        //Tell PHPMailer to use SMTP
        $mail->isSMTP();
        //Enable SMTP debugging
        // 0 = off (for production use)
        // 1 = client messages
        // 2 = client and server messages
        $mail->SMTPDebug = GMAIL_SMTP_DEBUG;
        //Ask for HTML-friendly debug output
        $mail->Debugoutput = 'html';
        //Set the hostname of the mail server
        $mail->Host = 'smtp.gmail.com';
        //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
        $mail->Port = 587;
        //Set the encryption system to use - ssl (deprecated) or tls
        $mail->SMTPSecure = 'tls';
        //Whether to use SMTP authentication
        $mail->SMTPAuth = true;
        //Username to use for SMTP authentication - use full email address for gmail
        $mail->Username = GMAIL_USERNAME;
        //Password to use for SMTP authentication
        $mail->Password = GMAIL_PASSWORD;
        //Set who the message is to be sent from
        if (empty($from_name))
            $from_name = GMAIL_FROM_NAME;
        $mail->setFrom($from, $from_name); //First Last
        //Set an alternative reply-to address
        $mail->addReplyTo($from, $from_name); //First Last
        //Set who the message is to be sent to
        $mail->addAddress($to, $to_name); //John Doe
        //Set email format to HTML
        $mail->IsHTML($is_html);
        //Set the subject line
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = $message;
        //Read an HTML message body from an external file, convert referenced images to embedded,
        //convert HTML into a basic plain-text alternative body
        //$mail->msgHTML(file_get_contents('contents.html'), dirname(__FILE__));
        //Replace the plain text body with one created manually
        //$mail->AltBody = 'This is a plain-text message body';
        //Attach an image file
        //$mail->addAttachment('images/phpmailer_mini.png');
        //send the message, check for errors
        if (!$mail->send()) {
            /*
              echo "Mailer Error: " . $mail->ErrorInfo;
              // */
            return false;
        } else {
            /////echo "Message sent!";
            return true;
        }
    }

    //method to send Mandrill mail
    // method to send email
    public function sendMmail($from, $to, $subject, $message, $from_name = "", $to_name = "", $is_html = true) {
        //Create a new PHPMailer instance
        $mail = new PHPMailer();
        //Tell PHPMailer to use SMTP
        $mail->isSMTP();
        //Enable SMTP debugging
        // 0 = off (for production use)
        // 1 = client messages
        // 2 = client and server messages
        $mail->SMTPDebug = MMAIL_SMTP_DEBUG;
        //Ask for HTML-friendly debug output
        $mail->Debugoutput = 'html';

        $mail->Host = 'smtp.mandrillapp.com';                 // Specify main and backup server
        $mail->Port = 587;                                    // Set the SMTP port
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = MMAIL_USERNAME;                     // SMTP username
        $mail->Password = MMAIL_API_KEY;                      // SMTP password
        $mail->SMTPSecure = 'tls';                            // Enable encryption, 'ssl' also accepted

        if (empty($from_name))
            $from_name = MMAIL_FROM_NAME;
        /////$mail->setFrom($from, $from_name); //First Last
        $mail->From = $from;
        $mail->FromName = $from_name;
        $mail->AddAddress($to, $to_name);  // Add a recipient
        /////$mail->AddAddress('ellen@example.com');          // Name is optional

        $mail->IsHTML($is_html);                              // Set email format to HTML

        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = $message;

        if (!$mail->Send()) {
            /*
              echo 'Message could not be sent.';
              echo 'Mailer Error: ' . $mail->ErrorInfo;
              exit;
              // */
            return false;
        } else {
            /////echo 'Message has been sent';
            return true;
        }
    }

    protected function sendEmail($from, $to, $subject, $message) {
        if ($from == '')
            $from = 'no-reply@recrazy.net';

        $headers = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text; charset=UTF-8' . "\r\n";
        $headers .= 'To: ' . $to . "\r\n";
        $headers .= 'From: ' . $from . "\r\n";

        $subject = trim($subject);
        $message = trim($message);

        $send = mail($to, $subject, $message, $headers);

        if (!$send)
            return false;

        return true;
    }

    protected function uploadImageFile($filename) {
        if (empty($_FILES[$filename]['tmp_name']))
            return false; // return false if no file choosed;

        $allowedExts = array("jpg", "jpeg", "gif", "png");
        $extension = end(explode(".", $_FILES[$filename]["name"]));
        if ((($_FILES[$filename]["type"] == "image/gif") || ($_FILES[$filename]["type"] == "image/jpeg") || ($_FILES[$filename]["type"] == "image/png") || ($_FILES[$filename]["type"] == "image/pjpeg")) && ($_FILES[$filename]["size"] < 10000000) // 10MB
                && in_array($extension, $allowedExts)) {
            if ($_FILES[$filename]["error"] > 0) {
                echo "Error: " . $_FILES[$filename]["error"] . "<br>";
            } else {
                $today = date("Ymd");
                $uid = uniqid();
                $output_filename = $today . '_' . $uid . '.' . $extension;
                $file_path = DOC_ROOT . '/public/upload/images/' . $output_filename; //$_FILES[$filename]["name"];
                if (move_uploaded_file($_FILES[$filename]["tmp_name"], $file_path)) {
                    $return = array();
                    $return['output_filename'] = $output_filename;
                    $return['original_filename'] = $_FILES[$filename]["name"];
                    return $return;
                } else {
                    return false;
                }
            }
        } else {
            echo "Invalid filename";
        }
        //
    }

    // methods for testing
    public function log($error_info) {
        //TODO: log ERROR to file
        $file = DOC_ROOT . '/system.log';
        $message = "[" . date("Y-m-d H:i:s") . "] $error_info\r\n";
        file_put_contents($file, $message, FILE_APPEND);
        return true;
    }
    
    // methods for log user action etc.
    public function log2db($type = "action", $title = "", $content = "") {
        //*
        $user = empty($_SESSION['user']['uName']) ? 'null' : $_SESSION['user']['uName'];
        $adm = empty($_SESSION['adm']['username']) ? 'null' : $_SESSION['adm']['username'];
        $mylog = array(
            "type" => $type,
            "user" => "user:$user;adm:$adm", // user:null;adm:admin means user did not login as everage user, but login as admin user named 'admin'
            "title" => "action at index/index",
            "content" => "user:admin",
            "create_date" => date("Y-m-d H:i:s")
        );
        $this->db->from("log")->add($mylog);
        return true;
    }

    // array to table start ==========>
    function testGetBgcolor() {
        $bgcolor = array(
            'bp__' => array(
                'info' => 'Billing Plan Table',
                'rgb' => '#FFAA00'
            ),
            'os__' => array(
                'info' => 'order_shphone Table',
                'rgb' => '#AAFFFF'
            )
        );
        return $bgcolor;
    }

    function testArray2table($array) {
        if (!($this->testFlag)) {
            return false;
        }

        $bgcolors = $this->testGetBgcolor();
        echo "<table cellspacing=\"0\" border=\"2\">\n";
        echo "<tr>\n";
        foreach ($array[0] as $key => $row) {
            $color = $this->testPickColor($key, $bgcolors);
            $color_str = '';
            if (!empty($color)) {
                $color_str = 'bgcolor="' . $color . '"';
            }
            echo "<td $color_str>" . $key . "</td>\n";
        }
        echo "</tr>\n";
        foreach ($array as $key => $row) {
            echo "<tr>\n";
            foreach ($row as $key2 => $row2) {
                $color = $this->testPickColor($key2, $bgcolors);
                $color_str = '';
                if (!empty($color)) {
                    $color_str = 'bgcolor="' . $color . '"';
                }
                echo "<td $color_str>" . $row2 . "</td>\n";
            }
            echo "</tr>\n";
        }
        echo "</tr>\n";
        if (!empty($array[0])) {
            $col_num = count($array[0]);
        } else {
            $col_num = 0;
        }
        if (!empty($col_num)) {
            $col_str = 'colspan="' . $col_num . '"';
        }

        echo "<td $col_str>";
        foreach ($bgcolors as $key => $value) {
            echo "* <span style=\"background-color: {$value['rgb']};\">" . $value['info'] . "</span><br />";
        }
        echo '<hr />';
        $this->testMemory();
        echo "<td>\n";
        echo "</tr>\n";
        echo "</table>\n";
    }

    function testPickColor($key, $colors) {
        if (!empty($colors) && is_array($colors)) {
            foreach ($colors as $k => $v) {
                if (strpos($key, $k) !== false) {
                    return $colors[$k]['rgb'];
                }
            }
        } else {
            return '';
        }
    }

    function testMemory() {
        if (!($this->testFlag)) {
            return false;
        }
        $size = memory_get_usage(true);
        $unit = array('b', 'kb', 'mb', 'gb', 'tb', 'pb');
        $rs = @round($size / pow(1024, ($i = floor(log($size, 1024)))), 2) . ' ' . $unit[$i];
        echo "<div> Memory Usage:  $rs </div>";
    }

    // array to table ends <============
    // common functions starts ===============>
    static function isInString($haystack, $needle) {
        $array = explode($needle, $haystack);
        return count($array) > 1;
    }

    // common functions ends   <=================
}

/* SECTION X.1: Paging
 * General purpose classes
 */

class Page {
    public $count;
    public $per;
    public $offset;
    public $pages; //total pages
    public $page_url;
    public $html;
    public $routing_string;
    public $action;
    public $method;

    function __construct($count, $per = 20, $page_url = "/index.php?s=") { // path_info configuration should use this: "/index.php"
        $this->setActionMethod();
        $this->count = intval($count);
        $this->per = intval($per);
        $current_page = empty($_GET['page']) ? 1 : $_GET['page'];
        $current_page = intval($current_page);
        if (empty($current_page))
            $current_page = 1;
        $this->offset = (intval($current_page) - 1) * $this->per;
        $this->pages = intval(ceil($this->count / $this->per));

        if (!empty($_GET['page'])) {
            unset($_GET['page']);
        }
        if (!empty($_GET['s'])) {
            unset($_GET['s']);
        }
        $get_str = "";
        foreach ($_GET as $key => $value) {
            $get_str .= $key . '/' . $value . '/';
        }
        $this->page_url = SITE_URL . $page_url . $get_str; //.'page/'.$page
    }

    function display($return_flag = 1) {  // 1. return html.   0. echo html out
        $this->html .= '<div class="pagination">';
        $this->html .= '<a href="' . $this->page_url . $this->action . '/' . $this->method . '/page/1' . '">|&lt;</a>'; //<?php echo ; 

        for ($i = 1; $i <= $this->pages; $i++) {
            $this->html .= '<a href="' . $this->page_url . $this->action . '/' . $this->method . '/page/' . $i . '">' . $i . '</a>';
        }
        $this->html .= '<a href="' . $this->page_url . $this->action . '/' . $this->method . '/page/' . $this->pages . '">&gt;|</a>'; // echo $this->page_url.'page/'.$this->pages;
        $this->html .= '</div>';
        return $this->html;
    }

    private function setActionMethod() {
        $this->routing_string = "";
        if (!empty($_SERVER['PATH_INFO'])) {
            $this->routing_string = $path_info = $_SERVER['PATH_INFO'];
        } else if (!empty($_GET['s'])) {
            $this->routing_string = $path_info = $_GET['s'];
        } else {
            $this->routing_string = "";
        }

        $result = array();
        if (!empty($this->routing_string)) {
            $pi = explode('/', $this->routing_string);
            foreach ($pi as $key => $value) {
                if (!empty($value)) {
                    $result[] = $value;
                }
            }
        }

        if (!empty($result[0])) {
            $this->action = $result[0];
        } else {
            $this->action = DEFAULT_ACTION;
        }
        if (!empty($result[1])) {
            $this->method = $result[1];
        } else {
            $this->method = DEFAULT_METHOD;
        }
    }

}

/* SECTION X.2: 
 * General purpose classes
 */

/* SECTION Y: CLI
 * Run by command line with argument, Routing function will disable.
 */
if(isCli()){
    echo 'we are now in cli';
    var_dump($argv);
    exit();
}

function isCli() {
    return php_sapi_name()==="cli";
}

/*
 * SECTION Z: Execute Framework
 */
$router = new Router();
$router->doRounting();

/*
 * SECTION ???: TEST AREA
 */
