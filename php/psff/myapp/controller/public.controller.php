<?php
class public_controller extends ControllerClass{
	public function index(){
	    /*
		$this->assign("data","here is some data");
		//show default view file
		$this->display();


		echo "<br /> =============== DEBUG OUTPUT ===============<br /><br /><br />Read From Database:";
		$rs = $this->db->from("adm")->select();
		var_dump($rs);
		//*/
		$this->display();
	}
	
	public function login(){
	    $this->assign("title","Login");
	    if($_POST){
	        $username = trim($_POST["vt_username"]);
	        $password = trim($_POST["vt_password"]);
	        $password = md5($password);
	        
	        $rs = $this->db->from("adm")->where("username='$username' AND password='$password'")->find();
	        
	        if(!empty($rs)){
	            $_SESSION["adm"] = $rs;
	            $this->redirect("index.php?s=index/index");
	        }else{
	            $this->assign("msg","Error: Cannot login!");
	        }
	    }
	    
	    $this->display("header");
	    $this->display();
	    $this->display("footer");
	}
	
	public function logout(){
	     unset($_SESSION["adm"]);
	     $this->redirect("index.php?s=public/login");
	}
	
	public function _upload(){
	    echo "dsfa";
	}
        
        
        public function barcodeimg(){
            $sn = '';
            if(!empty($_GET['sn'])){
                $sn = trim($_GET['sn']);
            }
            require(DOC_ROOT.'/include/barcodegen/class/BCGFontFile.php');
            require(DOC_ROOT.'/include/barcodegen/class/BCGColor.php');
            require(DOC_ROOT.'/include/barcodegen/class/BCGDrawing.php');
            require(DOC_ROOT.'/include/barcodegen/class/BCGcode39.barcode.php');
            //require(DOC_ROOT.'/include/barcodegen/class/BCGcodabar.barcode.php');

            $font = new BCGFontFile(DOC_ROOT.'/include/barcodegen/font/Arial.ttf', 18);
            $color_black = new BCGColor(0, 0, 0);
            $color_white = new BCGColor(255, 255, 255);

            // Barcode Part
            //$code = new BCGcodabar();
            $code = new BCGcode39();
            $code->setScale(2);
            $code->setThickness(30);
            $code->setForegroundColor($color_black);
            $code->setBackgroundColor($color_white);
            $code->setFont($font);
            
            if(empty($sn)){
                $code->parse('Error');
            }else{
                $code->parse($sn);
            }
            

            // Drawing Part
            $drawing = new BCGDrawing('', $color_white);
            $drawing->setBarcode($code);
            $drawing->draw();

            header('Content-Type: image/png');

            $drawing->finish(BCGDrawing::IMG_FORMAT_PNG);
        }
        
        public function barcode(){
            $this->display();
        }
}