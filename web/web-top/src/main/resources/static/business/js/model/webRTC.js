// 참고  : https://docs.google.com/document/d/1tn1t6LW2ffzGuYTK3366w1fhTkkzsSvHsBnOHoDfRzY/edit?pli=1#heading=h.e3366rrgmkdk
// https://github.com/webrtc/samples
// https://webrtc.org/start
// https://codelabs.developers.google.com/codelabs/webrtc-web/#0
// 이걸 참고로하자 -  http://docs.w3cub.com/dom/webrtc_api/signaling_and_video_calling/
var WebRTC = (function () {
    var options = null;
    //참조 : https://www.w3.org/TR/mediacapture-streams/#media-track-constraints
    var constraints = {
        "audio": true,
        "video": {"optional": [{"minWidth": "1280"}, {"minHeight": "720"}], "mandatory": {}}
    };
    var serverConfig = {
        iceServers: [
            {
                urls: [
                    //Google의 Public STUN Server - peer가 방화벽 또는 NAT 뒤에 있는경우 (peer to peer 통신이 불가능해 stun 서버를 통하여 미디어통신)
                    //'stun:stun.l.google.com:19302'
                    'stun:javaweb.iptime.org:3478'
                ]
            },
            {
                urls: [
                    // "turn:64.233.188.127:19305?transport=udp",
                    // "turn:[2404:6800:4008:c06::7f]:19305?transport=udp",
                    // "turn:64.233.188.127:443?transport=tcp",
                    // "turn:[2404:6800:4008:c06::7f]:443?transport=tcp"
                    "turn:javaweb.iptime.org:3478?transport=udp"
                ],
                username: "soul",
                credential: "098098098"
            }
        ],
        //all or relay
        iceTransportPolicy: 'all',
        //negotiate or require
        // rtcpMuxPolicy: 'negotiate',
        iceCandidatePoolSize: 10
    };

    //데이터 통신을 위한 사용자 정보등을 저장
    var communicationInfo = {
        isCaller: true,
        callerUserId: 0,
        calleeUserId: 0,
        localStream: null,   //자신의 로컬 비디오 스트림

        myPeerConnection: null,
        sendSdpOfferFnc: null,  //caller가 callee에게 sdp를 전달할 때 호출할 함수
    };
    var sendIceCandidateFnc = null;

    var myGetUserMedia = null;
    var canvasUtil = null;

    function init(params) {
        //기본 값이 설정되어 있지 않다면.
        if (!params
            || !params.remoteVideoId || !params.localVideoId
            || !params.localCanvasId || !params.remoteCanvasId
            || !params.changeColorBtnId
            || !params.sendRemoteSvgBtnId || !params.removeRemoteSvgBtnId
            || !params.user
        ) {
            console.error('You don\'t set essential parameters for webrtc');
            return;
        }
        options = params;

        //Connect local stream
        myGetUserMedia = navigator.mediaDevices.getUserMedia(constraints);
        myGetUserMedia.then(function (localStream) {
            communicationInfo.localStream = localStream;
            $(options.localVideoId).get(0).srcObject = localStream;
            setTimeout(function () {
                canvasUtil = new CanvasUtil(options.localCanvasId, options.localVideoId);
                canvasUtil.init(false);
            }, 500);
        }).catch(function failLocalVideo(e) {
            switch (e.name) {
                case 'NotFoundError':
                    alert('카메라 또는 오디오를 찾지 못하였습니다.')
                    break;
                case "SecurityError":
                case "PermissionDeniedError":
                    //사용자가 호출을 취소한것과 같음 (브라우져의 미디어 허용 팝업을 거절한 것임)
                    break;
                default:
                    alert("Error opening your camera and/or microphone: " + e.message);
            }
        });

        WebRTC.setSendIceCandidateFnc(function (isCaller, callerUserId, calleeUserId, candidate) {
            WebSocket.sendMessage({
                dest: '/target/user/exchangeIceCandidate',
                messageInfo: {
                    type: isCaller ? 'iceToCallee' : 'iceToCaller',
                    callerUserId: callerUserId,
                    calleeUserId: calleeUserId,
                    candidate: candidate
                }
            })
        });
    }

    /**
     * 1 Peer to Peer 통신을 위해 로컬 비디오 스트림을 연결하고 (caller가 callee 호출)
     * - caller가 callee 호출시
     * - callee가 caller의 offer를 받은경우 호출 (receiveOfferOfCaller)
     */
    function startPeerCommunication(options) {
        communicationInfo.callerUserId = options.callerUserId;
        communicationInfo.calleeUserId = options.calleeUserId;
        communicationInfo.sendSdpOfferFnc = options.sendSdpOffer;
        createPeerConnection();
    }

    /**
     * 2 Peer 통신을 위한 컨넥션설정 (caller, callee에 의해서 사용되어지는 함수이다.)
     */
    function createPeerConnection() {
        if (communicationInfo.localStream == null) {
            alert('로컬 미디어 스트림에 접근하지 못하였습니다.');
            return;
        }

        if (communicationInfo.myPeerConnection != null) {
            alert('이미 연결중입니다.');
            return;
        }

        communicationInfo.myPeerConnection = new RTCPeerConnection(serverConfig);
        //Stream을 WebRTC 컨넥션으로 공급
        communicationInfo.myPeerConnection.addStream(communicationInfo.localStream);

        //2.1 callee에게 offer를 전송하기 위해 호출됨 (시작점)
        communicationInfo.myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;

        //3 signaling server를 통하여 다른 peer로 ice candidate 전달
        communicationInfo.myPeerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                sendIceCandidateFnc(
                    communicationInfo.isCaller,
                    communicationInfo.callerUserId,
                    communicationInfo.calleeUserId,
                    event.candidate
                );
            }
        };

        //Z.1 다른 peer의 스트림을 연결
        communicationInfo.myPeerConnection.onaddstream = function (event) {
            $(options.remoteVideoId).get(0).srcObject = event.stream;
            setTimeout(function () {
                var remoteUserId = communicationInfo.callerUserId;
                if (remoteUserId == options.user.userId) {
                    remoteUserId = communicationInfo.calleeUserId;
                }

                var remoteCanvasUtil = new CanvasUtil(
                    options.remoteCanvasId,
                    options.remoteVideoId,
                    options.changeColorBtnId,
                    options.sendRemoteSvgBtnId,
                    options.removeRemoteSvgBtnId,
                    remoteUserId,
                    canvasUtil
                );
                remoteCanvasUtil.init(true);
            }, 500);
            // document.getElementById("hangup-button").disabled = false;
        };

        //Z.2 Stream을 닫을때
        communicationInfo.myPeerConnection.onremovestream = closeVideoCall;

        //Z.3 connection 상태가 변경될때 Ice layer에 의해서 발생되는 이벤트
        communicationInfo.myPeerConnection.oniceconnectionstatechange = function (event) {
            if (communicationInfo.myPeerConnection != null) {
                switch (communicationInfo.myPeerConnection.iceConnectionState) {
                    case "closed":
                    case "failed":
                    case "disconnected":
                        closeVideoCall(event);
                        break;
                }
            }
        };

        //Z.4 siganling의 사태가 closed로 변경된 경우
        communicationInfo.myPeerConnection.onsignalingstatechange = function (event) {
            if (communicationInfo.myPeerConnection != null) {
                switch (communicationInfo.myPeerConnection.signalingState) {
                    case "closed":
                        closeVideoCall(event);
                        break;
                }
            }
        };

        //Z.5 ice candidate 모으는 프로세스의 상태가 변경되는 경우
        communicationInfo.myPeerConnection.onicegatheringstatechange = function (event) {
            console.log('chage ice gathering', event);
        };
    }

    /**
     * 2.1 caller > callee 에게 SDP 데이터를 전달
     */
    function handleNegotiationNeededEvent() {
        console.log('2.1 send sdp to callee');
        communicationInfo.myPeerConnection.createOffer().then(function (offer) {
            return communicationInfo.myPeerConnection.setLocalDescription(offer);
        }).then(function () {
            communicationInfo.sendSdpOfferFnc(
                communicationInfo.callerUserId,
                communicationInfo.calleeUserId,
                communicationInfo.myPeerConnection.localDescription
            );
        }).catch(function (e) {
            console.log('2.1 Error send sdp to callee', e);
        });
    }

    /**
     * 2.2 callee 가 caller 의 sdp 데이터를 받고 caller 에게 sdp 데이터를 전달
     */
    function receiveOfferOfCaller(data, answerFnc) {
        data.isCaller = false;
        startPeerCommunication(data);
        var desc = new RTCSessionDescription(data.sdp);
        communicationInfo.myPeerConnection.setRemoteDescription(desc).then(function () {
            return myGetUserMedia;
        }).then(function () {
            return communicationInfo.myPeerConnection.createAnswer();
        }).then(function (answer) {
            return communicationInfo.myPeerConnection.setLocalDescription(answer);
        }).then(function () {
            answerFnc(
                communicationInfo.callerUserId,
                communicationInfo.calleeUserId,
                communicationInfo.myPeerConnection.localDescription
            );
        }).catch(function (e) {
            console.log('2.2 Error send sdp to caller', e);
        });
    }

    /**
     * 2.3 caller 가 callee 의 sdp 데이터를 받음
     */
    function receiveAnswerOfCallee(data) {
        communicationInfo.myPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
    }

    /**
     * 3.1 caller 와 callee 가 새로운 ice candidate 정보를 받음
     * @param candidate
     */
    function receiveNewIceCandidate(newCandidate) {
        var candidate = new RTCIceCandidate(newCandidate);
        communicationInfo.myPeerConnection.addIceCandidate(candidate).catch(function (e) {
            console.log('3.1 Error receive new ice', e);
        });
    }

    function closeVideoCall(event) {
        if ($(options.remoteVideoId).get(0).srcObject) {
            $.each($(options.remoteVideoId).get(0).srcObject.getTracks(), function (idx, track) {
                track.stop();
            });
            $(options.remoteVideoId).get(0).srcObject = null;
        }
        $(options.remoteCanvasId).css('display', 'none');
        communicationInfo.myPeerConnection.close();
        communicationInfo.myPeerConnection = null;
    }

    function setSendIceCandidateFnc(fnc) {
        sendIceCandidateFnc = fnc;
    }

    return {
        start: init,
        startPeerCommunication: startPeerCommunication,
        receiveOfferOfCaller: receiveOfferOfCaller,
        receiveAnswerOfCallee: receiveAnswerOfCallee,
        receiveNewIceCandidate: receiveNewIceCandidate,
        setSendIceCandidateFnc: setSendIceCandidateFnc
    }
})();