<?php
session_start();
//!!!!!    ID потока  менять для каждого товара !!!!!!
$monsterThread='58ugmxp6t';// ID потока 
$monsterApiKey='012fd3cac7f5e17b135dba59ad1b7573'; //ключ АПИ
$trafficType=0; 
$monsterUrl='https://api.monsterleads.pro/method/order.add?api_key=' . $monsterApiKey . '&format=json';
$subid=$_COOKIE['utm_term'].':'.$_COOKIE['utm_medium'].':'.$_COOKIE['utm_campaign'].':'.$_COOKIE['utm_content'].':'.$_COOKIE['utm_source'];
$srch=array("'","\"","_");
	$phone = trim(htmlspecialchars($_POST['phone']));   
	$phone = preg_replace('/[^0-9\/-]+/', '', $phone);
    $name=str_replace($srch, "", $_POST['name']); 
    $name = trim(htmlspecialchars($name)); 
    
$postData = array(
	"tel" => $phone,
    "ip" => $_SERVER['REMOTE_ADDR'],
    "code"=>$monsterThread,
    "traffic_type"=>$trafficType,
    "client" => $name,
    "subid" => $subid,    
                );
				
function sendToMonster($ppUrl,$ppData){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $ppUrl);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($ppData));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_HEADER, FALSE);
	$sendResult=curl_exec($ch);
	curl_close($ch);
	return $sendResult;
	}
if($_POST['phone']!=''){
	$addResult=json_decode(sendToMonster($monsterUrl,$postData),true);	
	if($addResult['status']=='ok'){
		$_SESSION['order-OK'] = $addResult['lead_id'];
		$_SESSION['order-name'] = trim($_POST['name']);
	 header("Location: formok.php"); exit();
		}else{
			echo 'Error</br>Code'.$addResult['error_code'];
		}
	}
	else{
		echo 'Error';
	}

?>