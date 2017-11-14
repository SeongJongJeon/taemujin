<html>
<head>
    <link type="text/css" rel="stylesheet" href="${resourcePath}/thirdparty/bootstrap-3.3.7-dist/css/bootstrap.css">
    <link type="text/css" rel="stylesheet" href="${resourcePath}/thirdparty/colorpicker/css/colorpicker.css">
    <link type="text/css" rel="stylesheet" href="${resourcePath}/business/css/common.css">
    <link type="text/css" rel="stylesheet" href="${resourcePath}/business/css/model/chatRoom.css">
    <style>
        #localCanvas, #remoteCanvas {
            display: none;
            border: 1px solid #000000;
            z-index: 99999999;
        }
        .colorpicker, .colorpicker * {
            z-index: 999999999;
        }
    </style>
</head>
<body>
<canvas id="localCanvas"></canvas>
<canvas id="remoteCanvas"></canvas>
<div class="container fill">
    <div class="row chat-wrap">

        <!-- Contacts & Conversations -->
        <div class="col-sm-3 panel-wrap">

            <!-- Overlay Menu / Contacts -->
            <div class="col-sm-12 section-wrap collapse" id="Contacts">

                <!--Header-->
                <div class="row header-wrap">
                    <div class="chat-header col-sm-12">
                        <h4>Select a Contact</h4>
                        <div class="header-button">
                            <a class="btn pull-right" href="#Contacts" data-toggle="collapse">
                                <i class="fa fa-close"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!--Contacts-->
                <div class="row content-wrap">
                    <div class="contact btn">
                        <div class="media-body">
                            <h5 class="media-heading">Walter White</h5>
                        </div>
                    </div>
                </div>

            </div>

            <!--Left Menu / Conversation List-->
            <div class="col-sm-12 section-wrap">
                <!--Header-->
                <div class="row header-wrap">
                    <div class="chat-header col-sm-12">
                        <h4 id="username">참여자</h4>
                        <div class="header-button">
                            <a class="btn pull-right" href="#Contacts" data-toggle="collapse">
                                <i class="fa fa-pencil-square-o fa-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!--Conversations-->
                <div id="userListBox" class="row content-wrap">

                </div>

            </div>

        </div>

        <!-- Messages & Info -->
        <div class="col-sm-9 panel-wrap">
            <!--Main Content / Message List-->
            <div class="col-sm-7 section-wrap" id="Messages">
                <!--Header-->
                <div class="row header-wrap">
                    <div class="chat-header col-sm-12">
                        <h4>대화 내용</h4>
                        <div class="header-button">
                            <a class="btn pull-right info-btn">
                                <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!--Messages-->
                <div id="messageReceiveBox" class="row content-wrap messages">

                </div>

                <!--Message box & Send Button-->
                <div class="row send-wrap">
                    <div class="send-message">
                        <div class="message-text">
                            <textarea id="messageSendBox" class="no-resize-bar form-control" rows="2"
                                      placeholder="Write a message..."></textarea>
                        </div>
                        <div id="messageSendBtn" class="send-button">
                            <a class="btn">Send <i class="fa fa-send"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <!--Sliding Menu / Conversation Members-->
            <div class="col-sm-5 section-wrap" id="Members">
                <!--Header-->
                <div class="row header-wrap">
                    <div class="chat-header col-sm-12">
                        <h4>비디오 채팅</h4>
                        <div class="header-button">
                            <a class="btn pull-right info-btn">
                                <i class="fa fa-close"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!--Members-->
                <div class="row content-wrap" style="text-align:center">
                    <video id="localVideo" style="width:95%" autoplay muted playsinline></video>
                    <video id="remoteVideo" style="width:95%" autoplay></video>
                    <button id="changeColorBtn" type="button" class="btn-xs btn-success" style="display: none">color
                    </button>
                    <button id="sendRemoteSvgBtn" type="button" class="btn-xs btn-success" style="display: none">전달
                    </button>
                    <button id="removeRemoteSvgBtn" type="button" class="btn-xs btn-warning" style="display: none">삭제
                    </button>
                </div>

            </div>

        </div>
    </div>
</div>

<#-- 접속자 리스트의 Row 템플릿 -->
<template id="userRowTemplate">
    <div class="conversation btn">
        <div class="media-body">
            <h5 class="media-heading userName">Walter White</h5>
            <small class="pull-right time enterTime">Last seen 12:10am</small>
        </div>
    </div>
</template>

<#-- 메시지 리스트의 Row 템플릿 -->
<template id="msgRowTemplate">
    <div class="msg">
        <div class="media-body">
            <small class="pull-right time"><i class="fa fa-clock-o"></i> <span class="receiveTime">12:10am</span>
            </small>

            <h5 class="media-heading writer">Walter White</h5>
            <small class="col-sm-11 receiveMsg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
                pulvinar magna. Phasellus semper scelerisque purus, et semper nisl lacinia sit amet.
                Praesent venenatis turpis vitae purus semper, eget sagittis velit venenatis. Class
                aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos...
            </small>
        </div>
    </div>
</template>
<script type="text/javascript" src="${resourcePath}/thirdparty/jquery/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="${resourcePath}/thirdparty/sockjs-1.1.4/sockjs.min.js"></script>
<script type="text/javascript" src="${resourcePath}/thirdparty/stomp/stomp.min.js"></script>
<script type="text/javascript" src="${resourcePath}/thirdparty/web-rtc/adapter.js"></script>
<script type="text/javascript" src="${resourcePath}/thirdparty/sketchjs/sketch.min.js"></script>
<script type="text/javascript" src="${resourcePath}/thirdparty/colorpicker/js/colorpicker.js"></script>
<script type="text/javascript" src="${resourcePath}/business/js/utils/integrationUtil.js"></script>
<script type="text/javascript" src="${resourcePath}/business/js/utils/almightyUtil.js"></script>
<script type="text/javascript" src="${resourcePath}/business/js/model/canvasUtil.js"></script>
<script type="text/javascript" src="${resourcePath}/business/js/model/webSocket.js"></script>
<script type="text/javascript" src="${resourcePath}/business/js/model/webRTC.js"></script>
<script type="text/javascript" src="${resourcePath}/business/js/model/chatRoom.js"></script>
<script type="text/javascript">
    ChatRoom.setUser(${userInfo});
    ChatRoom.start({
        messageSendBoxId: '#messageSendBox',
        messageSendBtnId: '#messageSendBtn',
        messageReceiveBoxId: '#messageReceiveBox',
        userListBoxId: '#userListBox',
        userRowTemplateId: '#userRowTemplate',
        msgRowTemplateId: '#msgRowTemplate',
    });
    WebRTC.start({
        localVideoId: '#localVideo',
        remoteVideoId: '#remoteVideo',
        localCanvasId: '#localCanvas',
        remoteCanvasId: '#remoteCanvas',
        changeColorBtnId: '#changeColorBtn',
        sendRemoteSvgBtnId: '#sendRemoteSvgBtn',
        removeRemoteSvgBtnId: '#removeRemoteSvgBtn',
        user:${userInfo}
    });
</script>
</body>
</html>