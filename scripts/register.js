$(function() {
	var error = $('#error').val();
	var errorCode = $('#errorCode').val();
	if (errorCode == "VERIFY_CODE_ERROR") {
		showMes("验证码错误");
	}
	if (error == "MOBILE_CODE_ERROR") {
		showMes("手机号已经被注册！");
	}
})

// 刷新验证码
function changeVlidateImage(obj) {
	$("#vlidateImage").attr("src", "chineseVerifyCode.images?" + Math.random());
}

// 提交表单、校验表单
function submitRandomPasswordForm() {

	var firstReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
	var passwordvert = /^[0-9_a-zA-Z]{6,20}$/;
	var mobile = $('#mobile').val();
	if ($('#mobile').val() == "") {
		showMes("手机号码不能为空！");
		return false;
	} else if (!firstReg.test($("#mobile").val())) {
		showMes("请输入正确的手机格式！");
		return false;
	}

	if ($('#randomPassword').val() == "") {
		showMes("手机验证码不能为空！");
		return false;
	}

	if ($('#password0').val() == "") {
		showMes("登录密码不能为空！");
		return false;
	}
	if($("#password1").val() == ""){
		showMes("确认密码不能为空！");
		return false;
	}

	if (!passwordvert.test($("#password0").val())) {
		showMes("登录密码格式不正确，只能为数字字母和下划线且长度为6-20位！");
		return false;
	}
	if (!passwordvert.test($("#password1").val())) {
		showMes("确认密码格式不正确，只能为数字字母和下划线且长度为6-20位！");
		return false;
	}

	if ($("#password0").val() != $("#password1").val()) {
		showMes("两次密码输入不一致");
		return false;
	}

	var returnUrl = $('#returnUrl').val();
	var mobile = $('#mobile').val();
	var password = $('#password0').val();
	var verifyCode = $('#verifyCode').val();
	var randomPassword = $('#randomPassword').val();
	loading();
	$.ajax({
				type : "POST",
				url : getRootPath() + "/register/getRegisterMesReg.html" + "?" + "returnUrl=" + returnUrl,
				datatype : "json",
				data : {
					mobile : mobile,
					verifyCode : verifyCode,
					password : password,
					randomPassword : randomPassword
				},
				success : function(data) {

					if (data.result == "success") {
						if(data.mobile_iphone != "" ){
							register_success_Iphone(data.mobile_iphone);	
						}
						unloading();
						alert("恭喜您注册成功！"); // 没使用showMes 如果使用showMes会造成秒跳页面	
						window.location.href = getRootPath() + "/register/list_2.html" + "?" + "returnUrl=" + returnUrl + "&" + "mobile=" +  mobile;
					} else {
						if (data.errorCode == "error") {
							unloading();
							showMes("该用户已注册！");
							return false;
						} else if (data.errorPhone == "errorCodeisPhone") {
							unloading();
							showMes("手机验证码不正确！");
							return false;
						} else if (data.errorReload == "error") {
							unloading();
							showMes("验证码未发送或验证码已过期！");
							return false;
						} else if (data.errorMobile == "error") {
							unloading();
							showMes("此手机号和发送手机验证码的手机号不符！");
							return false;
						} else {
							unloading();
							showMes("系统繁忙，请稍后再试！");
							return false;
						}
					}
				},
				error : function() {
					unloading();
					showMes("系统繁忙，请稍后再试!");
				}
			});
}

function adfghjkl() {
	if ($("#agree").attr("checked") != 'checked') {
		$("#submitButton").attr("onclick", "");
		$("#submitButton").attr("style", "background:#CCC");
	}
}
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

// 注册须知决定是否能点击buttom
function changeButton() {
	if ($("#agree").attr("checked")) {
		$("#submitButton").attr("style", "background:#F63939").attr("onclick",
				"submitRandomPasswordForm()");
		$("#agree").removeAttr("checked");
	} else {
		$("#agree").attr("checked", "true");
		$("#submitButton").attr("style", "background:#CCC").attr("onclick", "");
	}
}

var countdown = 90;
function sendRandomPasswordSettime() {
	if (countdown == 0) {
		$("#sendRandomPassword").attr("style", "");
		$("#sendPasswordWaitTime").attr("style", "display: none;");
		$("#sendPasswordWaitTime").html("90S后重新输入");
		countdown = 90;
		return;
	} else {
		$("#sendRandomPassword").attr("style", "display: none;");
		$("#sendPasswordWaitTime").attr("style", "");
		$("#sendPasswordWaitTime").html(countdown + "S后重新输入");
		countdown--;
	}
	setTimeout(function() {
		sendRandomPasswordSettime()
	}, 1000);
}

function quickQueryCust(evt) {

	evt = (evt) ? evt : ((window.event) ? window.event : "") // 兼容IE和Firefox获得keyBoardEvent对象
	var key = evt.keyCode ? evt.keyCode : evt.which; // 兼容IE和Firefox获得keyBoardEvent对象的键值

	if (key == 13) { // 判断是否是回车事件。
		// 根据需要执行某种操作。
		return false;
	}
}

function submit_notice_span(){
	window.location.href = getRootPath() + '/register/registerNotice.html';
}