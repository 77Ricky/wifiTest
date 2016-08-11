// 发送手机验证码
function sendMobileCaptcha() {

	var firstReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
	if ($('#mobile').val() == "") {
		showMes("手机号码不能为空！");
		return false;
	} else if (!firstReg.test($("#mobile").val())) {
		showMes("请输入正确的手机格式！");
		return false;
	}

	if ($('#verifyCode').val().length == "") {
		showMes("验证码不能为空");
		return false;
	}

	var verifyCode = $('#verifyCode').val();
	var mobile = $('#mobile').val();

	if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile))) {
		showMes("手机号输入错误");
		return false;
	}

	$.ajax({
		type : "POST",
		url : getRootPath() + "/register/loginRegister/sendMobileCaptch.html",
		datatype : "json",
		data : {
			mobile : mobile,
			verifyCode : verifyCode
		},
		success : function(data) {
			if (data.result == "success") {
				showMes("验证码发送成功！");
				changeVlidateImage();
				sendRandomPasswordSettime();
			} else {
				if (data.errorCode == "VERIFY_CODE_ERROR") {
					changeVlidateImage();
					showMes("验证码输入错误！");
				} else {
					changeVlidateImage();
					showMes("验证码输入错误!");
				}
			}
		},
		error : function() {
			changeVlidateImage();
			showMes("发送验证码失败!");
		}
	});
}