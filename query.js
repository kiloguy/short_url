$(document).ready(function(){
	$("#status").hide();
	if($("#status").text() == "INDEX"){
		$("#alert").hide();
		$("#loading").hide();
		$("#mask").hide();
		$("#buffer").hide();
		$("#mysql-conn-fail").hide();
		$("#id-not-found").hide();
	}
	else if($("#status").text() == "MYSQL_CONN_FAIL"){
		$("#index").hide();
		$("#id-not-found").hide();
	}
	else if($("#status").text() == "ID_NOT_FOUND"){
		$("#index").hide();
		$("#mysql-conn-fail").hide();
	}

	$("#search").click(function(){
		$("#alert").fadeOut("fast");
		$("#loading").fadeIn("fast");
		$("#url").prop("disabled", true);
		$("#search").prop("disabled", true);
		setTimeout(function(){
			if($("#url").val().length > 1024){
				$("#mask").fadeIn("fast");
				$("#alert-content").text("網址最大長度為1024");
				$("#alert").fadeIn("fast");
				$("#url").prop("disabled", false);
				$("#search").prop("disabled", false);
				$("#loading").fadeOut("fast");
			}
			else
				query();
		}, 2000);
	});

	$("#alert-close").click(function(){
		$("#alert").fadeOut("fast");
		$("#mask").fadeOut("fast");
	});

	function query(){
		$.post("query.php",
			{
				url: $("#url").val()
			},
			function(data, status){
				if(data.substr(0, 7) == "SUCCESS"){
					$("#alert-content").html("<div>縮網址成功:</div><div><b>http://r.thekilo.cc/" + data.substr(7, 6) + "</b></div><div>轉址至</div><div><b>" + data.substr(13) + "</b></div>");
					$("#buffer a").text("http://r.thekilo.cc/" + data.substr(7, 6));
					$("#buffer a").attr("href", "http://r.thekilo.cc/" + data.substr(7, 6));
					$("#copy").attr("data-clipboard-text", $("#buffer a").text());
					$("#buffer").fadeIn("fast");
				}
				else if(data == "MYSQL_CONN_FAIL")
					$("#alert-content").text("資料庫連線錯誤...");
				else if(data == "URL_FAIL")
					$("#alert-content").text("無法取的該網址的連線或連線超時...");
				$("#mask").fadeIn("fast");
				$("#alert").fadeIn("fast");
				$("#url").prop("disabled", false);
				$("#search").prop("disabled", false);
				$("#loading").fadeOut("fast");
			}
		);
	}

	var copyTimeoutId;
	$("#copy").click(function(){
		clearTimeout(copyTimeoutId);
		$("#copy").text("OK!");
		copyTimeoutId = setTimeout(function(){
			$("#copy").text("複製到剪貼簿");
		}, 3000);
	});

	var dot = 0;
	setInterval(function(){
		$("#loading").text($("#loading").text() + ".");
		dot++;
		if(dot > 3){
			dot = 0;
			$("#loading").text("進行中");
		}
	}, 500);

	new ClipboardJS("#copy");
});
