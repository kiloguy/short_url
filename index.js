function request() {
	showLoading();
	$.post('/new', $('#url').val())
	.done((data) => {
		let newURL = 'https://s.kiloapp.cc/' + data.substring(0, 6);

		$('#buffer a').text(newURL);
		$('#buffer a').attr('href', newURL);
		$('#copy').attr('data-clipboard-text', newURL);
		$('#buffer').show();
		showDialog(`
			<div>縮網址成功!</div>
			<div><b>${newURL}</b> 轉址至</div>
			<div><b>${data.substring(6)}</b></div>
		`);
	})
	.fail((jqXHR) => {
		showDialog(jqXHR.responseText);
	});
}

function showDialog(content) {
	$('#loading').hide();
	$('#url').prop('disabled', true);
	$('#start').prop('disabled', true);
	$('#mask').fadeIn('fast');
	$('#dialog-content').html(content);
	$('#dialog').fadeIn('fast');
}

function showLoading() {
	$('#url').prop('disabled', true);
	$('#start').prop('disabled', true);
	$('#loading').show();
	$('#mask').fadeOut('fast');
	$('#dialog').fadeOut('fast');
}

$(document).ready(() => {
	$('#start').click(() => {
		if($('#url').val().length > 1024)
			showDialog('網址最大長度為1024');
		else
			request();
	});

	$('#dialog-close').click(() => {
		$('#dialog').fadeOut('fast');
		$('#mask').fadeOut('fast');
		$('#url').prop('disabled', false);
		$('#start').prop('disabled', false);
	});

	$('#copy').click(() => {
		$('#copy').text('OK!');
		copyTimeoutId = setTimeout(() => {
			$('#copy').text('複製到剪貼簿');
		}, 500);
	});

	let dot = 0;

	setInterval(() => {
		$('#loading').text($('#loading').text() + '.');
		dot++;
		
		if(dot > 3) {
			dot = 0;
			$('#loading').text('進行中');
		}
	}, 500);
	new ClipboardJS('#copy');
});
