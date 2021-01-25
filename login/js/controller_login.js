// 登入
function accountLogin(){
    $("#loginSumit").attr("disabled", true);
	var account = $("#loginemail").val();
	var password = $("#loginpassword").val();

	/*登入信箱*/
	if ( account == "") {
		$("#loginEmail_notes").text(i18n.t('login_fail.no_mail'))
		$("#loginEmail_notes").removeClass("off");
		$("#loginEmail_notes").addClass("on");
		$("#loginemail").addClass("input-error");
		var check_loginSE = false;
	}else{
		if ( ValidateEmail(account)) {
			$("#loginEmail_notes").text("")	  		
			$("#loginEmail_notes").removeClass("on");
			$("#loginEmail_notes").addClass("off");
			$("#loginemail").removeClass("input-error");
			var check_loginSE = true;
		}else{
			$("#loginEmail_notes").text(i18n.t('login_fail.mail_fail'))
			$("#loginEmail_notes").removeClass("off");
			$("#loginEmail_notes").addClass("on");
			$("#loginemail").addClass("input-error");
			var check_loginSE = false;
		}
	}
	/*密碼*/
	if ( password == "") {
		$("#loginpassword_notes").text(i18n.t('login_fail.no_password'))		
  		$("#loginpassword_notes").removeClass("off");
  		$("#loginpassword_notes").addClass("on");
		$("#loginpassword").addClass("input-error");
		var check_loginpw = false;
	}else{
		$("#loginpassword_notes").text("")		
		$("#loginpassword_notes").removeClass("on");
		$("#loginpassword_notes").addClass("off");
		$("#loginpassword").removeClass("input-error");
		var check_loginpw = true;
	}
	
	var hash = $("#loginhash").val();
	if(hash=='' || hash==null || hash == undefined){
	  $("#login_captchaError_notes").text(i18n.t('signup_fail.no_captcha'))		
  	  $("#login_captchaError_notes").removeClass("off");
  	  $("#login_captchaError_notes").addClass("on");
	  var check_val = false;
	}else{
	  $("#login_captchaError_notes").text("")		
  	  $("#login_captchaError_notes").removeClass("on");
  	  $("#login_captchaError_notes").addClass("off");
	  var check_val = true;
	}
	
	if ((check_loginSE && check_loginpw && check_val)==1 ){
	    var game_id = getParameterByName("game_id");
	    var password = btoa(password); // base64 encode
	    
	    $.post('../api/accountLogin', {
            'account':account,
            'password':password,
            'game_id':game_id,
	    }, function(rsp) {
	    	var jsonData = rsp.replace(/^\s+|\s+$/g, "");
            var jsonObj = JSON.parse(jsonData);
            
            // 判斷是否成功登入
            if (jsonObj.login=="Success"){ // 登入成功
              //alert("登入成功");
              document.getElementById("login_account").innerHTML=account;
              
              var callback = getParameterByName("callback");
              var url = "https://www.erolabs.com/index.html?jwt=" + jsonObj.jwt;
              if (callback != undefined && callback !=null && callback != ""){
                url = callback + "?token=" + jsonObj.jwt;
              }
              
              // 儲存cookie
              document.cookie = "erolabsjwt=" + jsonObj.jwt;
              document.cookie = "erolabsaccount=" + account;
              
              // 儲存
              localStorage.setItem('erolabsjwt', jsonObj.jwt);
              localStorage.setItem('erolabsaccount', account);
              
              location.href = url;
            }else{ // 登入失敗
              /*
              1091	登入失敗 1 次，請確認您輸入的帳號密碼
              1092	登入失敗 2 次，請確認您輸入的帳號密碼
              1093	登入失敗 3 次，請確認您輸入的帳號密碼，剩下2次嘗試登入機會
              1094	登入失敗 4 次，請確認您輸入的帳號密碼，剩下1次嘗試登入機會
              1095	登入失敗 5 次，暫時凍結帳號十分鐘，請稍後再試
              1090	登入失敗，請稍候重新再試
              */
              var reason = "";
              switch (jsonObj.result) {
                case '1091': 
                  reason = i18n.t('result.code1091'); break; 
                case '1092': 
                  reason = i18n.t('result.code1092'); break; 
                case '1093': 
                  reason = i18n.t('result.code1093'); break; 
                case '1094': 
                  reason = i18n.t('result.code1094'); break; 
                case '1095': 
                  reason = i18n.t('result.code1095'); break; 
                default: 
                  reason = i18n.t('result.code1090'); break; 
              }
              document.getElementById("login_fail_reason").innerHTML = reason;
              $(".all-modal").addClass("d-none"); //close
		      $("#error-login-modal").removeClass("d-none");  // open
              $("#loginSumit").attr("disabled", false);
	    	  return false;
            }
	    });
	    
	}else{
        $("#loginSumit").attr("disabled", false);
		return false;
	}
}

// 註冊
function accountSignup(){
    $("#signupSumit").attr("disabled", true);
    var account=getCookie('erolabsaccount')
    if (account == ''){
      account=localStorage.getItem('erolabsaccount');
    }
    var jwt = "";
    if (account == "GUEST") { // 是訪客時才要傳入jwt值 否則預設是空的
      jwt=getCookie('erolabsjwt');
      if (jwt == ""){
        jwt=localStorage.getItem('erolabsjwt');
      }
    }
    
	var signupEmail = $("#signupEmail").val();
    var email = $("#signupEmail").val();
    var sing_pw = $("#sing_password").val();
    var pwvalue = $("#sing_password").val();
    var pwlenght = $("#sing_password").val().length;
    var sing_pwr = $("#sing_password_repeat").val();
    var check_captcha = true;
      
    /*信箱*/
    var check_SE = false;
    if ( signupEmail == "") {
      $("#signupEmail_notes").text(i18n.t('signup_fail.no_mail'));
      $("#signupEmail_notes").removeClass("off");
      $("#signupEmail_notes").addClass("on");
      $("#signupEmail").addClass("input-error");
    } else {
      if ( ValidateEmail(email)) {
        $("#signupEmail_notes").text("");
        $("#signupEmail_notes").removeClass("on");
        $("#signupEmail_notes").addClass("off");
        $("#signupEmail").removeClass("input-error");
        check_SE = true;
      } else {
        $("#signupEmail_notes").text(i18n.t('signup_fail.mail_fail'));
        $("#signupEmail_notes").removeClass("off");
        $("#signupEmail_notes").addClass("on");
        $("#signupEmail").addClass("input-error");
      }
    }
  
    /*密碼*/
    var check_pw = false;
    if ( sing_pw == "") {
      $("#signupPassword_notes").text(i18n.t('signup_fail.no_password'));
      $("#signupPassword_notes").removeClass("off");
      $("#signupPassword_notes").addClass("on");
      $("#sing_password").addClass("input-error");
    } else {
      if (pwlength(pwlenght) && pwcheck(pwvalue)) {
        // 驗證密碼格式
        $("#signupPassword_notes").text("");
        $("#signupPassword_notes").removeClass("on");
        $("#signupPassword_notes").addClass("off");
        $("#sing_password").removeClass("input-error");
        check_pw = true;
      } else {
        $("#signupPassword_notes").text(i18n.t('signup_fail.password_fail'));
        $("#signupPassword_notes").removeClass("off");
        $("#signupPassword_notes").addClass("on");
        $("#sing_password").addClass("input-error");
      }
    }
  
    /*確認密碼*/
    var check_pwr = false;
    if (sing_pwr == "") {
      $("#signupPasswordRepeat_notes").text(i18n.t('signup_fail.no_confirm_password'));
      $("#signupPasswordRepeat_notes").removeClass("off");
      $("#signupPasswordRepeat_notes").addClass("on");
      $("#sing_password_repeat").addClass("input-error");
    } else {
      if (sing_pw == sing_pwr) {
        $("#signupPasswordRepeat_notes").text("");
        $("#signupPasswordRepeat_notes").removeClass("on");
        $("#signupPasswordRepeat_notes").addClass("off");
        $("#sing_password_repeat").removeClass("input-error");
        check_pwr = true;
      } else {
        $("#signupPasswordRepeat_notes").text(i18n.t('signup_fail.confirm_password_fail'));
        $("#signupPasswordRepeat_notes").removeClass("off");
        $("#signupPasswordRepeat_notes").addClass("on");
        $("#sing_password_repeat").addClass("input-error");
      }
    }
  
    /*驗證碼************************************************/
    /*
     var val = $(".input-val").val().toLowerCase();
     var num = show_num.join("");
     if (val == '') {
       $("#captchaError_notes").text(i18n.t('signup_fail.no_captcha'));
       $("#captchaError_notes").removeClass("off");
       $("#captchaError_notes").addClass("on");
       $(".input-val").addClass("input-error");
       check_captcha = false;
       // alert('請輸入驗證碼！');
     } else if (val == num) {
       $("#captchaError_notes").text('');
       $("#captchaError_notes").addClass("off");
       $("#captchaError_notes").removeClass("on");
       $(".input-val").removeClass("input-error");
       // alert('提交成功！');
       $(".input-val").val('');
       check_captcha = true;
       // draw(show_num);
     } else {
       $("#captchaError_notes").text(i18n.t('signup_fail.captcha_fail'));
       $("#captchaError_notes").removeClass("off");
       $("#captchaError_notes").addClass("on");
       $(".input-val").addClass("input-error");
       $(".input-val").val('');
       check_captcha = false;
    }
    */
    var hash = $("#hash").val();
	if(hash=='' || hash == undefined){
	$("#captchaError_notes").text(i18n.t('signup_fail.no_captcha'))		
  	  $("#captchaError_notes").removeClass("off");
  	  $("#captchaError_notes").addClass("on");
	  $("#sing_validcode_repeat").addClass("input-error");
      $(".input-val").val('');
	  var check_val = false;
	}else{
	  $("#captchaError_notes").text("")		
  	  $("#captchaError_notes").removeClass("on");
  	  $("#captchaError_notes").addClass("off");
	  $("#sing_validcode_repeat").removeClass("input-error");
	  var check_val = true;
	}
    
    if (check_SE && check_pw && check_pwr && check_captcha){
      var game_id = getParameterByName("game_id");
      var password = btoa(sing_pw); // base64 encode
      
      $.post('../api/accountSignup', {
        'account':signupEmail,
        'password':password,
        'game_id':game_id,
        'jwt':jwt,
      }, function(rsp) {
        var jsonData = rsp.replace(/^\s+|\s+$/g, "");
        var jsonObj = JSON.parse(jsonData);
        
        console.log("account="+signupEmail);
        console.log("password="+password);
        console.log("result="+jsonObj.signup);
        
        // 判斷是否註冊成功
        if (jsonObj.signup=="Success"){ // 註冊成功
          //alert("註冊成功");
		  
		  // 儲存cookie
          document.cookie = "erolabsjwt=" + jwt;
          document.cookie = "erolabsaccount=" + signupEmail;
          
          // 儲存
          localStorage.setItem('erolabsjwt', jwt);
          localStorage.setItem('erolabsaccount', signupEmail);

          // $(".loginForm-modal,.select-modal,.signupForm-modal,.error-login-modal,.error-signup-modal").addClass("d-none");  //close
		  $(".all-modal").addClass("d-none"); //close
		  $("#loginForm-modal").removeClass("d-none");
	      $("#signupSumit").attr("disabled", false); 
		  return true;
        }else{ // 註冊失敗
          // document.getElementById("signup_reason").innerHTML = jsonObj.reason;
	      // $(".loginForm-modal,.select-modal,.signupForm-modal,.error-login-modal,.error-signup-modal").addClass("d-none");  //close
		  $(".all-modal").addClass("d-none"); //close
		  $("#error-signup-modal").removeClass("d-none"); //open
	      $("#signupSumit").attr("disabled", false); 
		  return true;
        }
      });
    }else{
	  $("#signupSumit").attr("disabled", false); 
      return false;
    }
}

// 登出
function accountLogout(){
    var game_id = getParameterByName("game_id");
    var jwt=getCookie('erolabsjwt')
    if (jwt == ''){
      jwt=localStorage.getItem('erolabsjwt');
    }
    
    var account=getCookie('erolabsaccount')
    if (account == ''){
      account=localStorage.getItem('erolabsaccount');
    }
    
    $.post('../api/accountLogout', {
         'jwt': jwt,
         'account': account,
         'game_id': game_id,
    }, function(rsp) {
        var jsonData = rsp.replace(/^\s+|\s+$/g, "");
        var jsonObj = JSON.parse(jsonData);
        
        var callback = getParameterByName("callback");
        var url = "index.html?game_id="+game_id+"&callback="+callback;
        
        if (callback != undefined && callback != null && callback != ""){
          url = callback + "?logout=true";
        }
        
        // 判斷是否登出成功 回到 清空cookie
        if (jsonObj.logout=="Success"){ // 登出 
          document.getElementById("login_account").innerHTML="";
          document.cookie = "erolabsjwt=";
          document.cookie = "erolabsaccount=";
          localStorage.setItem('erolabsjwt', '');
          localStorage.setItem('erolabsaccount', '');          
          location.href = url;
        }else{ // 登出失敗
          document.getElementById("login_account").innerHTML="";
          document.cookie = "erolabsjwt=";
          document.cookie = "erolabsaccount=";
          localStorage.setItem('erolabsjwt', '');
          localStorage.setItem('erolabsaccount', '');
          location.href = url;
        }
    }); 
    
    return true;
}

// 訪客登入
function guestLogin(){
  var game_id = getParameterByName("game_id");
  $.post('../api/guestLogin', {
    'game_id':game_id,
  }, function(rsp) {
        var jsonData = rsp.replace(/^\s+|\s+$/g, "");
        var jsonObj = JSON.parse(jsonData);
        
        // 判斷是否登出成功 回到 清空cookie
        if (jsonObj.result=="0000"){ // 0000:成功
          //alert("登入成功");
          document.getElementById("login_account").innerHTML="GUEST";
          
          var callback = getParameterByName("callback");
          var url = "https://www.erolabs.com/index.html?jwt=" + jsonObj.jwt;
          if (callback != undefined && callback !=null && callback != ""){
            url = callback + "?token=" + jsonObj.jwt;
          }
          
          // 儲存cookie
          document.cookie = "erolabsjwt=" + jsonObj.jwt;
          document.cookie = "erolabsaccount=GUEST";
          
          // 儲存
          localStorage.setItem('erolabsjwt', jsonObj.jwt);
          localStorage.setItem('erolabsaccount', 'GUEST');
            
          // 直接進入遊戲  
          location.href = url;
          
		  return true;
        }else{ // 訪客登入失敗
          document.cookie = "erolabsjwt=";
          document.cookie = "erolabsaccount=";
          location.href = "index.html";
        }
    }); 
    return true;
}

//確認Email格式
function ValidateEmail(email) {
  return (/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(email));
}

// 密碼檢查英文數字混和
function pwcheck(pwvalue) {
  return /^[A-Za-z0-9]+$/.test(pwvalue) // consists of only these
  && /[A-za-z]/.test(pwvalue) // has a lowercase letter
  && /[0-9]/.test(pwvalue)// has a digit
}

// 密碼檢查8~20字
function pwlength(pwlenght) {
  if( pwlenght >= 8 && pwlenght < 21 ){
    return true;
  } else {
    return false;
  }
}

//取出url後方參數
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}