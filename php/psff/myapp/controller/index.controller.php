<?php
class index_controller extends ControllerClass{
	public function index(){
            $this->assign("title","Dashboard");
	    
            $this->display("../public/header");
            $this->display();
            $this->display("../public/footer");
                
	}
        
        public function demo(){
            $this->assign("title","Function DEMOs");
	    
            $this->display("../public/header");
            $this->display();
            $this->display("../public/footer");


            //read database
            /*
            echo "<br /><br /><br />Read From Database:";
            $rs = $this->db->from("vt_tour")->select();
            //$rs = $this->mydb->from("test")->select();
            var_dump($rs);
            //*/

            // create a log
            /*
            echo "<br /><br /><br />Write log to Database(sqlite):";
            $this->log2db("try", "in index action", "record content here.");
            //*/

            // create a system log 
            // (recod into "$file = DOC_ROOT.'/system.log';" file)
            /*
            echo '<br /><br /><br />Write system log to "'.DOC_ROOT.'/system.log" file.';
            $this->log("here is a system log test.");
            //*/


            // print session
            /*
            echo "<br /><br /><br />Session:";
            var_dump($_SESSION);
            //*/

            // print pagination
            /*
            $count = $rs = $this->db->from("vt_tour_img")->count();
            $page = new Page($count,3);

            $rs = $this->db->from("vt_tour_img")->limit($page->offset.",".$page->per)->select();
            echo $page->display();

            echo "<br /><br />";
            foreach($rs as $key => $value){
                print_r($value);
                echo "<br />";
            }
            //*/


            // sendGmail
            /*
            $this->sendGmail(
                    "ftcc44@gmail.com", 
                    "luolisave@gmail.com", 
                    "a phpmailer gmail test", 
                    '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>PHPMailer Test</title></head><body><p>Hello!</p></body>',
                    'First Last'
                    );
            //*/
            
            // sendMmail
            /*
            $this->sendMmail(
                    "ftcc44@gmail.com", 
                    "luolisave@gmail.com", 
                    "a phpmailer gmail test", 
                    '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>PHPMailer Gmail Test</title></head><body><p>Hello! from gmail</p></body>',
                    'First Last'
                    );
            //*/
            /*
            $this->sendMmail(
                    "luoli@recrazy.net", 
                    "luolisave@gmail.com", 
                    "a phpmailer Mandrill test", 
                    '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>PHPMailer Mandrill Test</title></head><body><p>Hello! from Mandrill</p></body>',
                    'First Last'
                    );
            //*/
        }
}