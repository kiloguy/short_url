<?php
$row = NULL;
$status = "INDEX";
if(isset($_GET["id"])){
	$conn = mysqli_connect("localhost", "kilo", "Kevin310402!");
	if(!$conn)
		$status = "MYSQL_CONN_FAIL";
	else{
		mysqli_select_db($conn, "short_url");
		$res = mysqli_query($conn, "select url from urls where id = '".$_GET["id"]."'");
		$row = mysqli_fetch_assoc($res);
		mysqli_free_result($res);
		mysqli_close($conn);
		if($row == NULL)
			$status = "ID_NOT_FOUND";
		else
			header("Location: ".$row["url"]);
	}
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>縮網址</title>
	<meta charset="utf-8">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>
	<script src="query.js"></script>
	<link rel="stylesheet" type="text/css" href="style.css">
	<link href="https://fonts.googleapis.com/css?family=Lato:300,400,700|Noto+Sans+TC:300,400,500&display=swap" rel="stylesheet">
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
	<div id="title" class="user-select-none">縮網址<small>r.thekilo.cc</small></div>
	<div id="wrapper">
		<div id="index">
			<input id="url" placeholder="在此貼上原網址" spellcheck="false" autocomplete="off">
			<button id="search">開始</button>
			<div style="clear: both;"></div>
			<div id="loading">進行中</div>
			<div id="buffer">
				<div>新網址為</div>
				<a id="new-link" target="_blank"></a>
				<button id="copy" data-clipboard-text="">複製到剪貼簿</button>
			</div>
			<div id="alert">
				<div id="alert-content"></div>
				<button id="alert-close">關閉</button>
			</div>
			<div id="mask"></div>
		</div>

		<div id="mysql-conn-fail">
			<div>資料庫連線錯誤...</div>
		</div>
	
		<div id="id-not-found">
			<div>找不到請求的網址...</div>
			<a href="/">回首頁</a>
		</div>

		<div id="emoji" class="user-select-none">(ﾟ皿ﾟﾒ)</div>
	</div>

	<div id="status"><?php echo $status; ?></div>
</body>
</html>
