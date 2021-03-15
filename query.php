<?php

ini_set("default_socket_timeout", 10);

$url = guessUrl($_POST["url"]);
if(get_headers($url) != false){
	$chs = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	$conn = mysqli_connect("localhost", "kilo", "Kevin310402!");
	$id = "";

	if(!$conn)
		echo "MYSQL_CONN_FAIL";
	else{
		mysqli_select_db($conn, "short_url");
		while(true){
			$id = "";
			for($i = 0; $i < 6; $i++)
				$id = $id.$chs[mt_rand(0, 61)];
			$res = mysqli_query($conn, "select url from urls where id = '".$id."';");
			$row = mysqli_fetch_assoc($res);
			mysqli_free_result($res);
			if($row == NULL)
				break;
		}
		$res = mysqli_query($conn, "insert into urls(id, url) values('".$id."', '".$url."');");
		mysqli_free_result($res);
		echo "SUCCESS".$id.$url;
	}
	mysqli_close($conn);
}
else
	echo "URL_FAIL";

function guessUrl($url){
	if(strncmp($url, "http://", 7) === 0 || strncmp($url, "https://", 8) === 0)
		return $url;
	if(get_headers($url) == false){
		if(get_headers("http://".$url) != false)
			return "http://".$url;
		if(get_headers("https://".$url) != false)
			return "https://".$url;
		return $url;
	}
	else
		return $url;
}

?>
