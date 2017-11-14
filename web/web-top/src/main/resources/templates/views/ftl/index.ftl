<#--<#assign sec=JspTaglibs["http://www.springframework.org/security/tags"] >-->
<#import "/spring.ftl" as spring/>
<html>
<head>
    <spring:csrfMetaTags/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<#--<meta name="_csrf" content="<#if _csrf??>${_csrf.token}</#if>"/>-->
<#--<meta name="_csrf_header" content="<#if _csrf??>${_csrf.headerName}</#if>"/>-->

    <link rel="stylesheet" href="${resourcePath}/thirdparty/bootstrap-3.3.7-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="${resourcePath}/thirdparty/bootstrap-3.3.7-dist/css/bootstrap-theme.min.css">
    <script type="text/javascript" src="${resourcePath}/thirdparty/jquery/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="${resourcePath}/business/js/utils/almightyUtil.js"></script>

    <style>
        .form-signin {
            max-width: 330px;
            padding: 15px;
            margin: 0 auto;
        }

        .form-signin .form-signin-heading, .form-signin .checkbox {
            margin-bottom: 10px;
        }

        .form-signin .checkbox {
            font-weight: normal;
        }

        .form-signin .form-control {
            position: relative;
            font-size: 16px;
            height: auto;
            padding: 10px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }

        .form-signin .form-control:focus {
            z-index: 2;
        }

        .form-signin input[type="text"] {
            margin-bottom: -1px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        .form-signin input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }

        .account-wall {
            margin-top: 20px;
            padding: 40px 0px 20px 0px;
            background-color: #f7f7f7;
            -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
            -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        }

        .login-title {
            color: #555;
            font-size: 18px;
            font-weight: 400;
            display: block;
        }

        .profile-img {
            width: 96px;
            height: 96px;
            margin: 0 auto 10px;
            display: block;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            border-radius: 50%;
        }

        .need-help {
            margin-top: 10px;
        }

        .new-account {
            display: block;
            margin-top: 10px;
        }
    </style>
</head>
<body>
<#--<sec:csrfInput />-->
<div class="container" style="margin-top:70px;">
    <div class="row">
        <div class="col-sm-6 col-md-4 card-w-add col-md-offset-4">
            <h1 class="text-center login-title">Sign in</h1>
            <div class="account-wall">
                <img class="profile-img" src="/business/images/userImg.png" alt="">
                <div class="form-signin">
                    <input id="loginId" type="text" name="id" class="form-control" placeholder="아이디" required autofocus>
                    <input id="loginPwd" type="password" name="id" class="form-control" placeholder="아이디" required>
                    <button id="loginBtn" class="btn btn-lg btn-primary btn-block">
                        로그인
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-6 col-md-4 card-w-add col-md-offset-4">
            <h1 class="text-center login-title">회원가입</h1>
            <div class="account-wall">
                <img class="profile-img" src="/business/images/userImg.png" alt="">
                <div class="form-signin">
                    <input id="registerId" type="text" name="id" class="form-control" placeholder="아이디" required>
                    <input id="registerPwd" type="password" name="id" class="form-control" placeholder="비밀번호" required>
                    <button id="registerBtn" class="btn btn-lg btn-primary btn-block">
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    <#if isDenial == 'Y'>
    alert('접근 권한이 없습니다.');
    </#if>

    var Index = {
        init: function () {
            var _this = this;

            $('#loginId,#loginPwd').keydown(function (e) {
                if (e.keyCode == 13) {
                    $('#loginBtn').click();
                }
            });

            $('#registerId,#registerPwd').keydown(function (e) {
                if (e.keyCode == 13) {
                    $('#registerBtn').click();
                }
            });

            $('#loginBtn').click(function () {
                _this.login();
            });

            $('#registerBtn').click(function () {
                _this.register();
            });
        },

        login: function () {
            commonUtil.ajax.call({
                type: 'post',
                url: '/user/login',
                data: {
                    name: $('#loginId').val(),
                    password: $('#loginPwd').val()
                },
                success: function (result) {
                    switch (result.code) {
                        case 200:
                            window.location.href = '/chatRoom';
                            break;
                        case 500:
                            alert('아이디 또는 비번이 다릅니다.');
                            break;
                    }
                }
            });
        },

        register: function () {
            commonUtil.ajax.call({
                type: 'post',
                url: '/user/register',
                data: {
                    userName: $('#registerId').val(),
                    password: $('#registerPwd').val()
                },
                success: function (result) {
                    alert('회원가입 완료');
                }
            });
        }
    }
    Index.init();
</script>
</body>
</html>