var ChatRoom = (function () {
    var options = null;
    var user = null;
    //채팅룸에 참여한 모든 사용자 조회
    var findAllChatRoomUserUrl = '/findAllChatRoomUser';

    var userRowTemplate = null;
    var msgRowTemplate = null;

    function setUser(userInfo) {
        user = userInfo;
    }

    function init(params) {
        //기본 값이 설정되어 있지 않다면.
        if (!params || !params.messageSendBoxId || !params.messageSendBtnId
            || !params.messageReceiveBoxId || !params.userListBoxId
            || !params.userRowTemplateId || !params.msgRowTemplateId) {
            console.error('You don\'t set essential parameters for chat room');
            return;
        }
        options = params;
        userRowTemplate = $($(params.userRowTemplateId).html());
        msgRowTemplate = $($(params.msgRowTemplateId).html());

        WebSocket.start([{
            desc: '/topic/enterUser',
            callback: function (message) {
                var results = JSON.parse(message.body);
                refreshUserList(results);
            }
        }, {
            desc: '/topic/exitUser',
            callback: function (message) {
                var results = JSON.parse(message.body);
                exitUser(results);
            }
        }, {
            desc: '/topic/message',
            callback: function (message) {
                var results = JSON.parse(message.body);
                receiveMessage(results);
            }
        }, {
            //WebRTC 연결을 위한 sdp 교환 응답을 받음
            desc: '/user/queue/exchangeSdp',
            callback: function (message) {
                var data = JSON.parse(message.body);
                console.log('receive exchangeSdp', data);
                switch (data.type) {
                    case 'offer':   //caller가 callee에게 sdp 정보를 전달
                        var answerFnc = function (callerUserId, calleeUserId, localDescriptionOfCallee) {
                            WebSocket.sendMessage({
                                dest: '/target/user/exchangeSdp',
                                messageInfo: {
                                    type: 'answer',
                                    callerUserId: callerUserId,
                                    calleeUserId: calleeUserId,
                                    sdp: localDescriptionOfCallee
                                }
                            })
                        };
                        WebRTC.receiveOfferOfCaller(data, answerFnc);
                        break;
                    case 'answer':   //callee가 caller에게 sdp 정보를 전달
                        WebRTC.receiveAnswerOfCallee(data);
                        break;
                }
            }
        }, {
            desc: '/queue/exchangeIceCandidate',
            callback: function (message) {
                var data = JSON.parse(message.body);
                console.log('receive exchangeIceCandidate', data);
                WebRTC.receiveNewIceCandidate(data.candidate);

            }
        }], function (isFirstConnection) {  //Web Socket 연결성공시
            setEvent();
            commonUtil.ajax.call({
                type: 'post',
                url: findAllChatRoomUserUrl,
                success: function (results) {
                    refreshUserList(results);
                }
            });
        });
    }

    /**
     * Web Socket 연결 성공시 메시지 전송등의 이벤트 설정
     */
    function setEvent() {
        $(options.messageSendBoxId).unbind('keydown');
        $(options.messageSendBtnId).unbind('click');

        $(options.messageSendBoxId).keydown(function (e) {
            if (e.shiftKey && e.keyCode == 13) {    //shiftKey 실행시 다음줄로 넘기기 위함
            } else if (e.keyCode == 13) {
                $(options.messageSendBtnId).click();
                return false;
            }
        });

        $(options.messageSendBtnId).click(function () {
            var message = $(options.messageSendBoxId).val();
            WebSocket.sendMessage({
                dest: '/chat/user',
                messageInfo: {
                    type: 'MESSAGE',
                    userId: user.userId,
                    userName: user.userName,
                    message: message
                }
            });
            $(options.messageSendBoxId).val('');
        });
    }

    /**
     * 사용자가 추가되는 경우
     * @param users
     */
    function refreshUserList(users) {
        var _user = user;
        $(options.userListBoxId).html('');
        $.each(users, function (idx, user) {
            var $template = userRowTemplate.clone(true);
            if (user.userId == _user.userId) {  //본인의 화면인 경우
                $template.css({color: 'red', fontWeight: 'bold'});
            } else {
                setEventOfStreamConnection($template, user);
            }

            $template.attr('id', 'userBox_{0}'.format(user.userId));
            $template.find('.userName').html(user.userName);
            $template.find('.enterTime').html(commonUtil.date.generateUnixTimeToStr(user.createdDate, 'yyyy.MM.dd HH:mm'));
            $(options.userListBoxId).append($template);
        })
    }

    /**
     * 상대방과 미디어 스트림 연결을 위한 이벤트 설정
     * @param $userBox
     * @param user
     */
    function setEventOfStreamConnection($userBox, remoteUser) {
        $userBox.click(function () {
            var options = {
                isCaller: true,
                calleeUserId: remoteUser.userId,
                callerUserId: user.userId,
                sendSdpOffer: function (callerUserId, calleeUserId, localDescription) {
                    WebSocket.sendMessage({
                        dest: '/target/user/exchangeSdp',
                        messageInfo: {
                            type: 'offer',
                            callerUserId: callerUserId,
                            calleeUserId: calleeUserId,
                            sdp: localDescription
                        }
                    })
                }
            };
            WebRTC.startPeerCommunication(options);

            // WebRTC.createPeerConnection(options);
        });
    }

    /**
     * 사용자가 나간경우
     * @param user
     */
    function exitUser(user) {
        $('#userBox_{0}'.format(user.userId)).remove();
    }

    /**
     * 메시지를 받은경우
     * @param results
     */
    function receiveMessage(results) {
        var $template = msgRowTemplate.clone(true);
        if (user.userId == results.userId) {  //본인의 화면인 경우
            $template.find('.writer').css({color: 'red', fontWeight: 'bold'});
        }
        $template.find('.writer').html(results.userName);
        $template.find('.receiveMsg').html(results.message);
        $template.find('.receiveTime').html(commonUtil.date.generateUnixTimeToStr(results.createdDate, 'yyyy.MM.dd HH:mm'));

        $(options.messageReceiveBoxId).append($template);
        $(options.messageReceiveBoxId).scrollTop($(options.messageReceiveBoxId)[0].scrollHeight);
    }

    return {
        setUser: setUser,
        start: init
    }
})();