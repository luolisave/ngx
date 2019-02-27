<?php
class adm_controller extends ControllerClass{
    public function __construct() {
        parent::__construct();
        
        if(empty($_SESSION['adm'])){
		    echo "NOT login as adm";
		    $this->redirect("index.php?s=public/login");
		}else{
		    //echo "login as adm";
		}
    }
    
	public function index(){
	    $this->assign("title","Dashboard");
	    /*
		$this->assign("data","here is some data");
		//show default view file
		$this->display();
        

		echo "<br /><br /><br />Read From Database:";
		$rs = $this->db->from("adm")->select();
		var_dump($rs);
		//*/
		$this->display("../public/header");
		$this->display();
		$this->display("../public/footer");
	}
	
	public function tour_list(){
	    $this->assign("title","vTour List");
	    
	    $rs = $this->db->from("vt_tour")-> order("id DESC") ->select();
	    $this->assign("data",$rs);
	    
		$this->display("../public/header");
		$this->display();
		$this->display("../public/footer");
	}
	
	public function tour_add(){
	    $this->assign("title","vTour Add");
	    
	    if($_POST){
	        $_POST['create_date'] = $_POST['update_date'] = date("Y-m-d H:i:s");
	        $rs = $this->db->from("vt_tour")->add($_POST);
	        if($rs == true){
	            $this->assign("msg","Success: New vTour created successfully!");
	        }
	    }
	    
	    
		$this->display("../public/header");
		$this->display();
		$this->display("../public/footer");
	}
	
	public function tour_update(){
	    $tour_id = intval($_GET['id']);
	    if(empty($tour_id))exit("vTour ID invalid!");
	    $this->assign("title","vTour Update (ID:{$tour_id})");
	    
	    if($_POST){
	        $_POST['update_date'] = date("Y-m-d H:i:s");
	        $this->db->from('vt_tour')->where("id='$tour_id'")->update($_POST);
	    }
	    
	    $rs = $this->db->from("vt_tour")->where("id = $tour_id")->find();
	    $this->assign("data",$rs);
	    
		$this->display("../public/header");
		$this->display();
		$this->display("../public/footer");
	}
	
	public function tour_delete(){
	    $tour_id = intval($_GET['id']);
	    if(empty($tour_id))exit("vTour ID invalid!");
	    $this->assign("title","vTour Update (ID:{$tour_id})");
	    
	    if($this->db->from('vt_tour')->where("id='$tour_id'")->delete()){
	        $this->redirect("index.php?s=adm/tour_list");
	    }else{
	        exit("Error: Tour not found!");
	    }
	}
	
	public function images(){
	    $tour_id = intval($_GET['tid']);
	    if(empty($tour_id))exit("vTour ID invalid!");
	    
	    $this->display();
	}
}